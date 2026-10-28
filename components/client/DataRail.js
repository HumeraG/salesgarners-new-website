'use client';
import { useEffect, useState } from 'react';

// Data Services: "Turning Insight-Rich Data into Real Pipeline Impact".
// A data block travels along a rail through 4 stations; the active station's text shows below.
// Moves every 5 seconds and loops; clicking a station jumps to it and restarts the timer.
const STATIONS = [
  { t: 'Strategic Data R&D', icon: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
    d: 'We combine human research with AI powered enrichment to build highly targeted, campaign ready datasets that align directly with your ICPs and revenue goals.' },
  { t: 'Privacy-First, Compliance Ready', icon: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
    d: 'Every dataset we deliver is built using privacy safe sources, aligned with GDPR/CCPA guidelines, and backed by strict quality assurance.' },
  { t: 'Human + Technology Driven Quality', icon: 'M3 4h18v12H3zM8 20h8M12 16v4M9 10l-2-2 2-2M15 6l2 2-2 2',
    d: 'Our hybrid model blends data science and expert validation so you get accuracy, consistency, and context (not just a raw dump of contacts).' },
  { t: 'Plug-and-Play Into Your GTM Stack', icon: 'M3 3v18h18M7 15l4-4 3 3 6-6M15 8h5v5',
    d: 'We integrate seamlessly with leading CRMs and MAPs (Salesforce, HubSpot, Marketo, etc.) so your teams can activate data instantly without manual clean up.' },
];

export default function DataRail() {
  const [k, setK] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setK(x => (x + 1) % STATIONS.length), 5000);
    return () => clearInterval(t);
  }, [tick]);

  const pct = (k / (STATIONS.length - 1)) * 75;
  return (
    <div className="drl" data-r="">
      <div className="drl-track">
        <span className="drl-dash" aria-hidden="true" />
        <span className="drl-fill" aria-hidden="true" style={{ width: `${pct}%` }} />
        <span className="drl-dot" aria-hidden="true" style={{ left: `${12.5 + pct}%` }} />
        <div className="drl-st" role="tablist" aria-label="How we turn data into pipeline">
          {STATIONS.map((s, i) => (
            <button key={s.t} type="button" role="tab" id={`drl-tab-${i}`} aria-controls="drl-panel" aria-selected={i === k}
              className={`${i === k ? 'on' : ''}${i < k ? ' done' : ''}`} onClick={() => { setK(i); setTick(x => x + 1); }}>
              <span className="drl-ic"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={s.icon} /></svg></span>
              <b>{s.t}</b>
            </button>
          ))}
        </div>
      </div>
      <div key={k} className="drl-text" id="drl-panel" role="tabpanel" aria-labelledby={`drl-tab-${k}`} aria-live="polite">
        <span className="drl-no">0{k + 1} / 04</span>
        <p>{STATIONS[k].d}</p>
        <span className="drl-timer" aria-hidden="true"><i key={`${k}-${tick}`} /></span>
      </div>
    </div>
  );
}
