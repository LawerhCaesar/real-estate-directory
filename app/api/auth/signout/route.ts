import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isSameOrigin, SESSION_COOKIE } from '../../../../lib/admin-auth';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return NextResponse.redirect(new URL('/admin', request.url), 303);
}
