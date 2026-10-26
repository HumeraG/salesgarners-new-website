'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';

// Cookie banner + Google Analytics 4.
// GA loads only after the visitor clicks Accept, and only when NEXT_PUBLIC_GA_ID is set.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
const KEY = 'sg-consent'; // 'granted' | 'denied'

const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const save = v => { try { localStorage.setItem(KEY, v); } catch {} };

function clearGaCookies() {
  document.cookie.split(';').map(c => c.trim().split('=')[0]).filter(n => n === '_ga' || n.startsWith('_ga_') || n === '_gid')
    .forEach(n => {
      const host = location.hostname, root = host.split('.').slice(-2).join('.');
      [host, '.' + root, ''].forEach(d => { document.cookie = `${n}=; Max-Age=0; path=/${d ? '; domain=' + d : ''}`; });
    });
}

export default function Consent() {
  const [choice, setChoice] = useState(null); // null until read on the client
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const c = read(); setChoice(c); setOpen(!c);
    const reopen = () => setOpen(true);
    window.addEventListener('sg-cookie-settings', reopen);
    return () => window.removeEventListener('sg-cookie-settings', reopen);
  }, []);

  if (!GA_ID) return null;

  const decide = v => {
    save(v); setChoice(v); setOpen(false);
    if (typeof window.gtag === 'function') window.gtag('consent', 'update', { analytics_storage: v, ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    if (v === 'denied') clearGaCookies();
  };

  return (
    <>
      {choice === 'granted' && (
        <>
          <Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}</Script>
          <Script id="ga-lib" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        </>
      )}
      {open && (
        <div className="cbar" role="dialog" aria-live="polite" aria-label="Cookie preferences">
          <p>We use analytics cookies to understand how visitors use this site and improve it. No advertising cookies. See our <a href="/privacy-policy">Privacy Policy</a>.</p>
          <div className="cbar-btns">
            <button type="button" className="btn s sm" onClick={() => decide('denied')}>Reject</button>
            <button type="button" className="btn p sm" onClick={() => decide('granted')}>Accept</button>
          </div>
        </div>
      )}
    </>
  );
}

// Footer link that reopens the banner
export function CookieSettingsLink() {
  if (!GA_ID) return null;
  return <button type="button" className="cookie-link" onClick={() => window.dispatchEvent(new Event('sg-cookie-settings'))}>Cookie settings</button>;
}
