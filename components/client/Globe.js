'use client';
import { useEffect, useRef } from 'react';

const fmtIN = n => Math.round(n).toLocaleString('en-IN');
function setupC(c) { const r = c.getBoundingClientRect(), d = window.devicePixelRatio || 1; c.width = r.width * d; c.height = r.height * d; const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); return { x, w: r.width, h: r.height }; }

function run(root, RM) {
const c=root.querySelector('canvas');let S=setupC(c);const onR=()=>S=setupC(c);addEventListener('resize',onR);let alive=true;const stop=()=>{alive=false;removeEventListener('resize',onR)};
const land=[[50,72,-165,-60],[25,50,-125,-67],[15,25,-105,-80],[60,82,-55,-20],[0,12,-80,-50],[-20,0,-80,-35],[-40,-20,-72,-48],[-55,-40,-75,-65],[36,60,-10,30],[55,71,5,40],[5,35,-17,35],[-35,5,10,42],[-25,-12,43,50],[12,40,35,60],[40,75,40,180],[20,40,60,122],[8,25,72,88],[0,25,95,110],[30,45,126,145],[-10,5,95,140],[-38,-12,114,153]];
const isLand=(la,lo)=>land.some(([a,b,c2,d])=>la>=a&&la<=b&&lo>=c2&&lo<=d)&&!(la>36&&la<46&&lo>-10&&lo<36&&Math.random()<.0);
const pts=[];const N=2600,ga=Math.PI*(3-Math.sqrt(5));
for(let i=0;i<N;i++){const y=1-i/(N-1)*2,r=Math.sqrt(1-y*y),th=ga*i;const la=Math.asin(y)*180/Math.PI,lo=((th*180/Math.PI)%360)-180;pts.push({la,lo,land:isLand(la,lo)})}
const hubs={NA:[40,-98],EMEA:[50,10],APAC:[30,112],LATAM:[-14,-58],ANZ:[-27,135],IN:[20,78]};
const names=['NA','EMEA','APAC','LATAM','ANZ'];
const arcs=[];let spin=-1.2;const tilt=.38;
const proj=(la,lo,R,cx,cy)=>{const p=la*Math.PI/180,l=lo*Math.PI/180+spin;let X=Math.cos(p)*Math.sin(l),Y=Math.sin(p),Z=Math.cos(p)*Math.cos(l);const y2=Y*Math.cos(tilt)-Z*Math.sin(tilt),z2=Y*Math.sin(tilt)+Z*Math.cos(tilt);return[cx+X*R,cy-y2*R,z2]};
const slerp=(a,b,t)=>{const v=(la,lo)=>{const p=la*Math.PI/180,l=lo*Math.PI/180;return[Math.cos(p)*Math.cos(l),Math.cos(p)*Math.sin(l),Math.sin(p)]};const A=v(...a),B=v(...b);const d=Math.acos(Math.min(1,A[0]*B[0]+A[1]*B[1]+A[2]*B[2]));const s=Math.sin(d)||1;const k1=Math.sin((1-t)*d)/s,k2=Math.sin(t*d)/s;const P=[A[0]*k1+B[0]*k2,A[1]*k1+B[1]*k2,A[2]*k1+B[2]*k2];return[Math.asin(P[2])*180/Math.PI,Math.atan2(P[1],P[0])*180/Math.PI]};
const sigEl=root.querySelector('[data-sig]'),evt=root.querySelector('[data-evt]'),evtt=root.querySelector('[data-evtt]'),chips=[...root.querySelectorAll('[data-regions] span')];let sig=124806;
const acts=['Whitepaper downloaded','Webinar registration','Report read 90%','Case study opened','Demo page revisit'];let ai=0;
const pairs=[['NA','EMEA'],['NA','LATAM'],['EMEA','IN'],['IN','APAC'],['APAC','ANZ'],['EMEA','APAC'],['LATAM','EMEA'],['IN','ANZ']];let pk=0;
const newArc=()=>{const {w,h}=S;for(let n=0;n<pairs.length;n++){const [a,b]=pairs[(pk+n)%pairs.length];const za=proj(...hubs[a],1,0,0)[2],zb=proj(...hubs[b],1,0,0)[2];if(za>.05&&zb>.05){pk=(pk+n+1)%pairs.length;arcs.push(Math.random()<.5?{a,b,t:0}:{a:b,b:a,t:0});return}}pk++};
const land2=r=>{const n=names.includes(r)?r:'APAC';chips.forEach(c=>c.classList.toggle('on',c.textContent===n));evt.style.opacity=0;evt.style.transform='translateY(6px)';setTimeout(()=>{evtt.textContent=`${n} · ${acts[ai++%acts.length]}`;evt.style.opacity=1;evt.style.transform='none'},250);sig+=37+Math.floor(Math.random()*90);sigEl.textContent=fmtIN(sig)};
newArc();land2('EMEA');
let la=0;
function frame(t){if(!alive||!root.isConnected)return;requestAnimationFrame(frame);if(document.hidden||root.getBoundingClientRect().bottom<0)return;const {x,w,h}=S;const cx=w*.5,cy=h*.52,R=w*.36;
  const LT=document.documentElement.dataset.theme==='light';if(!RM)spin+=.0016;x.clearRect(0,0,w,h);
  const g=x.createRadialGradient(cx-R*.3,cy-R*.4,R*.1,cx,cy,R*1.1);if(LT){const b=x.createRadialGradient(cx-R*.35,cy-R*.4,R*.05,cx,cy,R);b.addColorStop(0,'rgba(255,255,255,.95)');b.addColorStop(.7,'rgba(240,234,255,.75)');b.addColorStop(1,'rgba(220,208,252,.65)');x.fillStyle=b;x.beginPath();x.arc(cx,cy,R,0,7);x.fill();x.save();x.shadowColor='rgba(109,67,231,.25)';x.shadowBlur=40;x.beginPath();x.arc(cx,cy,R,0,7);x.strokeStyle='rgba(109,67,231,.0)';x.stroke();x.restore()}else{g.addColorStop(0,'rgba(109,67,231,.28)');g.addColorStop(1,'rgba(6,8,26,0)');x.fillStyle=g;x.beginPath();x.arc(cx,cy,R*1.12,0,7);x.fill()}
  x.strokeStyle=LT?'rgba(109,67,231,.55)':'rgba(183,156,255,.25)';x.lineWidth=LT?1.4:1;x.beginPath();x.arc(cx,cy,R,0,7);x.stroke();
  for(const p of pts){const [px,py,z]=proj(p.la,p.lo,R,cx,cy);if(z<0)continue;if(LT){x.globalAlpha=p.land?.6+.4*z:.25+.3*z;x.fillStyle=p.land?'#5B2CC9':'#C2B8E6'}else{x.globalAlpha=p.land?.3+.65*z:.12*z+.03;x.fillStyle=p.land?'#C4B0FF':'#4A5180'}x.beginPath();x.arc(px,py,p.land?(LT?1.75:1.4):(LT?.9:.8),0,7);x.fill()}
  x.globalAlpha=1;
  for(const k in hubs){const [px,py,z]=proj(...hubs[k],R,cx,cy);if(z<0)continue;const pr=(t/1000*1.4+k.length)%1;x.lineWidth=LT?2:1;x.strokeStyle=LT?`rgba(201,48,181,${(1-pr)*z})`:`rgba(224,91,234,${(1-pr)*z})`;x.beginPath();x.arc(px,py,4+pr*14,0,7);x.stroke();x.lineWidth=1;if(LT){x.fillStyle='#fff';x.beginPath();x.arc(px,py,5,0,7);x.fill();x.fillStyle='#6D43E7';x.beginPath();x.arc(px,py,3.2,0,7);x.fill()}else{x.fillStyle='#fff';x.beginPath();x.arc(px,py,3,0,7);x.fill()}}
  for(let i=arcs.length-1;i>=0;i--){const A=arcs[i];A.t+=RM?1:.012;const steps=40,head=Math.min(1,A.t),tail=Math.max(0,A.t-.55);
    x.lineWidth=LT?2.6:2;let prev=null;for(let s=0;s<=steps;s++){const u=tail+(head-tail)*s/steps;const [lat,lon]=slerp(hubs[A.a],hubs[A.b],u);const lift=1+.18*Math.sin(Math.PI*u);const [px,py,z]=proj(lat,lon,R*lift,cx,cy);
      if(prev&&z>-.1){x.strokeStyle=LT?`rgba(${s/steps>.8?'5,150,105':'190,40,175'},${.45+.55*s/steps})`:`rgba(${s/steps>.8?'52,211,153':'208,84,224'},${.25+.75*s/steps})`;x.beginPath();x.moveTo(prev[0],prev[1]);x.lineTo(px,py);x.stroke()}prev=[px,py]}
    if(A.t>=1&&!A.done){A.done=1;land2(A.b)}
    if(A.t>1.55)arcs.splice(i,1)}
  x.lineWidth=1;
  if(t-la>1100){newArc();la=t}
}
requestAnimationFrame(frame);
}


