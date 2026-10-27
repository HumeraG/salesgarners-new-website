'use client';
import { useEffect, useState } from 'react';

// About hero graphic: signals flow in from our sources, pass the ICP fit, Intent and 3X QA gates,
// and only qualified leads reach the MQL box. Gates auto-cycle; clicking one explains it.
const SOURCES = ['Our publications', 'Content syndication', 'Events & webinars', 'Email & outbound', 'First-party data'];
const GATES = [
  ['ICP fit', 'Matches your ideal customer profile: industry, size, region and job title.'],
  ['Intent', 'Actively researching the topics and solutions you sell.'],
  ['3X QA', 'Our three-layer check: verified, compliant, ready.'],
];
// [lane, kind, delay in seconds]
const DOTS = [[0, 'pass', 0], [1, 's1', 0.6], [2, 'pass', 1.1], [3, 's2', 1.6], [4, 'pass', 2.1], [0, 's3', 2.6], [1, 'pass', 3.1], [2, 's1', 3.6],
  [3, 'pass', 4.1], [4, 's2', 4.6], [0, 'pass', 5.1], [1, 's3', 5.6], [2, 'pass', 6.1], [3, 's1', 6.6], [4, 'pass', 7.1], [2, 's2', 7.6]];

export default function SignalFlow() {
  const [g, setG] = useState(0);
  const [manual, setManual] = useState(false);
  useEffect(() => {
    if (manual) return undefined;
    const t = setInterval(() => setG(x => (x + 1) % GATES.length), 3000);
    return () => clearInterval(t);
  }, [manual]);

  return (
    <div className="sflow" role="group" aria-label="How SalesGarners turns buyer signals into sales-ready leads">
      <span className="sflow-tag">Signals</span>
      {SOURCES.map((s, i) => <span key={s} className="sflow-src" style={{ '--y': i }}>{s}</span>)}
      {SOURCES.map((s, i) => <span key={`l${s}`} className="sflow-lane" style={{ '--y': i }} aria-hidden="true" />)}
      {GATES.map(([n], i) => (
        <button key={n} type="button" className={`sflow-gate ${i === g ? 'on' : ''}`} style={{ '--x': i }} aria-pressed={i === g}
          onClick={() => { setG(i); setManual(true); }}>
          <span>{n}</span>
        </button>
      ))}
      {DOTS.map(([lane, kind, d], i) => (
        <span key={i} className={`sflow-dot ${kind}`} style={{ '--y': lane, animationDelay: `${d}s` }} aria-hidden="true" />
      ))}
      <div className="sflow-mql"><b>MQL</b><span>Sales-ready, delivered to your CRM</span></div>
      <p className="sflow-info" aria-live="polite"><b>{GATES[g][0]}</b> {GATES[g][1]}</p>
    </div>
  );
}
