import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminIdentity, SESSION_COOKIE } from '../../lib/admin-auth';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const identity = await getAdminIdentity(cookieStore.get(SESSION_COOKIE)?.value);

  if (!identity.authenticated) redirect('/admin/login');

  if (!identity.authorized) {
    return (
      <main className="admin-gate">
        <section>
          <Link className="brand" href="/"><span className="brand-mark">H</span><span className="brand-copy"><b>HOTWAVES</b><small>REAL ESTATE AGENCY</small></span></Link>
          <p className="admin-kicker">Access restricted</p>
          <h1>This account is<br /><em>not an administrator.</em></h1>
          <p>Your current session does not have permission to change the inventory.</p>
          <form className="admin-primary-form" action="/api/auth/signout" method="post"><button>Use a different account <span>→</span></button></form>
          <Link className="admin-back-link" href="/">← Return to public directory</Link>
        </section>
      </main>
    );
  }

  return <AdminDashboard userName={identity.username ?? 'Hotwaves team'} />;
}
