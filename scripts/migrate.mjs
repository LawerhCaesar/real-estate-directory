import { mkdir, readFile, readdir } from 'node:fs/promises';
import { createClient } from '@libsql/client';

await mkdir(new URL('../data/', import.meta.url), { recursive: true });

const url = process.env.TURSO_DATABASE_URL || 'file:./data/hotwaves.db';
const database = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});
const migrationsDirectory = new URL('../migrations/', import.meta.url);
const migrations = (await readdir(migrationsDirectory)).filter((name) => name.endsWith('.sql')).sort();

for (const migration of migrations) {
  const sql = await readFile(new URL(migration, migrationsDirectory), 'utf8');
  await database.executeMultiple(sql);
  console.log(`Applied ${migration}`);
}

database.close();
