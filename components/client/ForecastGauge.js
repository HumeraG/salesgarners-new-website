'use client';
import { useEffect, useState } from 'react';

// Outbound Sales: "Why Pipeline Feels Unpredictable" — a forecast gauge whose needle keeps swinging
// between Miss and Hit, with the 4 pipeline problems as buttons. Changes every 10 seconds and loops;
// clicking a problem shows it and restarts the timer.
const ITEMS = [
  ['Sales Struggles to Convert', 'Your sales reps are drowning in unqualified leads instead of closing deals. Without a reliable lead qualification process, every rep becomes their own filter — spending hours chasing prospects who were never sales ready to begin with. This manual qualification bottleneck slows down your sales cycle, burns valuable selling time, and quietly kills conversion rates before deals even reach the negotiation stage.'],
  ['Marketing Generates MQLs', 'Your marketing campaigns are driving traffic and form fills, but lead volume means nothing without lead quality. Hundreds of MQLs flood in every month, yet without proper lead scoring, most never convert into sales qualified opportunities. The disconnect between marketing output and sales ready pipeline is exactly why so many B2B teams struggle to turn campaign spend into real revenue growth.'],
  ['Pipeline Becomes Unpredictable', 'An inconsistent lead flow means an inconsistent sales pipeline. Deals stall in random stages, follow ups fall through the cracks, and reps end up forecasting on gut feeling instead of real time pipeline data. For any B2B sales team trying to scale, this kind of pipeline unpredictability makes it nearly impossible to trust your own numbers — let alone plan for growth.'],
  ['Revenue Forecasting Breaks Down', 'When your pipeline isn’t feeding accurate data into your revenue targets, forecasting becomes a shot in the dark. Leadership loses real time visibility into what’s actually closing, budgets get built on assumptions, and hiring plans are based on hope rather than data. Fixing revenue forecasting starts with fixing the pipeline that feeds it — and that starts with a connected, predictable sales system.'],
];

export default function ForecastGauge() {
  const [k, setK] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setK(x => (x + 1) % ITEMS.length), 10000);
    return () => clearInterval(t);
  }, [tick]);

  const [title, text] = ITEMS[k];
  return (
    <div className="fgz" data-r="">
      <div className="fgz-left">
        <div className="fgz-dial" aria-hidden="true">
          <div className="fgz-arc"><span /></div>
          <span className="fgz-miss">Miss</span>
          <span className="fgz-hit">Hit</span>
          <span className="fgz-needle" />
          <span className="fgz-hub" />
          <span className="fgz-cap">Revenue forecast: guessing</span>
        </div>
        <div className="fgz-tabs" role="tablist" aria-label="Why pipeline feels unpredictable">
          {ITEMS.map(([t], i) => (
            <button key={t} type="button" role="tab" id={`fgz-tab-${i}`} aria-controls="fgz-panel" aria-selected={i === k}
              className={i === k ? 'on' : ''} onClick={() => { setK(i); setTick(x => x + 1); }}>
              <small>0{i + 1}</small>{t}
            </button>
          ))}
        </div>
      </div>
      <div key={k} className="fgz-panel" id="fgz-panel" role="tabpanel" aria-labelledby={`fgz-tab-${k}`} aria-live="polite">
        <span className="fgz-tag">0{k + 1} · What is going wrong</span>
        <h3>{title}</h3>
        <p>{text}</p>
        <span className="fgz-timer" aria-hidden="true"><i key={`${k}-${tick}`} /></span>
      </div>
    </div>
  );
}
