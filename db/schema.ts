export const createListingsTableSql = `
  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    area TEXT NOT NULL,
    title TEXT NOT NULL,
    size TEXT NOT NULL,
    price TEXT NOT NULL,
    deal TEXT NOT NULL CHECK (deal IN ('Sale', 'Joint venture')),
    asset_type TEXT NOT NULL CHECK (asset_type IN ('Bare land', 'Development property', 'Income property')),
    notes TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    created_by TEXT,
    updated_by TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS listings_active_area_idx ON listings (active, area);
  CREATE TABLE IF NOT EXISTS auth_attempts (
    identifier TEXT PRIMARY KEY,
    failures INTEGER NOT NULL DEFAULT 0,
    locked_until TEXT,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;
