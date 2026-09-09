# Hotwaves Real Estate Agency

A public Accra property directory with a private inventory manager for a three-person team.

## Production architecture

- Next.js App Router, deployable directly to Vercel.
- Turso/libSQL for a small persistent SQLite database.
- Sign in with Vercel for individual team identities.
- `ADMIN_EMAILS` as the server-side allowlist for the three people who may add or edit listings.
- The public inventory API is read-only; all mutations validate the signed-in user and same-origin request on the server.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Set `DEV_ADMIN_EMAIL` to your email. OAuth is bypassed only in non-production when Vercel OAuth credentials are absent.
3. Run `npm run db:migrate`.
4. Run `npm run dev` and open `http://localhost:3000`.

The local database is `data/hotwaves.db` and is ignored by Git. The existing 59 records are inserted automatically when the database is empty.

## Vercel setup

1. Import this repository into Vercel as a Next.js project.
2. Install **Turso Cloud** from Vercel Marketplace and connect one database. Confirm `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are available to Production and Preview deployments.
3. Create a **Sign in with Vercel** app with `openid`, `email`, and `profile` scopes. Add these callback URLs:
   - `http://localhost:3000/api/auth/callback`
   - `https://YOUR_DOMAIN/api/auth/callback`
4. Add `NEXT_PUBLIC_VERCEL_APP_CLIENT_ID` and `VERCEL_APP_CLIENT_SECRET` to Vercel.
5. Set `ADMIN_EMAILS` to the three approved Vercel-account emails, separated by commas.
6. Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS domain.
7. Run the migration against the production credentials once: `npm run db:migrate`.
8. Deploy, then verify `/`, `/api/listings`, `/admin`, sign-in, one edit, and one addition.

Never commit `.env.local`, database tokens, OAuth secrets, or the local database file.
