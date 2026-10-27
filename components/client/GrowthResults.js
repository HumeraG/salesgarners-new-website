'use client';
import { useEffect, useState } from 'react';

// Content Syndication · "The Road From Guesswork to Growth": results first (rings + bars), then a side-by-side checklist.
// Numbers come from the page: 220+ leads at 1.8% vs 890+ leads at 14% (4x leads, 7.8x conversion rate).
export default function GrowthResults({ left = [], right = [] }) {
  const [k, setK] = useState(0);
  const [manual, setManual] = useState(false);
  useEffect(() => {
    if (manual) return undefined;
    const t = setInterval(() => setK(x => (x + 1) % left.length), 2200);
    return () => clearInterval(t);
  }, [manual, left.length]);

  return (
    <div className="gg" data-r="">
      <div className="gg-band">
        <div className="gg-side old">
          <div className="gg-ring" style={{ '--deg': '6.5deg' }}><span>1.8%</span></div>
          <div className="gg-meta"><small>Traditional</small><b>220+</b><span>leads · 1.8% conv.</span></div>
        </div>
        <div className="gg-mid" aria-hidden="true">
          <div className="gg-bar"><i className="a" /><small>220+</small></div>
          <div className="gg-big"><b>4× leads</b><small>7.8× conversion rate</small></div>
          <div className="gg-bar"><i className="b" /><small>890+</small></div>
        </div>
        <div className="gg-side new">
          <div className="gg-ring" style={{ '--deg': '50.4deg' }}><span>14%</span></div>
          <div className="gg-meta"><small>SalesGarners</small><b>890+</b><span>leads · 14% conv.</span></div>
        </div>
      </div>
      <div className="gg-table">
        <div className="gg-th"><span>Traditional Syndication</span><span>SalesGarners Approach</span></div>
        {left.map((o, i) => (
          <button key={o} type="button" className={`gg-row${i === k ? ' on' : ''}`} aria-pressed={i === k} onClick={() => { setK(i); setManual(true); }}>
            <span className="o"><i>✕</i>{o}</span>
            <span className="n"><i>✓</i>{right[i]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
