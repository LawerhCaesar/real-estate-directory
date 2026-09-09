import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <main className="admin-gate">
      <section>
        <Link className="brand" href="/"><span className="brand-mark">H</span><span className="brand-copy"><b>HOTWAVES</b><small>REAL ESTATE AGENCY</small></span></Link>
        <p className="admin-kicker">Sign-in problem</p>
        <h1>We couldn’t<br /><em>sign you in.</em></h1>
        <p>Check the Vercel sign-in configuration or try again. No inventory changes were made.</p>
        <a className="admin-primary-link" href="/api/auth/authorize?returnTo=/admin">Try again <span>→</span></a>
        <Link className="admin-back-link" href="/">← Return to public directory</Link>
      </section>
    </main>
  );
}
