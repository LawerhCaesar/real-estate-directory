import { headers } from 'next/headers';
import Link from 'next/link';
import { getAdminIdentity } from '../../lib/admin-auth';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const identity = getAdminIdentity(await headers());

  if (!identity.authenticated) {
    return (
      <main className="admin-gate">
        <section>
          <Link className="brand" href="/"><span className="brand-mark">H</span><span className="brand-copy"><b>HOTWAVES</b><small>REAL ESTATE AGENCY</small></span></Link>
          <p className="admin-kicker">Private inventory</p>
          <h1>Manage the<br /><em>property list.</em></h1>
          <p>Sign in with an approved Hotwaves account to add opportunities or update existing details.</p>
          <a className="admin-primary-link" href="/signin-with-chatgpt?return_to=/admin">Sign in to continue <span>→</span></a>
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
          <a className="admin-primary-link" href="/signin-with-chatgpt/logout?return_to=/admin">Use a different account <span>→</span></a>
          <Link className="admin-back-link" href="/">← Return to public directory</Link>
        </section>
      </main>
    );
  }

  return <AdminDashboard userEmail={identity.email ?? ''} />;
}
