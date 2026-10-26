'use client';
import { useEffect, useRef } from 'react';

/*
 * Inner page hero visual: ~1500 dots that form a page icon, wobble gently and scatter from the cursor.
 * shape: one of the keys in SHAPES below. Pauses off screen; static for reduced motion.
 */

const rr = (o, x, y, w, h, r) => { o.beginPath(); o.roundRect ? o.roundRect(x, y, w, h, r) : o.rect(x, y, w, h); };
const cut = (o, fn) => { o.globalCompositeOperation = 'destination-out'; fn(); o.globalCompositeOperation = 'source-over'; };

// Each shape draws white on a 400x400 canvas; filled pixels become dot targets.
const SHAPES = {
  funnel(o) { o.beginPath(); o.moveTo(50, 70); o.lineTo(350, 70); o.lineTo(235, 205); o.lineTo(235, 315); o.lineTo(165, 350); o.lineTo(165, 205); o.closePath(); o.fill(); },
  docs(o) {
    o.lineWidth = 15;
    [[-14, -38], [0, 0], [14, 38]].forEach(([a, dx]) => { o.save(); o.translate(200 + dx, 205); o.rotate(a * Math.PI / 180); rr(o, -85, -115, 170, 230, 18); o.stroke(); o.restore(); });
    o.save(); o.translate(238, 205); o.rotate(14 * Math.PI / 180); [-50, -10, 30].forEach((y, i) => o.fillRect(-55, y, i === 2 ? 70 : 110, 12)); o.restore();
  },
  calendar(o) {
    o.lineWidth = 15; rr(o, 65, 85, 270, 250, 24); o.stroke(); o.fillRect(65, 85, 270, 60); o.fillRect(120, 55, 18, 60); o.fillRect(262, 55, 18, 60);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { o.beginPath(); o.arc(115 + c * 57, 185 + r * 50, r === 1 && c === 2 ? 17 : 10, 0, 6.29); o.fill(); }
  },
  database(o) {
    o.beginPath(); o.ellipse(200, 105, 140, 42, 0, 0, 6.29); o.fill(); o.fillRect(60, 105, 280, 190); o.beginPath(); o.ellipse(200, 295, 140, 42, 0, 0, 6.29); o.fill();
    cut(o, () => { o.lineWidth = 12; [105, 170, 235].forEach(y => { o.beginPath(); o.ellipse(200, y, 140, 42, 0, 0, Math.PI); o.stroke(); }); });
  },
  chat(o) {
    rr(o, 55, 75, 290, 200, 36); o.fill(); o.beginPath(); o.moveTo(105, 260); o.lineTo(95, 345); o.lineTo(175, 265); o.fill();
    cut(o, () => [140, 200, 260].forEach(x => { o.beginPath(); o.arc(x, 175, 19, 0, 6.29); o.fill(); }));
  },
  plane(o) {
    o.beginPath(); o.moveTo(40, 190); o.lineTo(360, 60); o.lineTo(260, 330); o.lineTo(195, 235); o.closePath(); o.fill();
    cut(o, () => { o.lineWidth = 11; o.beginPath(); o.moveTo(360, 60); o.lineTo(190, 240); o.stroke(); });
    o.beginPath(); o.moveTo(195, 235); o.lineTo(180, 320); o.lineTo(222, 272); o.closePath(); o.fill();
  },
  bars(o) { [[60, 140], [140, 220], [220, 170], [300, 270]].forEach(([x, h]) => { rr(o, x, 330 - h, 52, h, 12); o.fill(); }); o.fillRect(40, 345, 330, 12); },
  x(o) { o.lineWidth = 64; o.lineCap = 'round'; o.beginPath(); o.moveTo(95, 95); o.lineTo(305, 305); o.moveTo(305, 95); o.lineTo(95, 305); o.stroke(); },
  book(o) {
    o.beginPath(); o.moveTo(40, 105); o.lineTo(188, 135); o.lineTo(188, 330); o.lineTo(40, 300); o.closePath(); o.fill();
    o.beginPath(); o.moveTo(212, 135); o.lineTo(360, 105); o.lineTo(360, 300); o.lineTo(212, 330); o.closePath(); o.fill();
    cut(o, () => { o.lineWidth = 13; [170, 215, 260].forEach(y => { o.beginPath(); o.moveTo(70, y - 22); o.lineTo(160, y); o.moveTo(240, y); o.lineTo(330, y - 22); o.stroke(); }); });
  },
  growth(o) {
    [[55, 90], [135, 140], [215, 195], [295, 250]].forEach(([x, h]) => { rr(o, x, 345 - h, 52, h, 10); o.fill(); });
    o.lineWidth = 16; o.lineCap = 'round'; o.lineJoin = 'round'; o.beginPath(); o.moveTo(50, 175); o.lineTo(145, 120); o.lineTo(220, 140); o.lineTo(320, 62); o.stroke();
    o.beginPath(); o.moveTo(345, 40); o.lineTo(290, 50); o.lineTo(335, 95); o.closePath(); o.fill();
  },
  download(o) {
    o.lineWidth = 15; o.beginPath(); o.moveTo(95, 50); o.lineTo(250, 50); o.lineTo(305, 105); o.lineTo(305, 345); o.lineTo(95, 345); o.closePath(); o.stroke();
    o.lineWidth = 20; o.lineCap = 'round'; o.beginPath(); o.moveTo(200, 120); o.lineTo(200, 235); o.stroke();
    o.beginPath(); o.moveTo(145, 205); o.lineTo(255, 205); o.lineTo(200, 270); o.closePath(); o.fill(); o.fillRect(140, 290, 120, 15);
  },
  briefcase(o) {
    o.lineWidth = 16; rr(o, 150, 62, 100, 70, 18); o.stroke(); rr(o, 50, 120, 300, 220, 28); o.fill();
    cut(o, () => o.fillRect(50, 205, 300, 12)); rr(o, 178, 188, 44, 46, 8); o.fill();
  },
  sg(o) { o.font = '800 250px "Bricolage Grotesque", "Manrope", system-ui, sans-serif'; o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillText('SG', 200, 210); },
};

