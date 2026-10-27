'use client';
import { useEffect, useState } from 'react';

// Content Syndication hero: your PDF rides the syndication belt and drops into the audiences you target.
// Each audience bin counts example leads; visitors can switch audiences on and off.
const AUDIENCES = ['IT & Security', 'Marketing', 'HR', 'Finance', 'Sales'];

export default function SyndicationFlow() {
  const [off, setOff] = useState({});
  const [count, setCount] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    const t = setInterval(() => {
      setCount(prev => prev.map((v, i) => (!off[i] && Math.random() < 0.35 ? v + 1 : v)));
    }, 600);
    return () => clearInterval(t);
  }, [off]);

  const total = count.reduce((a, b) => a + b, 0);

  return (
    <div className="sfc" role="group" aria-label="Your content syndicated to the audiences you choose">
      <div className="sfc-pdf" aria-hidden="true">
        <span className="sfc-tag">PDF</span>
        <b>eBook / whitepaper</b>
        <i /><i style={{ width: '70%' }} />
      </div>
      <div className="sfc-belt" aria-hidden="true" />
      {[0, 1, 2, 3, 4].map(i => <span key={`b${i}`} className="sfc-copy" style={{ animationDelay: `${i * 0.5}s` }} aria-hidden="true" />)}
      <span className="sfc-label">Syndicating → matched to your ICP</span>

      {AUDIENCES.map((a, i) => {
        const on = !off[i];
        return (
          <div key={a} className={`sfc-lane${on ? ' on' : ''}`} style={{ '--i': i }} aria-hidden="true">
            {on && <><span className="sfc-drop" style={{ animationDelay: `${i * 0.3}s` }} /><span className="sfc-drop alt" style={{ animationDelay: `${i * 0.3 + 0.9}s` }} /></>}
          </div>
        );
      })}

      {AUDIENCES.map((a, i) => {
        const on = !off[i];
        return (
          <button key={`bin${a}`} type="button" className={`sfc-bin${on ? ' on' : ''}`} style={{ '--i': i }} aria-pressed={on}
            aria-label={`${a}: ${count[i]} leads, ${on ? 'live' : 'paused'}`} onClick={() => setOff(o => ({ ...o, [i]: on }))}>
            <b>{count[i]}</b>
            <span>{a}</span>
            <small>{on ? 'LIVE' : 'PAUSED'}</small>
          </button>
        );
      })}

      <div className="sfc-foot">
        <span>Tap an audience to switch it on or off</span>
        <span className="sfc-total" aria-live="polite"><b>{total}</b> leads · example</span>
      </div>
    </div>
  );
}
