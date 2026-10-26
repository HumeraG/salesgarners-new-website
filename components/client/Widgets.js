'use client';
import { Children, useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';
import LeadForm from './LeadForm';

// Tab buttons + one visible panel (children = panels, in order)
export function Tabs({ labels, children, center = true }) {
  const [i, setI] = useState(0);
  const panels = Children.toArray(children);
  return (
    <>
      <div className="stack center" style={{ marginBottom: 40 }} data-r="">
        <div className="tabs" role="tablist" style={{ justifyContent: center ? 'center' : 'flex-start' }}>
          {labels.map((t, k) => <button key={t} role="tab" aria-selected={i === k} className={`tab ${i === k ? 'on' : ''}`} onClick={() => setI(k)}>{t}</button>)}
        </div>
      </div>
      <div className="card" style={{ maxWidth: 860, marginInline: 'auto', padding: 44, minHeight: 220 }} data-r="">
        <div key={i} style={{ animation: 'fu .5s var(--ease)' }}>{panels[i]}</div>
      </div>
    </>
  );
}

// Audience overview breakdown with animated bars
export function AudienceTabs({ tabs }) {
  const keys = Object.keys(tabs);
  const [k, setK] = useState(keys[0]);
  const [grown, setGrown] = useState(false);
  useEffect(() => { setGrown(false); const t = requestAnimationFrame(() => requestAnimationFrame(() => setGrown(true))); return () => cancelAnimationFrame(t); }, [k]);
  const d = tabs[k]; const mx = Math.max(...d.rows.map(r => r[1]));
  return (
    <>
      <div className="tabs" style={{ justifyContent: 'center', marginBottom: 32 }} data-r="">
        {keys.map(t => <button key={t} className={`tab ${t === k ? 'on' : ''}`} onClick={() => setK(t)}>{t}</button>)}
      </div>
      <div className="card" style={{ padding: 36 }} data-r="">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
          <h3 className="h3">{d.title}</h3><span className="mono" style={{ color: 'var(--lilac)', fontWeight: 600 }}>Total: {d.total}</span>
        </div>
        <div className="hbars">
          {d.rows.map(([t, v]) => (
            <div className="hb" key={t}><span className="t">{t}</span><span className="v">{v.toFixed(2)}M</span><div className="tr"><i style={{ width: grown ? `${(v / mx) * 100}%` : 0 }} /></div></div>
          ))}
        </div>
      </div>
    </>
  );
}

// Whitepaper cards; "Download Now" opens a gated form in a modal, then unlocks the PDF
export function WhitepaperGrid({ items }) {
  const [open, setOpen] = useState(null);
  const box = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKey = e => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey); setTimeout(() => box.current?.querySelector('input')?.focus(), 200);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <>
      <div className="g2">
        {items.map(w => (
          <article className="card wp" data-r="" key={w.title}>
            {w.cover ? <img className="cover-img" src={w.cover} alt={`${w.title} cover`} /> : <div className="doc" />}
            <h3>{w.title}</h3>
            {w.description && <p>{w.description}</p>}
            <button className="btn p" style={{ width: 'max-content' }} onClick={() => setOpen(w)}>Download Now <Icon name="download" size={18} /></button>
          </article>
        ))}
      </div>
      <div className={`modal ${open ? 'on' : ''}`} role="dialog" aria-modal="true" aria-labelledby="wp-title" onClick={e => e.target === e.currentTarget && setOpen(null)}>
        <div className="box" ref={box}>
          <button className="x" onClick={() => setOpen(null)} aria-label="Close"><Icon name="x" size={16} /></button>
          {open && (
            <div className="stack" style={{ gap: 14 }}>
              <span className="eyebrow">Free download</span>
              <h3 className="h3" id="wp-title">{open.title}</h3>
              <LeadForm key={open.title} id="wp" type="WHITEPAPER" resource={open.title} extra={{ whitepaperId: open.id }} rows={[['fullName'], ['email'], ['company']]} required={['fullName', 'email']} labels={{ email: 'Work email', company: 'Company' }}
                submitLabel="Get the PDF" successTitle="You’re all set" successText={open.hasPdf ? 'Your download is ready.' : 'Thanks. Our team will send the whitepaper to your inbox shortly.'} resetLabel="Download another" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function CopyButton({ value }) {
  const [done, setDone] = useState(false);
  return (
    <button className="copy" onClick={() => { navigator.clipboard?.writeText(value).then(() => { setDone(true); setTimeout(() => setDone(false), 1500); }).catch(() => {}); }}>
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}

// Pilot page: demo of in-content AI assistant
export function ChatDemo() {
  const [log, setLog] = useState([['Got a question about this content? Ask me anything...', false]]);
  const [typing, setTyping] = useState(false);
  const [q, setQ] = useState('');
  const send = e => {
    e.preventDefault(); const v = q.trim(); if (!v) return;
    setLog(l => [...l, [v, true]]); setQ(''); setTyping(true);
    setTimeout(() => { setTyping(false); setLog(l => [...l, ['Demo reply: in the live product, the in-content AI answers from the asset and logs this question as an engagement signal for your sales team.', false]]); }, 900);
  };
  return (
    <div className="card" style={{ padding: 26 }} data-r="">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span className="it" style={{ width: 40, height: 40 }}><Icon name="sparkle" size={18} /></span>
        <div><b>Intelligent Content Assistant</b><small className="note" style={{ display: 'block' }}>Got a question about this content?</small></div>
      </div>
      <div style={{ display: 'grid', gap: 10, minHeight: 140, padding: '8px 0' }} aria-live="polite">
        {log.map(([t, me], i) => <div key={i} style={{ justifySelf: me ? 'end' : 'start', maxWidth: '85%', padding: '10px 14px', borderRadius: 14, fontSize: 14, background: me ? 'var(--grad)' : 'var(--tint2)', color: me ? '#fff' : 'inherit', animation: 'fu .4s var(--ease)' }}>{t}</div>)}
        {typing && <div style={{ color: 'var(--muted)', letterSpacing: 3 }}>•••</div>}
      </div>
      <form onSubmit={send} style={{ display: 'flex', gap: 8 }}>
        <input aria-label="Ask a question" placeholder="Ask me anything..." value={q} onChange={e => setQ(e.target.value)} style={{ flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: 12, background: 'var(--tint1)', border: '1px solid var(--line2)', color: 'var(--fg)', font: '500 14px var(--body)' }} />
        <button className="btn p sm" type="submit" aria-label="Send">→</button>
      </form>
      <div className="chips" style={{ fontSize: 12 }}>{['Engage', 'Qualify', 'Convert'].map(t => <span className="chip" key={t}>{t}</span>)}</div>
    </div>
  );
}

// Smooth-scroll to an element id (pilot page CTA)
export function ScrollToButton({ target, children }) {
  return <button className="btn w mag" onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>{children} <span className="ar">→</span></button>;
}

// Legal pages: sticky contents list that scrolls to sections
export function LegalToc({ items }) {
  return (
    <nav className="toc" aria-label="Contents">
      {items.map(([h, id]) => <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{h}</a>)}
    </nav>
  );
}
