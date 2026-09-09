import { timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE, isVercelAuthConfigured } from '../../../../lib/admin-auth';

type TokenResponse = {
  access_token: string;
  id_token: string;
  expires_in: number;
};

function matches(left?: string | null, right?: string | null) {
  if (!left || !right) return false;
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function tokenNonce(idToken: string) {
  try {
    const payload = JSON.parse(Buffer.from(idToken.split('.')[1] ?? '', 'base64url').toString('utf8')) as { nonce?: string };
    return payload.nonce ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const errorUrl = new URL('/auth/error', request.url);

  try {
    if (!isVercelAuthConfigured()) throw new Error('OAuth is not configured.');
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');
    const storedState = cookieStore.get('hotwaves_oauth_state')?.value;
    const storedNonce = cookieStore.get('hotwaves_oauth_nonce')?.value;
    const verifier = cookieStore.get('hotwaves_oauth_verifier')?.value;
    const returnTo = cookieStore.get('hotwaves_oauth_return_to')?.value || '/admin';

    if (!code || !verifier || !matches(state, storedState)) throw new Error('Invalid OAuth callback.');

    const response = await fetch('https://api.vercel.com/login/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_VERCEL_APP_CLIENT_ID!,
        client_secret: process.env.VERCEL_APP_CLIENT_SECRET!,
        code,
        code_verifier: verifier,
        redirect_uri: `${request.nextUrl.origin}/api/auth/callback`,
      }),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Token exchange failed.');

    const token = await response.json() as TokenResponse;
    if (!matches(tokenNonce(token.id_token), storedNonce)) throw new Error('Invalid OAuth nonce.');

    cookieStore.set(ACCESS_TOKEN_COOKIE, token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: token.expires_in,
    });
    for (const name of ['hotwaves_oauth_state', 'hotwaves_oauth_nonce', 'hotwaves_oauth_verifier', 'hotwaves_oauth_return_to']) {
      cookieStore.delete(name);
    }
    return NextResponse.redirect(new URL(returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/admin', request.url));
  } catch (error) {
    console.error('Administrator sign-in failed', error);
    return NextResponse.redirect(errorUrl);
  }
}
