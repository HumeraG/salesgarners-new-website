'use client';
import { Children, useMemo, useState } from 'react';

// Department / location filter chips over server-rendered job cards
export default function JobFilters({ jobs, children }) {
  const cards = Children.toArray(children);
  const depts = useMemo(() => ['All', ...new Set(jobs.map(j => j.department).filter(Boolean))], [jobs]);
  const locs = useMemo(() => ['All', ...new Set(jobs.map(j => j.location || 'Pune'))], [jobs]);
  const [d, setD] = useState('All'); const [l, setL] = useState('All');
  const shown = jobs.map((j, i) => ((d === 'All' || j.department === d) && (l === 'All' || (j.location || 'Pune') === l) ? cards[i] : null)).filter(Boolean);
  return (
    <>
      {(depts.length > 2 || locs.length > 2) && (
        <div className="stack center" style={{ gap: 12, marginBottom: 32 }}>
          {depts.length > 2 && <div className="tabs" style={{ justifyContent: 'center' }} aria-label="Department">{depts.map(x => <button key={x} className={`tab ${d === x ? 'on' : ''}`} onClick={() => setD(x)}>{x}</button>)}</div>}
          {locs.length > 2 && <div className="tabs" style={{ justifyContent: 'center' }} aria-label="Location">{locs.map(x => <button key={x} className={`tab ${l === x ? 'on' : ''}`} onClick={() => setL(x)}>{x}</button>)}</div>}
        </div>
      )}
      <div className="jobs">{shown.length ? shown : <p className="lead" style={{ textAlign: 'center', marginInline: 'auto' }}>No roles match these filters.</p>}</div>
    </>
  );
}
