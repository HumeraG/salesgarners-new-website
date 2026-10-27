'use client';
import { useState } from 'react';

// Content Syndication · "Why choose us": four tall pillars; the selected one widens and shows its text.
const c = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const ITEMS = [
  ['M4 5a8 3 0 1 0 16 0a8 3 0 1 0 -16 0M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6', 'Built for Pipeline, Not Vanity Metrics', 'We don’t chase clicks, we drive conversations. Every campaign is built to generate qualified leads that convert, not just downloads that look good on reports.'],
  ['M6 20V4M3 7l3-3 3 3M12 6h9M12 11h7M12 16h5', 'First-Party Data with Real Buying Signals', 'We own the audience and see the signals. That means smarter targeting, better timing, and leads who are already leaning in.'],
  [c(11, 11, 7) + 'M20 20l-4-4', 'Personalized Delivery at Scale', 'Your content lands in the inboxes of high intent decision makers matched to your ICP and nurtured through multi touch engagement.'],
  [c(9, 8, 3.5) + 'M2 20c0-3.9 3.1-7 7-7s7 3.1 7 7' + c(17, 9, 2.5) + 'M16 14c3 0 6 2.5 6 6', 'Full-Funnel Visibility & Lead Qualification', 'From click to close, we track every interaction. You get lead level insights, verified answers, and sales-ready handoffs with no guesswork.'],
];

export default function WhyPillars() {
  const [k, setK] = useState(0);
  return (
    <div className="wcs" data-r="">
      <div className="wcs-head">
        <div>
          <span className="eyebrow">Why choose our content syndication</span>
          <h2 className="h2">We Don’t Just Bring Engagements, <span className="gt">We Bring Conversions</span></h2>
        </div>
        <span className="wcs-hint">Tap a pillar ↓</span>
      </div>
      <div className="wcs-row">
        {ITEMS.map(([d, t, text], i) => {
          const on = i === k;
          return (
            <button key={t} type="button" className={`wcs-p${on ? ' on' : ''}`} aria-expanded={on} onClick={() => setK(i)}>
              <span className="wcs-top">
                <span className="wcs-ic"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg></span>
                <span className="wcs-no">0{i + 1}</span>
              </span>
              <span className="wcs-body">
                <b>{t}</b>
                {on && <span className="wcs-txt">{text}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
