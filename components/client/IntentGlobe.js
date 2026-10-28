'use client';
import { useEffect, useRef, useState } from 'react';

// X-Engage hero: "Intent globe". A slowly turning dotted globe with arcs firing between
// the regions SalesGarners covers (NA, EMEA, APAC, LATAM, ANZ). Each landing arc lights
// a region tag, updates the live event chip and ticks the engagement counter.
const NAMES = ['NA', 'EMEA', 'APAC', 'LATAM', 'ANZ'];
const ACTS = ['Whitepaper downloaded', 'Webinar registration', 'Report read 90%', 'Case study opened', 'Demo page revisit'];
const HUBS = { NA: [40, -98], EMEA: [50, 10], APAC: [30, 112], LATAM: [-14, -58], ANZ: [-27, 135], IN: [20, 78] };
const PAIRS = [['NA', 'EMEA'], ['NA', 'LATAM'], ['EMEA', 'IN'], ['IN', 'APAC'], ['APAC', 'ANZ'], ['EMEA', 'APAC'], ['LATAM', 'EMEA'], ['IN', 'ANZ']];
const LAND = [[50,72,-165,-60],[25,50,-125,-67],[15,25,-105,-80],[60,82,-55,-20],[0,12,-80,-50],[-20,0,-80,-35],[-40,-20,-72,-48],[-55,-40,-75,-65],[36,60,-10,30],[55,71,5,40],[5,35,-17,35],[-35,5,10,42],[-25,-12,43,50],[12,40,35,60],[40,75,40,180],[20,40,60,122],[8,25,72,88],[0,25,95,110],[30,45,126,145],[-10,5,95,140],[-38,-12,114,153]];
const fmt = n => Math.round(n).toLocaleString('en-IN');

