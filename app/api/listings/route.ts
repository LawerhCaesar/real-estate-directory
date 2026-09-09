import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ensureDatabase, rowToListing, type ListingRow } from '../../../db';
import { getAdminIdentity, isSameOrigin, SESSION_COOKIE } from '../../../lib/admin-auth';
import { parseListingInput } from '../../../lib/listing-input';
import { listings as seedListings } from '../../listings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await ensureDatabase();
    const result = await db.execute(`
      SELECT id, area, title, size, price, deal, asset_type, notes
      FROM listings
      WHERE active = 1
      ORDER BY id ASC
    `);

    return NextResponse.json({ listings: result.rows.map((row) => rowToListing(row as unknown as ListingRow)), source: 'database' });
  } catch (error) {
    console.error('Unable to read listings database', error);
    return NextResponse.json({ listings: seedListings, source: 'seed' });
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const cookieStore = await cookies();
  const identity = await getAdminIdentity(cookieStore.get(SESSION_COOKIE)?.value);
  if (!identity.authenticated) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  if (!identity.authorized) return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });

  const input = parseListingInput(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: 'Please complete every required field.' }, { status: 400 });

  try {
    const db = await ensureDatabase();
    const result = await db.execute({
      sql: `
        INSERT INTO listings (area, title, size, price, deal, asset_type, notes, created_by, updated_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [input.area, input.title, input.size, input.price, input.deal, input.assetType, input.notes ?? null, identity.username, identity.username],
    });
    const id = Number(result.lastInsertRowid);
    const created = await db.execute({ sql: `
      SELECT id, area, title, size, price, deal, asset_type, notes
      FROM listings WHERE id = ?
    `, args: [id] });

    if (!created.rows[0]) return NextResponse.json({ error: 'The listing could not be created.' }, { status: 500 });
    return NextResponse.json({ listing: rowToListing(created.rows[0] as unknown as ListingRow) }, { status: 201 });
  } catch (error) {
    console.error('Unable to create listing', error);
    return NextResponse.json({ error: 'The listing could not be saved.' }, { status: 500 });
  }
}
