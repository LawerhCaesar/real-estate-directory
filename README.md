# Hotwaves Real Estate Agency

A public Accra property directory with a private inventory manager for a three-person team.

## Production architecture

- Next.js App Router, deployable directly to Vercel.
- Turso/libSQL for a small persistent SQLite database.
- One shared username and password for the three-person team.
- A signed, HTTP-only 12-hour management session with server-side checks on every write.
- Login throttling after repeated failures.
- The public inventory API is read-only; all mutations validate the signed-in user and same-origin request on the server.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Run `npm run db:migrate`.
3. Run `npm run dev` and open `http://localhost:3000`.
4. Use the local-only credentials shown on `/admin/login`.

The local database is `data/hotwaves.db` and is ignored by Git. The existing 59 records are inserted automatically when the database is empty.

## Vercel setup

1. Import this repository into Vercel as a Next.js project.
2. Install **Turso Cloud** from Vercel Marketplace and connect one database. Confirm `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are available to Production and Preview deployments.
3. Choose the shared username and set it as `ADMIN_USERNAME`.
4. Generate and save a strong shared password in a secure password manager. Run `read -s HOTWAVES_PASSWORD`, paste the password, press Enter, then run `printf '%s' "$HOTWAVES_PASSWORD" | npm run auth:hash --silent`. Save the output as the `ADMIN_PASSWORD_HASH` secret in Vercel, then run `unset HOTWAVES_PASSWORD`.
5. Generate the session signing secret with `openssl rand -base64 32` and save it as the `SESSION_SECRET` secret in Vercel.
6. Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS domain.
7. Run the migration against the production credentials once: `npm run db:migrate`.
8. Deploy, then verify `/`, `/api/listings`, `/admin/login`, sign-in, sign-out, one edit, and one addition.

The shared account intentionally records changes under one team username. It cannot identify which team member made an edit.

Never commit `.env.local`, database tokens, password hashes, session secrets, or the local database file.
