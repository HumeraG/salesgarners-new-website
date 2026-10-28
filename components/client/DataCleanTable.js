'use client';
import { useEffect, useState } from 'react';

// Data Services hero: a messy prospect list gets cleaned, verified and de-duplicated row by row,
// then the ICP filters highlight the contacts that fit. Loops continuously; ICP chips are clickable.
const ROWS = [
  { role: 'Director of IT', mail: 'd•••@company.com', co: 'Enterprise SaaS', rg: 'NA', ind: 'SaaS', big: true, issue: 'Bounced email' },
  { role: 'VP Marketing', mail: 'v•••@company.com', co: 'FinTech company', rg: 'EMEA', ind: 'FinTech', big: true, issue: 'Outdated title' },
  { role: 'VP Marketing', mail: 'v•••@company.com', co: 'FinTech company', rg: 'EMEA', ind: 'FinTech', big: true, issue: 'Duplicate', dup: true },
  { role: 'Head of Sales', mail: 'h•••@company.com', co: 'Cloud SaaS', rg: 'NA', ind: 'SaaS', big: true, issue: 'Missing phone' },
  { role: 'IT Manager', mail: 'i•••@company.com', co: 'Local retailer', rg: 'APAC', ind: 'Retail', big: false, issue: 'Unverified' },
  { role: 'CFO', mail: 'c•••@company.com', co: 'HR SaaS', rg: 'NA', ind: 'SaaS', big: true, issue: 'Unverified' },
];
const CHIPS = [
  { n: 'SaaS', fit: r => r.ind === 'SaaS' },
  { n: '200+ employees', fit: r => r.big },
  { n: 'North America', fit: r => r.rg === 'NA' },
];
const LAST = 11; // ticks per loop (750ms each)

export default function DataCleanTable() {
  const [n, setN] = useState(0);
  const [f, setF] = useState([false, false, false]);

  useEffect(() => {
    const t = setInterval(() => setN(x => (x >= LAST ? 0 : x + 1)), 750);
    return () => clearInterval(t);
  }, []);

  const any = f.some(Boolean);
  let clean = 0, match = 0;
  const rows = ROWS.map((r, i) => {
    const done = n > i + 1, removed = r.dup && done;
    const fits = CHIPS.every((c, j) => !f[j] || c.fit(r));
    if (done && !removed) { clean++; if (fits) match++; }
    return { ...r, done, removed, fits };
  });
  const scanning = n >= 1 && n <= 7;
  const ready = n > 7;

  return (
    <div className="dct">
      <div className="dct-head">
        <b>Your prospect list</b>
        <span className={ready ? 'ok' : ''} aria-live="polite">{ready ? 'Ready for your CRM' : 'Cleaning & verifying…'}</span>
      </div>
      <div className="dct-chips">
        <span>Your ICP:</span>
        {CHIPS.map((c, j) => (
          <button key={c.n} type="button" aria-pressed={f[j]} className={f[j] ? 'on' : ''}
            onClick={() => setF(v => v.map((x, k) => (k === j ? !x : x)))}>{c.n}</button>
        ))}
      </div>
      <div className="dct-table" role="table" aria-label="Prospect list being cleaned">
        <div className="dct-row dct-th" role="row">
          <span role="columnheader">Contact</span><span role="columnheader">Company</span>
          <span role="columnheader" className="dct-rg">Region</span><span role="columnheader">Status</span>
        </div>
        {rows.map((r, i) => (
          <div key={i} role="row"
            className={`dct-row${r.removed ? ' rm' : ''}${any && !r.fits ? ' dim' : ''}${any && r.fits && r.done && !r.removed ? ' hit' : ''}`}>
            <span role="cell" className="dct-ct"><b>{r.role}</b><small>{r.mail}</small></span>
            <span role="cell" className="dct-co">{r.co}</span>
            <span role="cell" className="dct-rg">{r.rg}</span>
            <span role="cell"><i key={`${i}-${r.done}`} className={`dct-st${r.removed ? ' gone' : r.done ? ' good' : ''}`}>
              {r.removed ? 'Removed' : r.done ? '✓ Verified' : r.issue}</i></span>
          </div>
        ))}
        <span className="dct-scan" aria-hidden="true"
          style={{ transform: `translateY(${Math.min(6, Math.max(0, n - 1)) * 40}px)`, opacity: scanning ? 1 : 0 }} />
      </div>
      <div className="dct-stats">
        <span className="g"><b>{clean}</b>Verified contacts</span>
        <span><b>{n > 3 ? 1 : 0}</b>Duplicates removed</span>
        <span className="w"><b>{any ? match : clean}</b>{any ? 'Match your ICP' : 'Ready to use'}</span>
      </div>
    </div>
  );
}
