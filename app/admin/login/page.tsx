import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminIdentity, localDevelopmentCredentials, SESSION_COOKIE } from '../../../lib/admin-auth';

export const dynamic = 'force-dynamic';

const messages: Record<string, string> = {
  invalid: 'The username or password is incorrect.',
  locked: 'Too many unsuccessful attempts. Please wait 15 minutes and try again.',
  configuration: 'The production login has not been configured yet.',
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const cookieStore = await cookies();
  const identity = await getAdminIdentity(cookieStore.get(SESSION_COOKIE)?.value);
  if (identity.authorized) redirect('/admin');

  const parameters = await searchParams;
  const message = parameters.error ? messages[parameters.error] : null;
  const localCredentials = localDevelopmentCredentials();

  return (
    <main className="admin-gate">
      <section>
        <Link className="brand" href="/"><span className="brand-mark">H</span><span className="brand-copy"><b>HOTWAVES</b><small>REAL ESTATE AGENCY</small></span></Link>
        <p className="admin-kicker">Team sign-in</p>
        <h1>Manage the<br /><em>property list.</em></h1>
        <p>Use the shared Hotwaves team credentials to add opportunities or update existing details.</p>
        <form className="admin-login-form" action="/api/auth/login" method="post">
          <input type="hidden" name="returnTo" value="/admin" />
          <label><span>Username</span><input required name="username" autoComplete="username" maxLength={100} /></label>
          <label><span>Password</span><input required name="password" type="password" autoComplete="current-password" maxLength={256} /></label>
          {message && <p className="admin-login-error" role="alert">{message}</p>}
          {localCredentials && <p className="admin-login-hint">Local preview: {localCredentials.username} / {localCredentials.password}</p>}
          <button>Sign in <span>→</span></button>
        </form>
        <Link className="admin-back-link" href="/">← Return to public directory</Link>
      </section>
    </main>
  );
}
