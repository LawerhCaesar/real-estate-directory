import { NextResponse } from 'next/server';
import { ensureDatabase, rowToListing, type ListingRow } from '../../../db';
import { getAdminIdentity } from '../../../lib/admin-auth';
import { parseListingInput } from '../../../lib/listing-input';
import { listings as seedListings } from '../../listings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await ensureDatabase();
    if (!db) return NextResponse.json({ listings: seedListings, source: 'seed' });

    const result = await db.prepare(`
      SELECT id, area, title, size, price, deal, asset_type, notes
      FROM listings
      WHERE active = 1
      ORDER BY id ASC
    `).all<ListingRow>();

    return NextResponse.json({ listings: result.results.map(rowToListing), source: 'database' });
  } catch (error) {
    console.error('Unable to read listings database', error);
    return NextResponse.json({ listings: seedListings, source: 'seed' });
  }
}

export async function POST(request: Request) {
  const identity = getAdminIdentity(request.headers);
  if (!identity.authenticated) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  if (!identity.authorized) return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });

  const input = parseListingInput(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: 'Please complete every required field.' }, { status: 400 });

  try {
    const db = await ensureDatabase();
    if (!db) return NextResponse.json({ error: 'The listings database is unavailable.' }, { status: 503 });

    const result = await db.prepare(`
      INSERT INTO listings (area, title, size, price, deal, asset_type, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      input.area,
      input.title,
      input.size,
      input.price,
      input.deal,
      input.assetType,
      input.notes ?? null,
    ).run();
    const id = Number(result.meta.last_row_id);
    const created = await db.prepare(`
      SELECT id, area, title, size, price, deal, asset_type, notes
      FROM listings WHERE id = ?
    `).bind(id).first<ListingRow>();

    if (!created) return NextResponse.json({ error: 'The listing could not be created.' }, { status: 500 });
    return NextResponse.json({ listing: rowToListing(created) }, { status: 201 });
  } catch (error) {
    console.error('Unable to create listing', error);
    return NextResponse.json({ error: 'The listing could not be saved.' }, { status: 500 });
  }
}