export default function IntentGlobe() {
  const box = useRef(null);
  const cv = useRef(null);
  const [sig, setSig] = useState(124806);
  const [region, setRegion] = useState('EMEA');
  const [evt, setEvt] = useState({ text: 'EMEA · Whitepaper downloaded', show: true });

  useEffect(() => {
    const c = cv.current, root = box.current;
    if (!c || !root) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let S = null, raf = 0, visible = true, spin = -1.2, pk = 0, ai = 0, lastArc = 0;
    const tilt = 0.38, arcs = [], timers = [];
    const setup = () => {
      const r = c.getBoundingClientRect(), d = window.devicePixelRatio || 1;
      c.width = r.width * d; c.height = r.height * d;
      const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0);
      S = { x, w: r.width, h: r.height };
    };
    setup();
    const ro = new ResizeObserver(setup); ro.observe(c);
    const io = new IntersectionObserver(es => es.forEach(e => { visible = e.isIntersecting; }), { threshold: 0.05 });
    io.observe(root);

    const isLand = (la, lo) => LAND.some(([a, b, c2, d]) => la >= a && la <= b && lo >= c2 && lo <= d);
    const pts = []; const N = 2600, ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - i / (N - 1) * 2, th = ga * i;
      const la = Math.asin(y) * 180 / Math.PI, lo = ((th * 180 / Math.PI) % 360) - 180;
      pts.push({ la, lo, land: isLand(la, lo) });
    }
    const proj = (la, lo, R, cx, cy) => {
      const p = la * Math.PI / 180, l = lo * Math.PI / 180 + spin;
      const X = Math.cos(p) * Math.sin(l), Y = Math.sin(p), Z = Math.cos(p) * Math.cos(l);
      const y2 = Y * Math.cos(tilt) - Z * Math.sin(tilt), z2 = Y * Math.sin(tilt) + Z * Math.cos(tilt);
      return [cx + X * R, cy - y2 * R, z2];
    };
    const slerp = (a, b, t) => {
      const v = (la, lo) => { const p = la * Math.PI / 180, l = lo * Math.PI / 180; return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)]; };
      const A = v(...a), B = v(...b);
      const d = Math.acos(Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2])); const s = Math.sin(d) || 1;
      const k1 = Math.sin((1 - t) * d) / s, k2 = Math.sin(t * d) / s;
      const P = [A[0] * k1 + B[0] * k2, A[1] * k1 + B[1] * k2, A[2] * k1 + B[2] * k2];
      return [Math.asin(P[2]) * 180 / Math.PI, Math.atan2(P[1], P[0]) * 180 / Math.PI];
    };
    const newArc = () => {
      for (let n = 0; n < PAIRS.length; n++) {
        const [a, b] = PAIRS[(pk + n) % PAIRS.length];
        const za = proj(...HUBS[a], 1, 0, 0)[2], zb = proj(...HUBS[b], 1, 0, 0)[2];
        if (za > 0.05 && zb > 0.05) { pk = (pk + n + 1) % PAIRS.length; arcs.push(Math.random() < 0.5 ? { a, b, t: 0 } : { a: b, b: a, t: 0 }); return; }
      }
      pk++;
    };
    const landed = r => {
      const n = NAMES.includes(r) ? r : 'APAC';
      setRegion(n);
      setEvt(e => ({ ...e, show: false }));
      timers.push(setTimeout(() => setEvt({ text: `${n} · ${ACTS[ai++ % ACTS.length]}`, show: true }), 250));
      setSig(s => s + 37 + Math.floor(Math.random() * 90));
    };
    newArc();

    const frame = t => {
      raf = requestAnimationFrame(frame);
      if (!visible || !S) return;
      const { x, w, h } = S; const cx = w * 0.5, cy = h * 0.52, R = w * 0.36;
      if (!RM) spin += 0.0016;
      x.clearRect(0, 0, w, h);
      const g = x.createRadialGradient(cx - R * 0.3, cy - R * 0.4, R * 0.1, cx, cy, R * 1.1);
      g.addColorStop(0, 'rgba(109,67,231,.28)'); g.addColorStop(1, 'rgba(6,8,26,0)');
      x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R * 1.12, 0, 7); x.fill();
      x.strokeStyle = 'rgba(183,156,255,.25)'; x.lineWidth = 1; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.stroke();
      for (const p of pts) {
        const [px, py, z] = proj(p.la, p.lo, R, cx, cy); if (z < 0) continue;
        x.globalAlpha = p.land ? 0.3 + 0.65 * z : 0.12 * z + 0.03;
        x.fillStyle = p.land ? '#C4B0FF' : '#4A5180';
        x.beginPath(); x.arc(px, py, p.land ? 1.4 : 0.8, 0, 7); x.fill();
      }
      x.globalAlpha = 1;
      for (const k in HUBS) {
        const [px, py, z] = proj(...HUBS[k], R, cx, cy); if (z < 0) continue;
        const pr = (t / 1000 * 1.4 + k.length) % 1;
        x.strokeStyle = `rgba(224,91,234,${(1 - pr) * z})`; x.beginPath(); x.arc(px, py, 4 + pr * 14, 0, 7); x.stroke();
        x.fillStyle = '#fff'; x.beginPath(); x.arc(px, py, 3, 0, 7); x.fill();
      }
      for (let i = arcs.length - 1; i >= 0; i--) {
        const A = arcs[i]; A.t += RM ? 1 : 0.012;
        const steps = 40, head = Math.min(1, A.t), tail = Math.max(0, A.t - 0.55);
        x.lineWidth = 2; let prev = null;
        for (let s = 0; s <= steps; s++) {
          const u = tail + (head - tail) * s / steps;
          const [lat, lon] = slerp(HUBS[A.a], HUBS[A.b], u);
          const lift = 1 + 0.18 * Math.sin(Math.PI * u);
          const [px, py, z] = proj(lat, lon, R * lift, cx, cy);
          if (prev && z > -0.1) { x.strokeStyle = `rgba(${s / steps > 0.8 ? '52,211,153' : '208,84,224'},${0.25 + 0.75 * s / steps})`; x.beginPath(); x.moveTo(prev[0], prev[1]); x.lineTo(px, py); x.stroke(); }
          prev = [px, py];
        }
        if (A.t >= 1 && !A.done) { A.done = 1; landed(A.b); }
        if (A.t > 1.55) arcs.splice(i, 1);
      }
      x.lineWidth = 1;
      if (t - lastArc > 1100) { newArc(); lastArc = t; }
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); timers.forEach(clearTimeout); };
  }, []);

  return (
    <div className="igb" ref={box} aria-hidden="true">
      <canvas ref={cv} />
      <div className="igb-chip igb-tick">
        <small>Live intent signals</small>
        <b>{fmt(sig)}</b>
        <span>first-party engagements today</span>
      </div>
      <div className={`igb-chip igb-evt${evt.show ? '' : ' hide'}`}><span className="igb-dot" />{evt.text}</div>
      <div className="igb-regions">
        {NAMES.map(n => <span key={n} className={n === region ? 'on' : ''}>{n}</span>)}
      </div>
    </div>
  );
}
