'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { AssetType, DealType, Listing } from '../listings';

type Draft = Omit<Listing, 'id'>;

const emptyDraft: Draft = {
  area: '',
  title: '',
  size: '',
  price: '',
  deal: 'Sale',
  assetType: 'Bare land',
  notes: '',
};

export default function AdminDashboard({ userEmail }: { userEmail: string }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/listings')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error()))
      .then((data: { listings: Listing[] }) => setListings(data.listings))
      .catch(() => setMessage('The inventory could not be loaded.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return listings.filter((listing) => `${listing.title} ${listing.area} ${listing.id}`.toLowerCase().includes(term));
  }, [listings, query]);
  const areas = useMemo(() => Array.from(new Set(listings.map((listing) => listing.area))).sort(), [listings]);

  function beginAdd() {
    setSelectedId(null);
    setDraft(emptyDraft);
    setMessage('');
  }

  function beginEdit(listing: Listing) {
    setSelectedId(listing.id);
    setDraft({
      area: listing.area,
      title: listing.title,
      size: listing.size,
      price: listing.price,
      deal: listing.deal,
      assetType: listing.assetType,
      notes: listing.notes ?? '',
    });
    setMessage('');
  }

  function update<Key extends keyof Draft>(key: Key, value: Draft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch(selectedId ? `/api/listings/${selectedId}` : '/api/listings', {
        method: selectedId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const data = await response.json() as { listing?: Listing; error?: string };
      if (!response.ok || !data.listing) throw new Error(data.error ?? 'The listing could not be saved.');

      const savedListing = data.listing;
      setListings((current) => selectedId
        ? current.map((listing) => listing.id === savedListing.id ? savedListing : listing)
        : [...current, savedListing].sort((a, b) => a.id - b.id));
      setSelectedId(savedListing.id);
      setDraft({ ...savedListing, notes: savedListing.notes ?? '' });
      setMessage(selectedId ? 'Changes saved.' : 'Property added to the directory.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The listing could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link className="brand" href="/"><span className="brand-mark">H</span><span className="brand-copy"><b>HOTWAVES</b><small>REAL ESTATE AGENCY</small></span></Link>
        <div><span>{userEmail}</span><Link href="/">View public directory ↗</Link><form action="/api/auth/signout" method="post"><button>Sign out</button></form></div>
      </header>

      <section className="admin-intro">
        <div><p className="admin-kicker">Private inventory</p><h1>Property manager.</h1></div>
        <p>Add new opportunities or select an existing property to update its public details.</p>
      </section>

      <section className="admin-workspace">
        <aside className="admin-list-panel">
          <div className="admin-list-heading"><div><span>INVENTORY</span><b>{listings.length} records</b></div><button onClick={beginAdd}>＋ Add property</button></div>
          <label className="admin-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by property, area, or reference" /></label>
          <div className="admin-list">
            {loading ? <p className="admin-list-message">Loading inventory…</p> : filtered.map((listing) => (
              <button className={selectedId === listing.id ? 'active' : ''} onClick={() => beginEdit(listing)} key={listing.id}>
                <span>HW-{String(listing.id).padStart(3, '0')}</span><b>{listing.title}</b><small>{listing.area} · {listing.price}</small>
              </button>
            ))}
            {!loading && filtered.length === 0 && <p className="admin-list-message">No matching properties.</p>}
          </div>
        </aside>

        <form className="admin-form" onSubmit={save}>
          <div className="admin-form-heading"><div><span>{selectedId ? `HW-${String(selectedId).padStart(3, '0')}` : 'NEW RECORD'}</span><h2>{selectedId ? 'Edit property' : 'Add property'}</h2></div><span>{selectedId ? 'Changes appear publicly after saving.' : 'Complete the property details below.'}</span></div>
          <div className="admin-fields">
            <label className="admin-wide"><span>Property title *</span><input required value={draft.title} onChange={(event) => update('title', event.target.value)} placeholder="e.g. East Airport roadside land" /></label>
            <label className="admin-wide"><span>Area *</span><input required list="admin-areas" value={draft.area} onChange={(event) => update('area', event.target.value)} placeholder="e.g. East Legon / Adjiringanor" /><datalist id="admin-areas">{areas.map((area) => <option key={area} value={area} />)}</datalist></label>
            <label><span>Size *</span><input required value={draft.size} onChange={(event) => update('size', event.target.value)} placeholder="e.g. 2 plots" /></label>
            <label><span>Asking price / terms *</span><input required value={draft.price} onChange={(event) => update('price', event.target.value)} placeholder="e.g. $800K or Price on request" /></label>
            <label><span>Deal type *</span><select value={draft.deal} onChange={(event) => update('deal', event.target.value as DealType)}><option>Sale</option><option>Joint venture</option></select></label>
            <label><span>Property type *</span><select value={draft.assetType} onChange={(event) => update('assetType', event.target.value as AssetType)}><option>Bare land</option><option>Development property</option><option>Income property</option></select></label>
            <label className="admin-wide"><span>Notes</span><textarea rows={5} value={draft.notes ?? ''} onChange={(event) => update('notes', event.target.value)} placeholder="Add landmarks, negotiability, conditions, or other useful details." /></label>
          </div>
          <div className="admin-form-footer"><p className={message.toLowerCase().includes('could not') || message.toLowerCase().includes('required') ? 'error' : ''} role="status">{message}</p><button disabled={saving}>{saving ? 'Saving…' : selectedId ? 'Save changes →' : 'Add to directory →'}</button></div>
        </form>
      </section>
    </main>
  );
}
