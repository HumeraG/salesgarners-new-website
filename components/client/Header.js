'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';
import { SG, LINKS, NAV_MAIN, RESOURCES, SOCIAL } from '@/lib/content';
import ThemeToggle from './ThemeToggle';

// Desktop menu, same order as salesgarners.com: [label, link, dropdown kind]
const DESK = [['Home', '/'], ['About', '/about'], ['Our Services', '/b2b-content-syndication', 'svc'], ['Audience Overview', '/audience-overview'], ['Publications', '/publications'], ['X-Engage', '/x-engage'], ['Resources', '/blog', 'res'], ['Contact Us', '/contact-us']];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const ov = useRef(null);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey); };
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) setTimeout(() => ov.current?.querySelector('.big a')?.focus({ preventScroll: true }), 350);
  }, [open]);

  const active = href => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const close = () => setOpen(false);

  return (
    <>
      <div className="promo">
        <Link href="/pilot-campaign"><div className="track">
          {[0, 1, 2, 3].map(k => SG.promo.map((t, i) => <Fragment key={`${k}-${i}`}><span>{t}</span><i>✦</i></Fragment>))}
        </div></Link>
      </div>
      <header className={`nav ${scrolled ? 'scrolled' : ''} ${open ? 'menu-on' : ''}`} id="nav">
        <div className="wrap">
          <Link className="logo" href="/" aria-label="SalesGarners home">
            <img className="brand-logo rev" src="/brand/salesgarners-logo.svg" alt="SalesGarners" width="256" height="40" /><img className="brand-logo ink" src="/brand/salesgarners-logo-dark.svg" alt="SalesGarners" width="256" height="40" />
          </Link>
          <nav className="dnav" aria-label="Primary">
            {DESK.map(([t, href, kind]) => kind ? (
              <div className="dn" key={t}>
                <Link href={href} className={`dn-top ${active(href) || (kind === 'res' && RESOURCES.some(([, h]) => active(h))) ? 'act' : ''}`} aria-haspopup="true">{t}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" /></svg></Link>
                <div className="dmenu" role="menu">
                  {(kind === 'svc' ? SG.services.map(s => [s.nav, `/${s.slug}`]) : RESOURCES.map(([n, h]) => [n, h])).map(([n, h]) => <Link key={h} href={h} role="menuitem" className={active(h) ? 'act' : ''}>{n}</Link>)}
                </div>
              </div>
            ) : <Link key={t} href={href} className={active(href) ? 'act' : ''}>{t}</Link>)}
          </nav>
          <div className="nright">
            <a className="btn p sm hide-sm" href={LINKS.demo} target="_blank" rel="noopener noreferrer">Book a Demo</a>
            <ThemeToggle />
            <button className="mbtn" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(o => !o)}>
              <span className="lbl"><span>Menu</span><span>Close</span></span>
              <span className="lines"><i /><i /></span>
            </button>
          </div>
        </div>
      </header>
      <div className={`ov ${open ? 'on' : ''}`} id="site-menu" ref={ov} aria-hidden={!open}
        onPointerMove={e => { e.currentTarget.style.setProperty('--gx', e.clientX + 'px'); e.currentTarget.style.setProperty('--gy', e.clientY + 'px'); }}>
        <div className="glw" />
        <div className="wrap ov-in">
          <nav className="big" aria-label="Main">
            {NAV_MAIN.map(([t, href], i) => (
              <Link key={href} href={href} onClick={close} className={active(href) ? 'act' : ''} style={{ '--d': `${120 + i * 60}ms` }} tabIndex={open ? 0 : -1}><span>{t}</span></Link>
            ))}
          </nav>
          <div className="col">
            <h4>OUR SERVICES</h4>
            {SG.services.map(s => <Link key={s.slug} href={`/${s.slug}`} onClick={close} className={active(`/${s.slug}`) ? 'act' : ''} tabIndex={open ? 0 : -1}>{s.nav}</Link>)}
            <h4 style={{ marginTop: 22 }}>GET STARTED</h4>
            <Link href="/pilot-campaign" onClick={close} tabIndex={open ? 0 : -1}>Free Content Syndication Pilot</Link>
          </div>
          <div className="col">
            <h4>RESOURCES</h4>
            {RESOURCES.map(([t, href]) => <Link key={href} href={href} onClick={close} className={active(href) ? 'act' : ''} tabIndex={open ? 0 : -1}>{t}</Link>)}
            <a href={LINKS.calc} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>Revenue Pipeline Calculator</a>
            <h4 style={{ marginTop: 22 }}>THE HEADQUARTER</h4>
            <p className="addr">Office 1506, 15th Floor, Nyati Enthral, Kharadi South Main Road, Kharadi, Pune 411014</p>
            <p className="addr">info@salesgarners.com · +91 8177811189</p>
            <div className="btns" style={{ marginTop: 6 }}>
              <a className="btn s sm" href={LINKS.portal} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>X-Engage Portal <span className="ar">→</span></a>
              <a className="btn p sm show-sm" href={LINKS.demo} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>Book a Demo <span className="ar">→</span></a>
            </div>
            <div className="osoc">{SOCIAL.map(([s, l, u]) => <a key={l} href={u} target="_blank" rel="noopener noreferrer" aria-label={`SalesGarners on ${l}`}>{s}</a>)}</div>
          </div>
        </div>
      </div>
    </>
  );
}
