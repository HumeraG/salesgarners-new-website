'use client';
import { useEffect, useState } from 'react';

// Lead Generation: "Built for Pipeline. Tuned for Revenue" — a radar-style target.
// The 4 points sit around the target; each one lights a ring and pulses the centre.
// Moves every 5 seconds and loops; clicking a point jumps to it and restarts the timer.
const ITEMS = [
  { short: 'Precision', t: 'Precision-First Targeting',
    d: 'We don’t cast a wide net. We zero in on high intent, ICP matched accounts actively researching your category so every lead starts with context, not guesswork.' },
  { short: 'Signals', t: 'Signals Over Demographics',
    d: 'Beyond demographics, we tap into psychographics and buyer signals, decoding who’s ready, why they care, and when to reach them for max conversion impact.' },
  { short: 'Performance', t: 'Performance-Obsessed Execution',
    d: 'We blend programmatic delivery with strategic nurturing to drive faster responses and higher conversion all while optimizing for pipeline velocity and ROI.' },
  { short: 'Revenue', t: 'Built For Revenue Outcomes',
    d: 'Our campaigns are designed to move leads, not just generate them. Every program is tied to sales goals, pipeline stages, and measurable business growth.' },
];
const RINGS = [82, 61, 41, 23]; // % of the dial; ring 3-k lights up for item k

export default function PrecisionTarget() {
  const [k, setK] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setK(x => (x + 1) % ITEMS.length), 5000);
    return () => clearInterval(t);
  }, [tick]);

  return (
    <div className="ptg" data-r="">
      <div className="ptg-left">
        <div className="ptg-dial" aria-hidden="true">
          {RINGS.map((s, i) => <span key={s} className={`ptg-ring${i === 3 - k ? ' on' : ''}`} style={{ width: `${s}%`, height: `${s}%` }} />)}
          <span className="ptg-sweep" />
          <span className="ptg-v" /><span className="ptg-h" />
          <span className="ptg-core" />
          <span key={`p${k}-${tick}`} className="ptg-ping" />
        </div>
        <div className="ptg-marks" role="tablist" aria-label="Why our lead gen works">
          {ITEMS.map((it, i) => (
            <button key={it.t} type="button" role="tab" id={`ptg-tab-${i}`} aria-controls="ptg-panel" aria-selected={i === k}
              className={`ptg-m ptg-m${i}${i === k ? ' on' : ''}`} onClick={() => { setK(i); setTick(x => x + 1); }}>
              0{i + 1} · {it.short}
            </button>
          ))}
        </div>
      </div>
      <div key={k} className="ptg-text" id="ptg-panel" role="tabpanel" aria-labelledby={`ptg-tab-${k}`} aria-live="polite">
        <span className="ptg-no">0{k + 1} / 04</span>
        <h3>{ITEMS[k].t}</h3>
        <p>{ITEMS[k].d}</p>
        <span className="ptg-timer" aria-hidden="true"><i key={`${k}-${tick}`} /></span>
      </div>
    </div>
  );
}