function stand(st) {
  const bt = st.parentElement.querySelector('[data-standbtns]'); let cur = 2, hover = false;
  const covers = SG.publications.map(([m, n, d, u, a, b], i) => { const el = document.createElement('a'); el.className = 'cover'; el.href = u; el.target = '_blank'; el.rel = 'noopener'; el.style.setProperty('--a', a); el.style.setProperty('--b', b);
    el.innerHTML = `<div class="top"><span>DAILY B2B NEWS</span><span>№ 0${i + 1}</span></div><div class="mast">${n}<small>A SALESGARNERS PUBLICATION</small></div><span class="big">${m}</span><p class="cl">${d}</p><span class="visit">Visit site ↗</span>`;
    st.appendChild(el); el.addEventListener('mouseenter', () => set(i)); el.addEventListener('focus', () => set(i)); return el; });
  const btns = SG.publications.map(([, n], i) => { const b = document.createElement('button'); b.textContent = n; b.onclick = () => set(i); bt.appendChild(b); return b; });
  function set(k) { cur = k; const step = Math.min(150, st.clientWidth / 7.5); covers.forEach((c, i) => { const o = i - k; c.style.transform = `translateX(${o * step}px) translateZ(${-Math.abs(o) * 60}px) rotate(${o * 6}deg) scale(${o === 0 ? 1.06 : 1})`; c.style.zIndex = 10 - Math.abs(o); c.style.filter = o === 0 ? 'none' : `brightness(${1 - Math.abs(o) * .08})`; c.classList.toggle('front', o === 0); }); btns.forEach((b, i) => b.classList.toggle('on', i === k)); }
  set(cur); const onR = () => st.isConnected && set(cur); addEventListener('resize', onR);
  st.parentElement.addEventListener('mouseenter', () => hover = true); st.parentElement.addEventListener('mouseleave', () => hover = false);
  if (!RM) timers.push(setInterval(() => { if (!hover && !document.hidden) set((cur + 1) % 6); }, 3500));

  return stop;
}

// Hero visual: rotating dotted globe with intent-signal arcs between NA, EMEA, APAC, LATAM, ANZ and India
export default function Globe() {
  const root = useRef(null);
  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return run(root.current, RM);
  }, []);
  return (
    <div className="gvis fadeup" style={{ animationDelay: '.3s' }} ref={root}>
      <canvas aria-label="Animated globe showing intent signals across NA, EMEA, APAC, LATAM and ANZ" />
      <div className="chip g-tick"><small>LIVE INTENT SIGNALS</small><b data-sig="">1,24,806</b><span>first-party engagements today</span></div>
      <div className="chip g-evt" data-evt=""><span className="dot" style={{ background: 'var(--orchid)' }} /><span data-evtt="">EMEA · Whitepaper downloaded</span></div>
      <div className="regions" data-regions=""><span>NA</span><span>EMEA</span><span>APAC</span><span>LATAM</span><span>ANZ</span></div>
    </div>
  );
}
