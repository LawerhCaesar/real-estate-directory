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
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;
