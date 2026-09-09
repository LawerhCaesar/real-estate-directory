export const ACCESS_TOKEN_COOKIE = 'hotwaves_access_token';

export type AdminIdentity = {
  authenticated: boolean;
  authorized: boolean;
  email: string | null;
  name: string | null;
};

type VercelUser = {
  email?: string;
  name?: string;
};

function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isVercelAuthConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_VERCEL_APP_CLIENT_ID && process.env.VERCEL_APP_CLIENT_SECRET);
}

export async function getAdminIdentity(accessToken?: string | null): Promise<AdminIdentity> {
  if (process.env.NODE_ENV !== 'production' && !isVercelAuthConfigured()) {
    const email = (process.env.DEV_ADMIN_EMAIL || adminEmails()[0] || 'developer@hotwaves.local').toLowerCase();
    return { authenticated: true, authorized: true, email, name: 'Local development' };
  }

  if (!accessToken) return { authenticated: false, authorized: false, email: null, name: null };

  try {
    const response = await fetch('https://api.vercel.com/login/oauth/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!response.ok) return { authenticated: false, authorized: false, email: null, name: null };

    const user = await response.json() as VercelUser;
    const email = user.email?.trim().toLowerCase() ?? null;
    return {
      authenticated: Boolean(email),
      authorized: Boolean(email && adminEmails().includes(email)),
      email,
      name: user.name?.trim() || null,
    };
  } catch (error) {
    console.error('Unable to validate administrator identity', error);
    return { authenticated: false, authorized: false, email: null, name: null };
  }
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}
