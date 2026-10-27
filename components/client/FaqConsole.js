'use client';
import { useEffect, useState } from 'react';

// FAQs as a command-line console: pick a question, the answer "types" out in the terminal.
export default function FaqConsole({ items = [], ctaHref = '/contact-us' }) {
  const [k, setK] = useState(0);
  const [n, setN] = useState(0);
  const answer = items[k] ? items[k][1] : '';

  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setN(answer.length); return undefined; }
    setN(0);
    const t = setInterval(() => setN(x => { if (x >= answer.length) { clearInterval(t); return x; } return x + 3; }), 28);
    return () => clearInterval(t);
  }, [k, answer]);

  if (!items.length) return null;
  const [q, a, cmd] = items[k];
  const done = n >= a.length;

  return (
    <div className="fq" data-r="">
      <div className="fq-list" role="tablist" aria-label="Frequently asked questions">
        {items.map(([iq, , ic], i) => (
          <button key={iq} type="button" role="tab" id={`fq-tab-${i}`} aria-controls="fq-panel" aria-selected={i === k}
            className={`fq-q${i === k ? ' on' : ''}`} onClick={() => setK(i)}>
            <span className="fq-cmd">$ sg faqs --{ic}</span>
            <span className="fq-qt">{iq}</span>
          </button>
        ))}
      </div>

      <div className="fq-term" id="fq-panel" role="tabpanel" aria-labelledby={`fq-tab-${k}`}>
        <div className="fq-bar"><i /><i /><i /><span>salesgarners — FAQs</span></div>
        <div className="fq-body">
          <span className="fq-dim"># SalesGarners FAQs. Pick a question to run it.</span>
          <span><span className="fq-user">guest@salesgarners</span><span className="fq-dim">:~$</span> sg faqs --{cmd}</span>
          <span className="fq-ask">› {q}</span>
          <span className="fq-ans" aria-hidden="true">{a.slice(0, n)}<span className="fq-cur" /></span>
          <span className="fq-sr">{a}</span>
          {done && <span className="fq-dim">✓ answered · next step: <a href={ctaHref} target="_blank" rel="noopener noreferrer">book a strategy call</a></span>}
        </div>
      </div>
    </div>
  );
}
