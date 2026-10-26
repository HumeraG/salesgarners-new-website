'use client';
import { Children, useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';

// Scroll-snap carousel with arrows, dots and 5s autoplay (pauses on hover / reduced motion)
export default function Carousel({ eb, title, lead, headExtra, children }) {
  const track = useRef(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const hover = useRef(false);

  const step = () => { const t = track.current; const f = t?.firstElementChild; return f ? f.getBoundingClientRect().width + 24 : 1; };
  const maxIdx = () => { const t = track.current; if (!t) return 0; return Math.max(0, t.children.length - Math.round(t.clientWidth / step())); };
  const go = i => { const m = maxIdx(); const n = i > m ? 0 : i < 0 ? m : i; track.current?.scrollTo({ left: n * step(), behavior: 'smooth' }); };

  useEffect(() => {
    const t = track.current; if (!t) return;
    const update = () => { setPages(maxIdx() + 1); setPage(Math.round(t.scrollLeft / step())); };
    update();
    let tm; const onScroll = () => { clearTimeout(tm); tm = setTimeout(update, 80); };
    t.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', update);
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const iv = rm ? null : setInterval(() => { if (!hover.current && !document.hidden) go(Math.round(t.scrollLeft / step()) + 1); }, 5000);
    return () => { t.removeEventListener('scroll', onScroll); window.removeEventListener('resize', update); clearInterval(iv); };
  }, []);

  return (
    <>
      <div className="car-head" data-r="">
        <div className="stack">{eb && <span className="eyebrow">{eb}</span>}<h2 className="h2">{title}</h2>{lead && <p className="lead">{lead}</p>}{headExtra}</div>
        <div className="arrows">
          <button className="arw" onClick={() => go(page - 1)} aria-label="Previous"><Icon name="left" size={20} /></button>
          <button className="arw" onClick={() => go(page + 1)} aria-label="Next"><Icon name="right" size={20} /></button>
        </div>
      </div>
      <div className="car" ref={track} onMouseEnter={() => (hover.current = true)} onMouseLeave={() => (hover.current = false)}>
        {Children.toArray(children)}
      </div>
      <div className="cdots">
        {Array.from({ length: pages }, (_, i) => <button key={i} aria-label={`Slide ${i + 1}`} className={i === Math.min(page, pages - 1) ? 'on' : ''} onClick={() => go(i)} />)}
      </div>
    </>
  );
}
