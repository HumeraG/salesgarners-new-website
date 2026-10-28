'use client';
import { useEffect, useState } from 'react';

// Event-Based Lead Generation hero: Before → During → After the event.
// Moves to the next step every 5 seconds, loops continuously; clicking a step jumps to it and restarts the timer.
const STEPS = [
  { step: 'Step 01', name: 'Before the event', icon: 'M8 3v3M16 3v3M4 8h16M5 6h14v14H5zM9 13l2 2 4-4',
    tag: 'Before · Reach the right attendees', title: 'Fill your calendar before doors open',
    items: ['SalesGarners maps the attendee list to your ICP', 'Personalised invites to the right decision makers', 'Meetings pre-booked for your sales team'],
    out: 'Pre-booked meetings before day one' },
  { step: 'Step 02', name: 'At the event', icon: 'M4 7h16v11H4zM9 7V5h6v2M8 12h3M8 15h6',
    tag: 'During · Capture intent on the floor', title: 'Turn booth traffic into real conversations',
    items: ['Badge scans and booth conversations captured', 'Session and demo attendance tracked', 'Buying signals logged by our team'],
    out: 'Every conversation captured' },
  { step: 'Step 03', name: 'After the event', icon: 'M3 17l6-6 4 4 8-8M15 7h6v6',
    tag: 'After · Turn conversations into pipeline', title: 'Follow up fast with the right message',
    items: ['Personalised follow-up to every contact', 'Leads verified through our 3X QA', 'Sales-ready leads delivered to your CRM'],
    out: 'Sales-ready leads in your CRM' },
];

export default function EventJourney() {
  const [k, setK] = useState(0);
  const [tick, setTick] = useState(0); // restarts the 5s timer after a click

  useEffect(() => {
    const t = setInterval(() => setK(x => (x + 1) % STEPS.length), 5000);
    return () => clearInterval(t);
  }, [tick]);

  const cur = STEPS[k];
  return (
    <div className="evj">
      <div className="evj-track">
        <span className="evj-line" aria-hidden="true"><i style={{ width: `${(k / (STEPS.length - 1)) * 100}%` }} /></span>
        <div className="evj-tabs" role="tablist" aria-label="Event lead generation steps">
          {STEPS.map((s, i) => (
            <button key={s.name} type="button" role="tab" id={`evj-tab-${i}`} aria-controls="evj-panel" aria-selected={i === k}
              className={`evj-tab${i === k ? ' on' : ''}${i < k ? ' done' : ''}`} onClick={() => { setK(i); setTick(t => t + 1); }}>
              <span className="evj-ic"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={s.icon} /></svg></span>
              <small>{s.step}</small>
              <b>{s.name}</b>
            </button>
          ))}
        </div>
      </div>
      <div key={k} className="evj-card" id="evj-panel" role="tabpanel" aria-labelledby={`evj-tab-${k}`} aria-live="polite">
        <span className="evj-tag">{cur.tag}</span>
        <b className="evj-title">{cur.title}</b>
        {cur.items.map((t, j) => (
          <span key={t} className="evj-item" style={{ animationDelay: `${0.15 + j * 0.18}s` }}><i>✓</i>{t}</span>
        ))}
        <span className="evj-out"><i />{cur.out}</span>
        <span className="evj-timer" aria-hidden="true"><i key={`${k}-${tick}`} /></span>
      </div>
    </div>
  );
}
