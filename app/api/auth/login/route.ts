import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { ensureDatabase } from '../../../../db';
import {
  createSessionToken,
  isSameOrigin,
  isSharedAuthConfigured,
  SESSION_COOKIE,
  SESSION_DURATION_SECONDS,
  verifySharedCredentials,
} from '../../../../lib/admin-auth';

const maximumFailures = 5;
const lockDurationMs = 15 * 60 * 1000;

function safeReturnPath(value: FormDataEntryValue | null) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/admin';
}

function loginRedirect(request: NextRequest, reason: string) {
  const url = new URL('/admin/login', request.url);
  url.searchParams.set('error', reason);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  if (!isSharedAuthConfigured()) return loginRedirect(request, 'configuration');

  const form = await request.formData();
  const username = String(form.get('username') ?? '').trim();
  const password = String(form.get('password') ?? '');
  const returnTo = safeReturnPath(form.get('returnTo'));
  if (!username || username.length > 100 || !password || password.length > 256) return loginRedirect(request, 'invalid');

  const forwardedAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const identifier = createHash('sha256').update(`${forwardedAddress}:${username.toLowerCase()}`).digest('hex');
  const db = await ensureDatabase();
  const attempts = await db.execute({
    sql: 'SELECT failures, locked_until FROM auth_attempts WHERE identifier = ?',
    args: [identifier],
  });
  const current = attempts.rows[0] as { failures?: number | bigint; locked_until?: string | null } | undefined;
  const lockedUntil = current?.locked_until ? Date.parse(String(current.locked_until)) : 0;
  if (lockedUntil > Date.now()) return loginRedirect(request, 'locked');

  if (!await verifySharedCredentials(username, password)) {
    const failures = (lockedUntil ? 0 : Number(current?.failures ?? 0)) + 1;
    const nextLock = failures >= maximumFailures ? new Date(Date.now() + lockDurationMs).toISOString() : null;
    await db.execute({
      sql: `
        INSERT INTO auth_attempts (identifier, failures, locked_until, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(identifier) DO UPDATE SET
          failures = excluded.failures,
          locked_until = excluded.locked_until,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [identifier, failures, nextLock],
    });
    return loginRedirect(request, failures >= maximumFailures ? 'locked' : 'invalid');
  }

  await db.execute({ sql: 'DELETE FROM auth_attempts WHERE identifier = ?', args: [identifier] });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, await createSessionToken(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
    priority: 'high',
  });
  return NextResponse.redirect(new URL(returnTo, request.url), 303);
}
