'use client';
import { useEffect, useState } from 'react';

// Outbound Sales: "Most outbound agencies stop here." — Noise vs Signal comparison.
// Left: traditional outbound (noisy line). Right: SalesGarners (smooth signal).
// Matching pairs highlight every 2.5s in a loop; clicking any item highlights that pair and restarts the timer.
const ROWS = [
  ['Mass emails to huge lists', 'Intent driven outreach'],
  ['Random cold calls', 'Targeted high intent prospects'],
  ['Generic lead data', 'Verified and enriched data'],
  ['No visibility on buyer intent', 'Real time intent signals'],
  ['Low reply and meeting rates', 'Higher reply and meeting rates'],
  ['Focus on activity, not results', 'Focus on qualified opportunities'],
];
const NOISE = 'M0 30 L12 14 L22 44 L34 18 L44 42 L55 12 L68 48 L80 22 L90 38 L104 16 L116 46 L128 24 L140 40 L150 14 L164 46 L176 20 L188 42 L200 30 L212 14 L222 44 L234 18 L244 42 L255 12 L268 48 L280 22 L290 38 L304 16 L316 46 L328 24 L340 40 L350 14 L364 46 L376 20 L388 42 L400 30';
const SIGNAL = 'M0 30 C 25 10, 25 10, 50 30 S 75 50, 100 30 S 125 10, 150 30 S 175 50, 200 30 S 225 10, 250 30 S 275 50, 300 30 S 325 10, 350 30 S 375 50, 400 30';

function Wave({ d, cls }) {
  return (
    <div className={`nsg-wave ${cls}`} aria-hidden="true">
      <svg viewBox="0 0 800 60" preserveAspectRatio="none"><path d={`${d} ${d.replace(/^M0 30/, '').replace(/(-?\d+(\.\d+)?) (-?\d+(\.\d+)?)/g, (m, x, _a, y) => `${+x + 400} ${y}`)}`} /></svg>
    </div>
  );
}

export default function NoiseSignal() {
  const [k, setK] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setK(x => (x + 1) % ROWS.length), 2500);
    return () => clearInterval(t);
  }, [tick]);

  const pick = i => { setK(i); setTick(t => t + 1); };

  return (
    <div className="nsg" data-r="">
      <div className="nsg-col nsg-noise">
        <div className="nsg-top"><span className="r">Traditional outbound</span><span>Noise</span></div>
        <Wave d={NOISE} cls="n" />
        {ROWS.map(([t], i) => (
          <button key={t} type="button" aria-pressed={i === k} className={i === k ? 'on' : ''} onClick={() => pick(i)}>
            <i>✕</i>{t}
          </button>
        ))}
      </div>
      <div className="nsg-col nsg-signal">
        <div className="nsg-top"><span className="p">SalesGarners</span><span className="g">Signal</span></div>
        <Wave d={SIGNAL} cls="s" />
        {ROWS.map(([, s], i) => (
          <button key={s} type="button" aria-pressed={i === k} className={i === k ? 'on' : ''} onClick={() => pick(i)}>
            <i>✓</i>{s}
          </button>
        ))}
      </div>
    </div>
  );
}
