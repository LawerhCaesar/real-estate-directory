import { scrypt, timingSafeEqual } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'hotwaves_admin_session';
export const SESSION_DURATION_SECONDS = 12 * 60 * 60;

export type AdminIdentity = {
  authenticated: boolean;
  authorized: boolean;
  username: string | null;
};

const developmentUsername = 'hotwaves-team';
const developmentPassword = 'hotwaves-dev';
const developmentSecret = 'hotwaves-local-session-secret-not-for-production';

function configuredUsername() {
  return process.env.ADMIN_USERNAME?.trim() || (process.env.NODE_ENV !== 'production' ? developmentUsername : '');
}

function sessionSecret() {
  const value = process.env.SESSION_SECRET || (process.env.NODE_ENV !== 'production' ? developmentSecret : '');
  if (value.length < 32) throw new Error('SESSION_SECRET must contain at least 32 characters.');
  return new TextEncoder().encode(value);
}

function derivePassword(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(key as Buffer));
  });
}

async function passwordMatches(password: string, encodedHash: string) {
  const [algorithm, saltValue, digestValue] = encodedHash.split('$');
  if (algorithm !== 'scrypt' || !saltValue || !digestValue) return false;

  try {
    const salt = Buffer.from(saltValue, 'base64url');
    const expected = Buffer.from(digestValue, 'base64url');
    const actual = await derivePassword(password, salt);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function isSharedAuthConfigured() {
  if (process.env.NODE_ENV !== 'production') return true;
  return Boolean(configuredUsername() && process.env.ADMIN_PASSWORD_HASH?.startsWith('scrypt$') && (process.env.SESSION_SECRET?.length ?? 0) >= 32);
}

export async function verifySharedCredentials(username: string, password: string) {
  const expectedUsername = configuredUsername();
  if (!expectedUsername || username !== expectedUsername) {
    await derivePassword(password, Buffer.from('hotwaves-invalid-user'));
    return false;
  }

  if (process.env.NODE_ENV !== 'production' && !process.env.ADMIN_PASSWORD_HASH) {
    return password === developmentPassword;
  }
  return passwordMatches(password, process.env.ADMIN_PASSWORD_HASH ?? '');
}

export async function createSessionToken(username: string) {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(sessionSecret());
}

export async function getAdminIdentity(sessionToken?: string | null): Promise<AdminIdentity> {
  if (!sessionToken) return { authenticated: false, authorized: false, username: null };

  try {
    const { payload } = await jwtVerify(sessionToken, sessionSecret(), { algorithms: ['HS256'] });
    const valid = payload.role === 'admin' && payload.sub === configuredUsername();
    return { authenticated: valid, authorized: valid, username: valid ? payload.sub ?? null : null };
  } catch {
    return { authenticated: false, authorized: false, username: null };
  }
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

export function localDevelopmentCredentials() {
  if (process.env.NODE_ENV === 'production' || process.env.ADMIN_PASSWORD_HASH) return null;
  return { username: developmentUsername, password: developmentPassword };
}
