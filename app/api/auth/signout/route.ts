import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE, isSameOrigin } from '../../../../lib/admin-auth';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (token && process.env.NEXT_PUBLIC_VERCEL_APP_CLIENT_ID && process.env.VERCEL_APP_CLIENT_SECRET) {
    const credentials = Buffer.from(`${process.env.NEXT_PUBLIC_VERCEL_APP_CLIENT_ID}:${process.env.VERCEL_APP_CLIENT_SECRET}`).toString('base64');
    await fetch('https://api.vercel.com/login/oauth/token/revoke', {
      method: 'POST',
      headers: { Authorization: `Basic ${credentials}` },
      body: new URLSearchParams({ token }),
      cache: 'no-store',
    }).catch((error) => console.error('Unable to revoke Vercel access token', error));
  }

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  return NextResponse.redirect(new URL('/admin', request.url), 303);
}
