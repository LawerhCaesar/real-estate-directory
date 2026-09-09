import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { isVercelAuthConfigured } from '../../../../lib/admin-auth';

export const dynamic = 'force-dynamic';

function safeReturnPath(value: string | null) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : '/admin';
}

export async function GET(request: NextRequest) {
  if (!isVercelAuthConfigured()) {
    return NextResponse.redirect(new URL('/auth/error?reason=configuration', request.url));
  }

  const state = randomBytes(32).toString('base64url');
  const nonce = randomBytes(32).toString('base64url');
  const verifier = randomBytes(48).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 10 * 60,
  };

  cookieStore.set('hotwaves_oauth_state', state, options);
  cookieStore.set('hotwaves_oauth_nonce', nonce, options);
  cookieStore.set('hotwaves_oauth_verifier', verifier, options);
  cookieStore.set('hotwaves_oauth_return_to', safeReturnPath(request.nextUrl.searchParams.get('returnTo')), options);

  const parameters = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_VERCEL_APP_CLIENT_ID!,
    redirect_uri: `${request.nextUrl.origin}/api/auth/callback`,
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    response_type: 'code',
    scope: 'openid email profile',
  });
  return NextResponse.redirect(`https://vercel.com/oauth/authorize?${parameters.toString()}`);
}
