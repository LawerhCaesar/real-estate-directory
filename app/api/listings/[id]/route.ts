import { NextResponse } from 'next/server';
import { ensureDatabase, rowToListing, type ListingRow } from '../../../../db';
import { getAdminIdentity } from '../../../../lib/admin-auth';
import { parseListingInput } from '../../../../lib/listing-input';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = getAdminIdentity(request.headers);
  if (!identity.authenticated) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  if (!identity.authorized) return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });

  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: 'Invalid listing reference.' }, { status: 400 });

  const input = parseListingInput(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: 'Please complete every required field.' }, { status: 400 });

  try {
    const db = await ensureDatabase();
    if (!db) return NextResponse.json({ error: 'The listings database is unavailable.' }, { status: 503 });

    const result = await db.prepare(`
      UPDATE listings
      SET area = ?, title = ?, size = ?, price = ?, deal = ?, asset_type = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND active = 1
    `).bind(
      input.area,
      input.title,
      input.size,
      input.price,
      input.deal,
      input.assetType,
      input.notes ?? null,
      id,
    ).run();

    if (!result.meta.changes) return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    const updated = await db.prepare(`
      SELECT id, area, title, size, price, deal, asset_type, notes
      FROM listings WHERE id = ?
    `).bind(id).first<ListingRow>();

    if (!updated) return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    return NextResponse.json({ listing: rowToListing(updated) });
  } catch (error) {
    console.error('Unable to update listing', error);
    return NextResponse.json({ error: 'The listing could not be saved.' }, { status: 500 });
  }
}
