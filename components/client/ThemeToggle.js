'use client';
import { useEffect, useState } from 'react';

// Light / Auto / Dark switch. Saves the choice in localStorage ("sg-theme"); default is dark.
export const THEME_KEY = 'sg-theme';
export const THEME_DEFAULT = 'dark';

const resolve = m => (m === 'auto' ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : m);

function apply(mode, animate) {
  const r = document.documentElement;
  if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    r.classList.add('theme-anim');
    clearTimeout(window.__sgThemeT);
    window.__sgThemeT = setTimeout(() => r.classList.remove('theme-anim'), 500);
  }
  r.dataset.theme = resolve(mode);
  r.dataset.mode = mode;
  window.dispatchEvent(new Event('sg-theme'));
}

const ICONS = {
  light: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  auto: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
  dark: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
};
const LABELS = { light: 'Light', auto: 'Auto', dark: 'Dark' };

export default function ThemeToggle() {
  const [mode, setMode] = useState(null);

  useEffect(() => {
    let m = THEME_DEFAULT;
    try { m = localStorage.getItem(THEME_KEY) || THEME_DEFAULT; } catch {}
    if (!LABELS[m]) m = THEME_DEFAULT;
    setMode(m); apply(m, false);
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => { if (document.documentElement.dataset.mode === 'auto') apply('auto', true); };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const pick = m => {
    setMode(m);
    try { localStorage.setItem(THEME_KEY, m); } catch {}
    apply(m, true);
  };

  return (
    <div className="ttg" role="group" aria-label="Colour theme" data-mode={mode || undefined}>
      <span className="pill2" aria-hidden="true" />
      {['light', 'auto', 'dark'].map(m => (
        <button key={m} type="button" aria-pressed={mode === m} aria-label={`${LABELS[m]} theme`} title={m === 'auto' ? 'Auto (follows your device)' : `${LABELS[m]} theme`} onClick={() => pick(m)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[m]}</svg><span>{LABELS[m]}</span>
        </button>
      ))}
    </div>
  );
}
