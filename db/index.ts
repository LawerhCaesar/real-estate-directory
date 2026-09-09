import { createClient, type Client } from '@libsql/client';
import { listings as seedListings, type Listing } from '../app/listings';
import { createListingsTableSql } from './schema';

export type ListingRow = {
  id: number | bigint;
  area: string;
  title: string;
  size: string;
  price: string;
  deal: Listing['deal'];
  asset_type: Listing['assetType'];
  notes: string | null;
};

const globalDatabase = globalThis as typeof globalThis & { hotwavesDatabase?: Client };

export function getDatabase(): Client {
  if (globalDatabase.hotwavesDatabase) return globalDatabase.hotwavesDatabase;

  const url = process.env.TURSO_DATABASE_URL ?? (process.env.NODE_ENV === 'production' ? '' : 'file:./data/hotwaves.db');
  if (!url) throw new Error('TURSO_DATABASE_URL is required in production.');

  globalDatabase.hotwavesDatabase = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  });
  return globalDatabase.hotwavesDatabase;
}

export async function ensureDatabase(): Promise<Client> {
  const db = getDatabase();
  await db.executeMultiple(createListingsTableSql);
  const count = await db.execute('SELECT COUNT(*) AS total FROM listings');
  const total = Number(count.rows[0]?.total ?? 0);

  if (!total) {
    await db.batch(seedListings.map((listing) => ({
      sql: `
        INSERT OR IGNORE INTO listings
          (id, area, title, size, price, deal, asset_type, notes, created_by, updated_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        listing.id,
        listing.area,
        listing.title,
        listing.size,
        listing.price,
        listing.deal,
        listing.assetType,
        listing.notes ?? null,
        'initial-import',
        'initial-import',
      ],
    })), 'write');
  }

  return db;
}

export function rowToListing(row: ListingRow): Listing {
  return {
    id: Number(row.id),
    area: String(row.area),
    title: String(row.title),
    size: String(row.size),
    price: String(row.price),
    deal: row.deal,
    assetType: row.asset_type,
    ...(row.notes ? { notes: String(row.notes) } : {}),
  };
}
