import Link from 'next/link';
import { SG, LINKS, SOCIAL } from '@/lib/content';
import { CookieSettingsLink } from './client/Consent';


export default function Footer() {
  return (
    <footer><div className="wrap">
      <div className="fgrid">
        <div className="stack" style={{ gap: 20 }}>
          <Link className="logo" href="/" aria-label="SalesGarners home"><img className="brand-logo rev" src="/brand/salesgarners-logo.svg" alt="SalesGarners" width="256" height="40" /><img className="brand-logo ink" src="/brand/salesgarners-logo-dark.svg" alt="SalesGarners" width="256" height="40" /></Link>
          <div className="stack" style={{ gap: 8 }}><span className="note" style={{ color: 'var(--lilac)' }}>THE HEADQUARTER</span><p className="hq">Address: {SG.address}</p></div>
        </div>
        <div><h4>Services</h4><ul>{SG.services.map(s => <li key={s.slug}><Link href={`/${s.slug}`}>{s.short}</Link></li>)}</ul></div>
        <div><h4>Navigate</h4><ul><li><Link href="/about">About</Link></li><li><Link href="/x-engage">X-Engage</Link></li><li><Link href="/contact-us">Contact</Link></li></ul></div>
        <div><h4>Resources</h4><ul><li><Link href="/blog">Blogs</Link></li><li><Link href="/audience-overview">Audience Overview</Link></li><li><Link href="/case-study">Case Study</Link></li><li><a href={LINKS.calc} target="_blank" rel="noopener noreferrer">Revenue Pipeline Calculator</a></li></ul></div>
        <div><h4>Company</h4><ul><li><Link href="/careers">Culture &amp; Careers</Link></li><li><Link href="/privacy-policy">Privacy Policy</Link></li><li><Link href="/terms-conditions">Terms &amp; Conditions</Link></li></ul></div>
      </div>
      <div className="fbot">
        <span>© {new Date().getFullYear()} Salesgarners. All rights reserved <CookieSettingsLink /></span>
        <div className="soc">{SOCIAL.map(([s, l, u]) => <a key={l} href={u} target="_blank" rel="noopener noreferrer" aria-label={`SalesGarners on ${l}`}>{s}</a>)}</div>
      </div>
    </div></footer>
  );
}
