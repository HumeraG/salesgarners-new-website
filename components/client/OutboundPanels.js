'use client';
import { useEffect, useState } from 'react';

// Outbound Sales hero: Ad → Inbox → Calendar.
// Shows how SalesGarners reaches people who don't know you yet: ads build awareness,
// multi-channel outreach starts conversations, replies become qualified meetings.
// Moves to the next step every 5 seconds and loops; clicking a step jumps to it and restarts the timer.
const STEPS = [
  { tab: '1 · Get seen', tag: 'Step 1 · Ads build awareness', title: 'People in your ICP see your brand first',
    chips: ['LinkedIn & display ads', 'Role + industry targeting', 'Intent-based audiences'] },
  { tab: '2 · Start talking', tag: 'Step 2 · Outreach starts conversations', title: 'Now they recognise you, so they reply',
    chips: ['Personalised email', 'LinkedIn touches', 'SDR calls'] },
  { tab: '3 · Book meetings', tag: 'Step 3 · Replies become meetings', title: 'Qualified meetings land on your calendar',
    chips: ['BANT-qualified', 'Booked for your sales team', 'Tracked to revenue'] },
];
const BUSY = [1, 6, 8, 12, 13];

export default function OutboundPanels() {
  const [k, setK] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setK(x => (x + 1) % STEPS.length), 5000);
    return () => clearInterval(t);
  }, [tick]);

  const go = i => { setK(i); setTick(t => t + 1); };
  const cls = i => `obp-panel${i === k ? ' on' : ''}`;
  const cur = STEPS[k];

  return (
    <div className="obp">
      <div className="obp-tabs" role="tablist" aria-label="How outbound sales works">
        {STEPS.map((s, i) => (
          <button key={s.tab} type="button" role="tab" id={`obp-tab-${i}`} aria-controls="obp-card" aria-selected={i === k}
            className={`obp-tab${i === k ? ' on' : ''}`} onClick={() => go(i)}>{s.tab}</button>
        ))}
      </div>

      <div className="obp-row">
        <button type="button" className={`${cls(0)} obp-ad`} onClick={() => go(0)} aria-label="Step 1: your ad">
          <span className="obp-adh"><i />Your brand <small>· Sponsored</small></span>
          <span className="obp-adimg">Stuck at 2% reply rates?</span>
          <span className="obp-adtx">See how SaaS teams book more qualified meetings.</span>
          <span className="obp-adcta">Learn more</span>
        </button>
        <span className="obp-link" aria-hidden="true"><i /></span>
        <button type="button" className={`${cls(1)} obp-inbox`} onClick={() => go(1)} aria-label="Step 2: inbox">
          <span className="obp-lbl">Inbox</span>
          <span className="obp-mail"><b>Quick idea for your Q4 pipeline</b>Saw you’re scaling your sales team. Here’s how…</span>
          <span className="obp-mail re"><b>↩ Reply from prospect</b>“Interesting. Open to a call Tuesday?”</span>
          <span className="obp-more">+ LinkedIn · call follow-ups</span>
        </button>
        <span className="obp-link g" aria-hidden="true"><i /></span>
        <button type="button" className={`${cls(2)} obp-cal`} onClick={() => go(2)} aria-label="Step 3: calendar">
          <span className="obp-lbl">Calendar</span>
          <span className="obp-grid" aria-hidden="true">
            {Array.from({ length: 15 }, (_, i) => <i key={i} className={i === 7 ? 'm' : BUSY.includes(i) ? 'b' : ''} />)}
          </span>
          <span className="obp-booked"><b>✓ Meeting booked</b>Tue 11:00 · VP Sales, SaaS</span>
        </button>
      </div>

      <div key={k} className="obp-card" id="obp-card" role="tabpanel" aria-labelledby={`obp-tab-${k}`} aria-live="polite">
        <span className="obp-tag">{cur.tag}</span>
        <b className="obp-title">{cur.title}</b>
        <span className="obp-chips">{cur.chips.map(c => <span key={c}>{c}</span>)}</span>
        <span className="obp-timer" aria-hidden="true"><i key={`${k}-${tick}`} /></span>
      </div>
    </div>
  );
}
