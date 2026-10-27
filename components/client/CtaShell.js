'use client';
import { usePathname } from 'next/navigation';

// Alternates the CTA layout page by page: every other page gets the mirrored ("flipped") version.
const ORDER = ['/', '/about', '/b2b-content-syndication', '/lead-generation', '/event-based-lead-generation', '/outbound-sales', '/data-services', '/audience-overview', '/x-engage', '/publications', '/case-study', '/blog', '/whitepaper', '/careers', '/contact-us', '/pilot-campaign'];

function isFlipped(path) {
  const p = (path || '/').replace(/\/+$/, '') || '/';
  const i = ORDER.indexOf(p);
  if (i >= 0) return i % 2 === 1;
  // Detail pages (a blog post, a case study) use the opposite of their listing page.
  const parent = '/' + p.split('/')[1];
  const j = ORDER.indexOf(parent);
  return j >= 0 ? j % 2 === 0 : false;
}

export default function CtaShell({ children }) {
  const flip = isFlipped(usePathname());
  return <section className={`ctx${flip ? ' flip' : ''}`}>{children}</section>;
}
