'use client';
import { useEffect, useState } from 'react';

// Outbound Sales pricing: the two models as tickets with a tear-off stub.
// The active pass straightens, lifts and glows; switches every 5 seconds and loops.
// Clicking a pass selects it and restarts the timer.
const PASSES = [
  { tag: 'Retainer', a: 'Retainer plans for', b: 'predictable pipeline', stub: 'Monthly', tilt: -1.5,
    icon: 'M8 3v3M16 3v3M4 8h16M5 6h14v14H5z' },
  { tag: 'CPL', a: 'CPL model for performance', b: 'based campaigns', stub: 'Per lead', tilt: 1.5,
    icon: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 7a5 5 0 1 0 0 10a5 5 0 1 0 0-10M12 11a1 1 0 1 0 0 2a1 1 0 1 0 0-2' },
];

export default function PricingPasses() {
  const [k, setK] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setK(x => (x + 1) % PASSES.length), 5000);
    return () => clearInterval(t);
  }, [tick]);

  return (
    <div className="ppx" data-r="">
      {PASSES.map((p, i) => (
        <button key={p.tag} type="button" aria-pressed={i === k} className={`ppx-pass${i === k ? ' on' : ''}`}
          style={{ '--tilt': `${p.tilt}deg` }} onClick={() => { setK(i); setTick(x => x + 1); }}>
          <span className="ppx-shine" aria-hidden="true" />
          <span className="ppx-main">
            <span className="ppx-tag">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={p.icon} /></svg>
              {p.tag}
            </span>
            <b className="ppx-title">{p.a}<br /><span>{p.b}</span></b>
          </span>
          <span className="ppx-stub"><i aria-hidden="true" /><i aria-hidden="true" /><span>{p.stub}</span></span>
        </button>
      ))}
    </div>
  );
}
