'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// Publications shown as fanned magazine covers. Hover or pick a name to bring one forward; auto-rotates.
export default function Newsstand({ publications }) {
  const [cur, setCur] = useState(0);
  const [step, setStep] = useState(150);
  const stand = useRef(null);
  const hover = useRef(false);

  const measure = useCallback(() => { if (stand.current) setStep(Math.min(150, stand.current.clientWidth / 7.5)); }, []);
  useEffect(() => {
    measure(); window.addEventListener('resize', measure);
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const iv = rm ? null : setInterval(() => { if (!hover.current && !document.hidden) setCur(c => (c + 1) % publications.length); }, 3500);
    return () => { window.removeEventListener('resize', measure); clearInterval(iv); };
  }, [measure, publications.length]);

  return (
    <div onMouseEnter={() => (hover.current = true)} onMouseLeave={() => (hover.current = false)}>
      <div className="stand" ref={stand} data-r="">
        {publications.map(([m, n, d, u, a, b, logo], i) => {
          const o = i - cur;
          return (
            <a key={n} className={`cover ${o === 0 ? 'front' : ''}`} href={u} target="_blank" rel="noopener noreferrer"
              onMouseEnter={() => setCur(i)} onFocus={() => setCur(i)}
              style={{ '--a': a, '--b': b, zIndex: 10 - Math.abs(o), filter: o === 0 ? 'none' : `brightness(${1 - Math.abs(o) * 0.08})`, transform: `translateX(${o * step}px) translateZ(${-Math.abs(o) * 60}px) rotate(${o * 6}deg) scale(${o === 0 ? 1.06 : 1})` }}>
              <div className="top"><span>DAILY B2B NEWS</span><span>№ 0{i + 1}</span></div>
              <div className="mast"><img src={`/publications/${logo}-horizontal-mono-white.svg`} alt={n} width="682" height="160" /><small>A SALESGARNERS PUBLICATION</small></div>
              <img className="big" src={`/publications/${logo}-mark-mono-white.svg`} alt="" aria-hidden="true" />
              <p className="cl">{d}</p>
              <span className="visit">Visit site ↗</span>
            </a>
          );
        })}
      </div>
      <div className="stand-info">
        {publications.map(([, n, , , , , logo], i) => <button key={n} className={i === cur ? 'on' : ''} onClick={() => setCur(i)}><img src={`/publications/${logo}-mark-${i === cur ? 'mono-white' : 'full-color'}.svg`} alt="" aria-hidden="true" />{n}</button>)}
      </div>
    </div>
  );
}
