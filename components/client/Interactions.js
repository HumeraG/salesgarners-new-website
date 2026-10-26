'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Page-wide motion layer, re-run on every route change:
// scroll reveals ([data-r]), count-ups ([data-count]), bar fills ([data-w]), X-Engage signals,
// forecast line drawing, approach step line, card spotlight, magnetic buttons and the scroll progress bar.
export default function Interactions() {
  const pathname = usePathname();

  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const vh = window.innerHeight;
    const root = document.querySelector('main');
    if (!root) return;

    const fmt = (v, el) => { const t = el.dataset.count; const dec = (t.split('.')[1] || '').length; return el.dataset.fmt === 'comma' ? Math.round(v).toLocaleString('en-US') : v.toFixed(dec); };
    const count = el => {
      if (!el.dataset.pending) return; delete el.dataset.pending;
      const target = parseFloat(el.dataset.count); const t0 = performance.now(), D = 1800;
      const tick = t => { const p = Math.min(1, (t - t0) / D); const e = 1 - Math.pow(1 - p, 4); el.textContent = fmt(target * e, el); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    };
    const onShow = el => {
      el.querySelectorAll('[data-count]').forEach(count); if (el.matches('[data-count]')) count(el);
      el.querySelectorAll('[data-w]').forEach(i => (i.style.width = i.dataset.w + '%'));
      if (el.matches('[data-signals]')) {
        [...el.querySelectorAll('.sig')].forEach((s, i) => setTimeout(() => s.classList.add('on'), RM ? 0 : 250 + i * 380));
        const sc = el.querySelector('[data-score]'); if (sc && !RM) { sc.dataset.count = '92'; sc.dataset.pending = '1'; count(sc); }
      }
      if (el.matches('[data-forecast]') && !RM) el.querySelectorAll('.ln').forEach(p => {
        if (p.getAttribute('stroke-dasharray')) return;
        const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.getBoundingClientRect();
        p.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.22,1,.36,1)'; p.style.strokeDashoffset = 0;
      });
    };

    // reveal: only elements below the first screen start hidden
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); onShow(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    const groups = new Map();
    root.querySelectorAll('[data-r]').forEach(el => {
      if (!RM && el.getBoundingClientRect().top > vh * 0.92) {
        const p = el.parentElement; const k = groups.get(p) || 0; groups.set(p, k + 1);
        el.classList.add('pre', 'rv'); el.style.transitionDelay = Math.min(k, 5) * 70 + 'ms';
      }
      io.observe(el);
    });
    const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { onShow(e.target); io2.unobserve(e.target); } }), { threshold: 0.3 });
    root.querySelectorAll('[data-count],[data-hbars],[data-signals],.cmp,[data-forecast]').forEach(el => {
      if (el.matches('[data-count]') && !RM && el.getBoundingClientRect().top > vh * 0.9) { el.dataset.pending = '1'; el.textContent = fmt(0, el); }
      io2.observe(el);
    });

    // magnetic buttons
    const mags = [...root.querySelectorAll('.mag')];
    const magMove = e => { const b = e.currentTarget; const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`; };
    const magLeave = e => (e.currentTarget.style.transform = '');
    if (!RM) mags.forEach(b => { b.addEventListener('mousemove', magMove); b.addEventListener('mouseleave', magLeave); });

    // scroll progress + approach step line
    const prog = document.getElementById('prog');
    const onScroll = () => {
      const y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      if (prog) prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      root.querySelectorAll('.steps').forEach(s => { const r = s.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (window.innerHeight * 0.85 - r.top) / (r.height + window.innerHeight * 0.3))); const i = s.querySelector('.line i'); if (i) i.style.width = p * 100 + '%'; });
    };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect(); io2.disconnect(); window.removeEventListener('scroll', onScroll);
      mags.forEach(b => { b.removeEventListener('mousemove', magMove); b.removeEventListener('mouseleave', magLeave); });
    };
  }, [pathname]);

  // card spotlight follows the cursor (global, once)
  useEffect(() => {
    const move = e => { const c = e.target.closest?.('.card'); if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px'); } };
    document.addEventListener('pointermove', move, { passive: true });
    return () => document.removeEventListener('pointermove', move);
  }, []);

  return <div className="progress" id="prog" />;
}
