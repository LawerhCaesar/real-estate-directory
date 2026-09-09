import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ensureDatabase, rowToListing, type ListingRow } from '../../../../db';
import { ACCESS_TOKEN_COOKIE, getAdminIdentity, isSameOrigin } from '../../../../lib/admin-auth';
import { parseListingInput } from '../../../../lib/listing-input';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const cookieStore = await cookies();
  const identity = await getAdminIdentity(cookieStore.get(ACCESS_TOKEN_COOKIE)?.value);
  if (!identity.authenticated) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  if (!identity.authorized) return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });

  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: 'Invalid listing reference.' }, { status: 400 });

  const input = parseListingInput(await request.json().catch(() => null));
  if (!input) return NextResponse.json({ error: 'Please complete every required field.' }, { status: 400 });

  try {
    const db = await ensureDatabase();
    const result = await db.execute({
      sql: `
        UPDATE listings
        SET area = ?, title = ?, size = ?, price = ?, deal = ?, asset_type = ?, notes = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND active = 1
      `,
      args: [input.area, input.title, input.size, input.price, input.deal, input.assetType, input.notes ?? null, identity.email, id],
    });

    if (!result.rowsAffected) return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    const updated = await db.execute({ sql: `
      SELECT id, area, title, size, price, deal, asset_type, notes
      FROM listings WHERE id = ?
    `, args: [id] });

    if (!updated.rows[0]) return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    return NextResponse.json({ listing: rowToListing(updated.rows[0] as unknown as ListingRow) });
  } catch (error) {
    console.error('Unable to update listing', error);
    return NextResponse.json({ error: 'The listing could not be saved.' }, { status: 500 });
  }
}
