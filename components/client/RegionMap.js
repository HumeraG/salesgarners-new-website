'use client';
import { useEffect, useRef, useState } from 'react';

const PINS = [['NA', 20, 33], ['LATAM', 31, 68], ['EMEA', 51, 31], ['APAC', 74, 40], ['ANZ', 85, 73]];
const REGIONS = ['Global', 'NA', 'EMEA', 'ANZ', 'LATAM', 'APAC'];
const LAND = [[.2, .3, .13, .13], [.25, .45, .06, .07], [.36, .12, .05, .05], [.31, .68, .065, .16], [.5, .27, .065, .08], [.52, .56, .085, .17], [.7, .28, .18, .13], [.66, .46, .04, .07], [.78, .5, .05, .05], [.85, .73, .07, .07], [.6, .37, .05, .05]];

// Dotted world map with region pins and region filter tabs. children = text column.
export default function RegionMap({ children }) {
  const [region, setRegion] = useState('Global');
  const map = useRef(null); const canvas = useRef(null);

  useEffect(() => {
    const draw = () => {
      const m = map.current, c = canvas.current; if (!m || !c) return;
      const r = m.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      c.width = r.width * dpr; c.height = r.height * dpr;
      const ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const light = document.documentElement.dataset.theme === 'light';
      const g = Math.max(9, r.width / 62); let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
      for (let y = g; y < r.height; y += g) for (let x = g; x < r.width; x += g) {
        const nx = x / r.width, ny = y / r.height;
        if (LAND.some(([cx, cy, rx, ry]) => ((nx - cx) / rx) ** 2 + ((ny - cy) / ry) ** 2 < 1)) {
          ctx.fillStyle = light ? `rgba(91,44,201,${0.42 + 0.3 * rnd()})` : `rgba(160,150,230,${0.22 + 0.25 * rnd()})`; ctx.beginPath(); ctx.arc(x, y, g * 0.2, 0, 7); ctx.fill();
        }
      }
    };
    draw(); window.addEventListener('resize', draw); window.addEventListener('sg-theme', draw);
    return () => { window.removeEventListener('resize', draw); window.removeEventListener('sg-theme', draw); };
  }, []);

  return (
    <div className="wrap split">
      <div className="map" ref={map} data-r="">
        <canvas ref={canvas} aria-hidden="true" />
        {PINS.map(([r, x, y]) => (
          <div key={r} className={`pin ${region !== 'Global' && region !== r ? 'off' : ''}`} style={{ left: `${x}%`, top: `${y}%` }}><i /><span>{r}</span></div>
        ))}
      </div>
      <div className="stack" data-r="">
        {children}
        <div className="tabs" role="tablist" aria-label="Regions">
          {REGIONS.map(r => <button key={r} role="tab" aria-selected={region === r} className={`tab ${region === r ? 'on' : ''}`} onClick={() => setRegion(r)}>{r}</button>)}
        </div>
      </div>
    </div>
  );
}