const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

export default function ParticleShape({ shape = 'funnel', chip, children }) {
  const root = useRef(null);
  useEffect(() => {
    const el = root.current, cv = el.querySelector('canvas'), ctx = cv.getContext('2d');
    const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let S = { w: 0, h: 0, d: 1 }, P = [], on = false, raf = 0, last = 0, mx = -999, my = -999;
    const size = () => { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d); S = { w: r.width, h: r.height, d }; };

    const targets = () => {
      const off = document.createElement('canvas'); off.width = off.height = 400; const o = off.getContext('2d');
      o.fillStyle = o.strokeStyle = '#fff'; (SHAPES[shape] || SHAPES.funnel)(o);
      const img = o.getImageData(0, 0, 400, 400).data, pts = [];
      for (let y = 0; y < 400; y += 7) for (let x = 0; x < 400; x += 7) if (img[(y * 400 + x) * 4 + 3] > 128) pts.push([x, y]);
      for (let i = pts.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
      return pts;
    };

    const build = (scatter) => {
      size(); const pts = targets(); const N = Math.min(1500, pts.length + 160);
      const sc = Math.min(S.w, S.h) * .8 / 400, ox = (S.w - 400 * sc) / 2, oy = (S.h - 400 * sc) / 2;
      P = Array.from({ length: N }, (_, i) => {
        const t = pts[i] || (i >= pts.length + 160 ? pts[i % pts.length] : null);
        const p = { x: scatter ? Math.random() * S.w : 0, y: scatter ? Math.random() * S.h : 0, vx: 0, vy: 0, ph: Math.random() * 6.28 };
        if (t) { p.amb = false; p.tx = ox + (t[0] + (Math.random() - .5) * 2) * sc; p.ty = oy + (t[1] + (Math.random() - .5) * 2) * sc; const mint = Math.random() < .05; p.c = mint ? '52,211,153' : mix([140, 110, 255], [224, 91, 234], t[0] / 400).join(','); p.cl = mint ? '5,150,105' : mix([91, 44, 201], [190, 40, 175], t[0] / 400).join(','); p.a = .95; }
        else { p.amb = true; const a = Math.random() * 6.28, r = S.w * (.36 + Math.random() * .14); p.tx = S.w / 2 + Math.cos(a) * r; p.ty = S.h / 2 + Math.sin(a) * r; p.c = '183,156,255'; p.cl = '150,120,225'; p.a = .2; }
        if (!scatter) { p.x = p.tx; p.y = p.ty; }
        return p;
      });
    };

    const draw = (dt, t) => {
      ctx.setTransform(S.d, 0, 0, S.d, 0, 0); ctx.clearRect(0, 0, S.w, S.h);
      const k = dt / 16, LT = document.documentElement.dataset.theme === 'light';
      for (const p of P) {
        if (!RM) {
          const wob = p.amb ? 6 : 1.2, tx = p.tx + Math.cos(t / 900 + p.ph) * wob, ty = p.ty + Math.sin(t / 1100 + p.ph) * wob;
          p.vx += (tx - p.x) * .045 * k; p.vy += (ty - p.y) * .045 * k;
          const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
          if (d2 < 5000) { const f = (5000 - d2) / 5000 * 2.2, d = Math.sqrt(d2) || 1; p.vx += dx / d * f * k; p.vy += dy / d * f * k; }
          p.vx *= .84; p.vy *= .84; p.x += p.vx * k; p.y += p.vy * k;
        }
        const sp = Math.min(1, Math.abs(p.vx) + Math.abs(p.vy)) * .3, s = p.amb ? (LT ? 1.5 : 1.6) : (LT ? 2.9 : 2.5);
        ctx.fillStyle = `rgba(${LT ? p.cl : p.c},${Math.min(1, (LT && p.amb ? .28 : p.a) + sp)})`; ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }
    };

    const tick = t => { const dt = Math.min(50, t - last); last = t; draw(dt, t); if (on) raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(([e]) => {
      if (RM) { draw(16, 0); return; }
      if (e.isIntersecting && !on) { on = true; last = performance.now(); raf = requestAnimationFrame(tick); }
      else if (!e.isIntersecting) { on = false; cancelAnimationFrame(raf); }
    });
    const move = e => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const leave = () => { mx = my = -999; };
    let rt = 0; const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { build(false); if (RM) draw(16, 0); }, 150); };

    build(!RM);
    // the SG mark uses the display font; rebuild once fonts are ready so the letters are right
    if (shape === 'sg' && document.fonts?.ready) document.fonts.ready.then(() => { if (el.isConnected) { const old = P; build(false); P.forEach((p, i) => { if (old[i]) { p.x = old[i].x; p.y = old[i].y; } }); if (RM) draw(16, 0); } });
    io.observe(el); cv.addEventListener('pointermove', move); cv.addEventListener('pointerleave', leave); addEventListener('resize', onResize); const onTheme = () => { if (RM || !on) draw(16, 0); }; addEventListener('sg-theme', onTheme);
    return () => { on = false; cancelAnimationFrame(raf); io.disconnect(); cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerleave', leave); removeEventListener('resize', onResize); removeEventListener('sg-theme', onTheme); };
  }, [shape]);

  return (
    <div className="pvis fadeup" ref={root} style={{ animationDelay: '.2s' }}>
      <canvas aria-hidden="true" />
      {chip && <div className="pchip"><span className="dot" /><div><small>{chip[0]}</small><b>{chip[1]}</b></div></div>}
      {children}
    </div>
  );
}
