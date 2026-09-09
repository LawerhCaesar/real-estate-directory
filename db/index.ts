import type { D1Database } from '@cloudflare/workers-types';
import { env } from 'cloudflare:workers';
import { listings as seedListings, type Listing } from '../app/listings';
import { createListingsTableSql } from './schema';

export type ListingRow = {
  id: number;
  area: string;
  title: string;
  size: string;
  price: string;
  deal: Listing['deal'];
  asset_type: Listing['assetType'];
  notes: string | null;
};

export function getDatabase(): D1Database | null {
  return (env as unknown as { DB?: D1Database }).DB ?? null;
}

export async function ensureDatabase() {
  const db = getDatabase();
  if (!db) return null;

  await db.prepare(createListingsTableSql).run();
  const count = await db.prepare('SELECT COUNT(*) AS total FROM listings').first<{ total: number }>();

  if (!count?.total) {
    const inserts = seedListings.map((listing) => db.prepare(`
      INSERT OR IGNORE INTO listings (id, area, title, size, price, deal, asset_type, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      listing.id,
      listing.area,
      listing.title,
      listing.size,
      listing.price,
      listing.deal,
      listing.assetType,
      listing.notes ?? null,
    ));
    await db.batch(inserts);
  }

  await db.prepare('PRAGMA optimize').run();
  return db;
}

export function rowToListing(row: ListingRow): Listing {
  return {
    id: row.id,
    area: row.area,
    title: row.title,
    size: row.size,
    price: row.price,
    deal: row.deal,
    assetType: row.asset_type,
    ...(row.notes ? { notes: row.notes } : {}),
  };
}
