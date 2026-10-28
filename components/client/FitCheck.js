'use client';
import { useEffect, useRef, useState } from 'react';
import { LINKS } from '@/lib/content';

// Outbound Sales: "Built for companies that" as an "Is this you?" self-check.
// Runs automatically: ticks 01 → 02 → 03, the fit ring fills to 3/3, holds, then starts again.
// Visitors can still click a statement; the automatic loop resumes a few seconds later.
const ITEMS = [
  'Have funding but lack consistent pipeline',
  'Want to scale outbound without building an SDR team',
  'Are tired of low quality leads and poor conversions',
];
const STEP = 1300;   // ms between automatic steps
const LOOP = 7;      // steps per loop: 0 empty, 1-3 ticking, 4-6 hold at 3/3
const RESUME = 6000; // ms after a click before the automatic loop takes over again

export default function FitCheck() {
  const [n, setN] = useState(0);
  const [manual, setManual] = useState(null); // array of booleans while a visitor is interacting
  const idle = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setN(x => (x + 1) % LOOP), STEP);
    return () => { clearInterval(t); clearTimeout(idle.current); };
  }, []);

  const on = manual || ITEMS.map((_, i) => n > i);
  const count = on.filter(Boolean).length;

  const toggle = i => {
    const next = on.slice(); next[i] = !next[i];
    setManual(next);
    clearTimeout(idle.current);
    idle.current = setTimeout(() => { setManual(null); setN(0); }, RESUME);
  };

  const msg = count === 0 ? 'Tick what sounds like your team'
    : count === 3 ? 'You are exactly who we built this for.' : 'Sounds like SalesGarners can help.';

  return (
    <div className="fck" data-r="">
      <div className="fck-left">
        <span className="fck-eb">Is this you? Tick what fits</span>
        <h2 className="h2">Built for companies that</h2>
        <div className="fck-list">
          {ITEMS.map((t, i) => (
            <button key={t} type="button" role="checkbox" aria-checked={on[i]} className={on[i] ? 'on' : ''} onClick={() => toggle(i)}>
              <span className="fck-box" aria-hidden="true">{on[i] && <i>✓</i>}</span>
              <small>0{i + 1}</small>
              <b>{t}</b>
            </button>
          ))}
        </div>
      </div>
      <div className="fck-right" aria-live="polite">
        <div className="fck-ring" style={{ '--deg': `${count * 120}deg` }}>
          <div><b>{count}/3</b><span>Fit</span></div>
        </div>
        <b className="fck-msg">{msg}</b>
        <a className={`fck-cta${count > 0 ? ' show' : ''}`} href={LINKS.demo} target="_blank" rel="noopener noreferrer" tabIndex={count > 0 ? 0 : -1}>Book a Demo →</a>
      </div>
    </div>
  );
}
