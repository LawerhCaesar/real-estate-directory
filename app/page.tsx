'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { listings as seedListings, type AssetType, type DealType, type Listing } from './listings';

type DealFilter = 'All' | DealType;
type AssetFilter = 'All property types' | AssetType;

const dealFilters: { label: string; value: DealFilter }[] = [
  { label: 'All opportunities', value: 'All' },
  { label: 'For sale', value: 'Sale' },
  { label: 'Joint ventures', value: 'Joint venture' },
];

export default function Home() {
  const [inventory, setInventory] = useState<Listing[]>(seedListings);
  const [deal, setDeal] = useState<DealFilter>('All');
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('All areas');
  const [assetType, setAssetType] = useState<AssetFilter>('All property types');
  const [saved, setSaved] = useState<number[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    fetch('/api/listings')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load inventory')))
      .then((data: { listings?: Listing[] }) => data.listings?.length && setInventory(data.listings))
      .catch(() => undefined);
  }, []);

  const areas = useMemo(() => Array.from(new Set(inventory.map((listing) => listing.area))), [inventory]);

  const filtered = useMemo(() => inventory.filter((listing) => {
    const searchable = `${listing.title} ${listing.area} ${listing.size} ${listing.price} ${listing.notes ?? ''}`.toLowerCase();
    return (deal === 'All' || listing.deal === deal)
      && (area === 'All areas' || listing.area === area)
      && (assetType === 'All property types' || listing.assetType === assetType)
      && searchable.includes(query.toLowerCase())
      && (!showSaved || saved.includes(listing.id));
  }), [inventory, deal, area, assetType, query, showSaved, saved]);

  function updateDeal(value: DealFilter) {
    setDeal(value);
    setShowSaved(false);
    setVisibleCount(12);
  }

  function search(event: FormEvent) {
    event.preventDefault();
    setVisibleCount(12);
    document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' });
  }

  function toggleSaved(id: number) {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function resetFilters() {
    setDeal('All');
    setQuery('');
    setArea('All areas');
    setAssetType('All property types');
    setShowSaved(false);
    setVisibleCount(12);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Hotwaves Real Estate Agency home"><span className="brand-mark">H</span><span className="brand-copy"><b>HOTWAVES</b><small>REAL ESTATE AGENCY</small></span></a>
        <nav aria-label="Primary navigation"><a href="#inventory" onClick={() => updateDeal('All')}>Inventory</a><a href="#inventory" onClick={() => updateDeal('Sale')}>For sale</a><a href="#inventory" onClick={() => updateDeal('Joint venture')}>Joint ventures</a><a href="#about">About us</a></nav>
        <div className="header-actions">
          <button className="saved-button" onClick={() => { setShowSaved(!showSaved); setVisibleCount(12); document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' }); }} aria-pressed={showSaved} aria-label="Show saved listings">♡ <span>{saved.length}</span></button>
          <a className="list-button" href="#contact">List your property <span>↗</span></a>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Open menu">☰</button>
        </div>
        {menuOpen && <div className="mobile-nav"><a href="#inventory" onClick={() => setMenuOpen(false)}>Browse inventory</a><a href="#about" onClick={() => setMenuOpen(false)}>About us</a><a href="#contact" onClick={() => setMenuOpen(false)}>List your property</a></div>}
      </header>

      <section className="hero land-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Prime Accra opportunities</p>
          <h1>Land with potential.<br /><em>Deals with clarity.</em></h1>
          <p className="hero-intro">A private collection of land, development properties, and joint-venture opportunities across Accra’s most sought-after districts.</p>
          <form className="search-panel" role="search" aria-label="Search property inventory" onSubmit={search}>
            <div className="search-tabs">
              {dealFilters.map((filter) => <button type="button" className={deal === filter.value ? 'active' : ''} onClick={() => updateDeal(filter.value)} key={filter.value}>{filter.label}</button>)}
            </div>
            <div className="search-fields">
              <label><span>Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Location, landmark, or property" /></label>
              <label><span>Area</span><select value={area} onChange={(event) => { setArea(event.target.value); setVisibleCount(12); }}><option>All areas</option>{areas.map((item) => <option key={item}>{item}</option>)}</select></label>
              <button className="search-button" aria-label="Search inventory">⌕</button>
            </div>
          </form>
          <div className="trust-row">
            <div className="experience-mark" aria-hidden="true">16+</div>
            <p><b>16+ years in the business</b><br />Local knowledge and considered guidance</p>
            <div className="inventory-stat"><b>{inventory.length}</b><span>Current opportunities</span></div>
          </div>
        </div>
        <div className="hero-image" role="img" aria-label="Aerial view of development land in Ghana">
          <div className="image-note"><span className="note-icon">✶</span><p><small>FEATURED OPPORTUNITY</small><b>East Airport land</b><span>6 plots · $1.7M</span></p><button onClick={() => inventory[0] && setSelected(inventory[0])} aria-label="View East Airport land">→</button></div>
          <p className="image-count">01 <span>/ {inventory.length}</span></p>
        </div>
      </section>

      <section className="featured inventory-section" id="inventory">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> {showSaved ? 'Your shortlist' : 'Hotwaves portfolio'}</p><h2>{showSaved ? 'Saved opportunities' : 'Current inventory'}</h2></div>
          <p className="result-count"><b>{filtered.length}</b> {filtered.length === 1 ? 'property' : 'properties'}</p>
        </div>

        <div className="inventory-toolbar">
          <div className="filter-pills" aria-label="Filter by deal type">{dealFilters.map((filter) => <button className={deal === filter.value ? 'active' : ''} onClick={() => updateDeal(filter.value)} key={filter.value}>{filter.label}</button>)}</div>
          <label><span>Property type</span><select value={assetType} onChange={(event) => { setAssetType(event.target.value as AssetFilter); setVisibleCount(12); }}><option>All property types</option><option>Bare land</option><option>Development property</option><option>Income property</option></select></label>
          <label><span>Area</span><select value={area} onChange={(event) => { setArea(event.target.value); setVisibleCount(12); }}><option>All areas</option>{areas.map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>

        <div className="currency-note"><span>$</span><p><b>Currency guide</b> Prices are in US dollars unless a Ghana cedi amount is shown. Confirm price, availability, documentation, and terms with Hotwaves before making a decision.</p></div>

        {filtered.length > 0 ? <>
          <div className="listing-grid">
            {filtered.slice(0, visibleCount).map((listing) => (
              <article className="listing-card" key={listing.id}>
                <div className="listing-card-head"><span className="listing-ref">HW-{String(listing.id).padStart(3, '0')}</span><span className={`deal-badge ${listing.deal === 'Joint venture' ? 'jv' : ''}`}>{listing.deal}</span><button className={saved.includes(listing.id) ? 'is-saved' : ''} onClick={() => toggleSaved(listing.id)} aria-label={`Save ${listing.title}`} aria-pressed={saved.includes(listing.id)}>{saved.includes(listing.id) ? '♥' : '♡'}</button></div>
                <div className="listing-card-body"><p className="listing-area">{listing.area}</p><h3>{listing.title}</h3><div className="listing-facts"><span><small>SIZE</small><b>{listing.size}</b></span><span><small>TYPE</small><b>{listing.assetType}</b></span></div><div className="listing-price"><span>ASKING / TERMS</span><strong>{listing.price}</strong></div>{listing.notes && <p className="listing-note">{listing.notes}</p>}</div>
                <button className="listing-action" onClick={() => { setSelected(listing); setSent(false); }}>View details <span>→</span></button>
              </article>
            ))}
          </div>
          {visibleCount < filtered.length && <button className="load-more" onClick={() => setVisibleCount((count) => count + 12)}>Show more properties <span>{Math.min(12, filtered.length - visibleCount)} more</span></button>}
        </> : <div className="empty-state"><span>⌖</span><h3>No matching opportunities</h3><p>Try a broader location or property type.</p><button onClick={resetFilters}>Clear filters</button></div>}
      </section>

      <section className="area-overview" id="areas"><p className="eyebrow"><span /> Coverage</p><div className="area-overview-heading"><h2>Accra, area by area.</h2><p>From roadside commercial acreage to discreet residential plots, browse opportunities in the districts that matter to you.</p></div><div className="area-list">{areas.map((item) => { const count = inventory.filter((listing) => listing.area === item).length; return <button key={item} onClick={() => { setArea(item); setVisibleCount(12); document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' }); }}><span>{item}</span><b>{count}</b></button>; })}</div></section>

      <section className="promise" id="about"><p className="eyebrow"><span /> Why Hotwaves</p><div className="promise-grid"><h2>Property decisions,<br /><em>made clearer.</em></h2><p>We help buyers, investors, developers, and landowners assess opportunities with discretion. Every transaction remains subject to independent legal, survey, and title due diligence.</p><div><strong>16+</strong><span>Years in the business</span></div><div><strong>{inventory.length}</strong><span>Current opportunities</span></div></div></section>

      <section className="contact" id="contact"><div><p className="eyebrow"><span /> Work with us</p><h2>Have property<br />you’d like to offer?</h2></div><p>Whether you want to sell, lease, rent, or explore a joint venture, share the details with our team for a confidential first review.</p><a href="mailto:info@hotwavesrealestate.com">Start a conversation <span>↗</span></a></section>

      <footer><a className="brand footer-brand" href="#"><span className="brand-mark">H</span><span className="brand-copy"><b>HOTWAVES</b><small>REAL ESTATE AGENCY</small></span></a><p>© 2026 Hotwaves Real Estate Agency. Accra, Ghana.</p><div><a href="/admin">Manage inventory</a><a href="mailto:info@hotwavesrealestate.com">Email</a><a href="tel:+233000000000">Call</a><a href="#">Instagram</a></div></footer>

      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><section className="property-modal inventory-modal" role="dialog" aria-modal="true" aria-label={selected.title} onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close property details">×</button><div className="modal-summary"><span className="listing-ref">HW-{String(selected.id).padStart(3, '0')}</span><p>{selected.area}</p><h2>{selected.title}</h2><div><span><small>SIZE</small><b>{selected.size}</b></span><span><small>TYPE</small><b>{selected.assetType}</b></span><span><small>DEAL</small><b>{selected.deal}</b></span></div><strong>{selected.price}</strong></div><div className="modal-copy"><p className="eyebrow"><span /> Property enquiry</p><h3>Request the full brief</h3><p>Ask for availability, exact location, documentation, viewing arrangements, and transaction terms for this opportunity.</p>{selected.notes && <p className="modal-listing-note">{selected.notes}</p>}{sent ? <div className="success-message"><b>Enquiry received.</b><span>A Hotwaves advisor will contact you shortly.</span></div> : <form onSubmit={(event) => { event.preventDefault(); setSent(true); }}><input required aria-label="Your name" placeholder="Your name" /><input required type="email" aria-label="Email address" placeholder="Email address" /><input aria-label="Phone number" placeholder="Phone number" /><button>Request property brief <span>→</span></button></form>}</div></section></div>}
    </main>
  );
}
