import { cookies } from 'next/headers';
import Link from 'next/link';
import { ACCESS_TOKEN_COOKIE, getAdminIdentity } from '../../lib/admin-auth';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const identity = await getAdminIdentity(cookieStore.get(ACCESS_TOKEN_COOKIE)?.value);

  if (!identity.authenticated) {
    return (
      <main className="admin-gate">
        <section>
          <Link className="brand" href="/"><span className="brand-mark">H</span><span className="brand-copy"><b>HOTWAVES</b><small>REAL ESTATE AGENCY</small></span></Link>
          <p className="admin-kicker">Private inventory</p>
          <h1>Manage the<br /><em>property list.</em></h1>
          <p>Sign in with an approved Hotwaves account to add opportunities or update existing details.</p>
          <a className="admin-primary-link" href="/api/auth/authorize?returnTo=/admin">Sign in with Vercel <span>→</span></a>
          <Link className="admin-back-link" href="/">← Return to public directory</Link>
        </section>
      </main>
    );
  }

  if (!identity.authorized) {
    return (
      <main className="admin-gate">
        <section>
          <Link className="brand" href="/"><span className="brand-mark">H</span><span className="brand-copy"><b>HOTWAVES</b><small>REAL ESTATE AGENCY</small></span></Link>
          <p className="admin-kicker">Access restricted</p>
          <h1>This account is<br /><em>not an administrator.</em></h1>
          <p>{identity.email ?? 'Your signed-in account'} does not have permission to change the inventory.</p>
          <form className="admin-primary-form" action="/api/auth/signout" method="post"><button>Use a different account <span>→</span></button></form>
          <Link className="admin-back-link" href="/">← Return to public directory</Link>
        </section>
      </main>
    );
  }

  return <AdminDashboard userEmail={identity.email ?? ''} />;
}
