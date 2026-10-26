// Small, dependency-free behaviour for the "Our Story" section.
// Used by components/client/OurStoryClient.js and copied into the Elementor HTML version.
// Everything works without JS (content visible, <details> expand natively); JS adds
// scroll reveals, gallery filtering and the video dialog.
export function initOurStory(root) {
  if (!root) return () => {};
  const off = [];
  const on = (el, ev, fn) => { el.addEventListener(ev, fn); off.push(() => el.removeEventListener(ev, fn)); };
  root.classList.add('sgos--js');

  // 1. Scroll reveals (skipped when the visitor prefers reduced motion)
  const items = root.querySelectorAll('[data-sgos-reveal]');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => io.observe(el));
    off.push(() => io.disconnect());
  }

  // 2. Gallery filter
  const tiles = root.querySelectorAll('[data-sgos-cat]');
  const status = root.querySelector('[data-sgos-status]');
  root.querySelectorAll('[data-sgos-filter]').forEach(btn => on(btn, 'click', () => {
    const cat = btn.getAttribute('data-sgos-filter');
    root.querySelectorAll('[data-sgos-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    let n = 0;
    tiles.forEach(t => { const show = cat === 'all' || t.getAttribute('data-sgos-cat') === cat; t.hidden = !show; if (show) n++; });
    if (status) status.textContent = `Showing ${n} ${n === 1 ? 'item' : 'items'}: ${btn.textContent.trim()}`;
  }));

  // 3. Video dialog (loads the embed only after a click; never autoplays with sound)
  const dlg = root.querySelector('.sgos-dialog');
  if (dlg && typeof dlg.showModal === 'function') {
    const frame = dlg.querySelector('[data-sgos-frame]');
    const empty = dlg.querySelector('[data-sgos-empty]');
    const title = dlg.querySelector('[data-sgos-dtitle]');
    let opener = null;
    const embed = url => {
      if (!url) return '';
      const ig = url.match(/instagram\.com\/(?:reel|reels|p)\/([^/?#]+)/i);
      if (ig) return `https://www.instagram.com/reel/${ig[1]}/embed`;
      const yt = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
      if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0`;
      return '';
    };
    root.querySelectorAll('[data-sgos-video]').forEach(btn => on(btn, 'click', () => {
      opener = btn;
      const src = embed(btn.getAttribute('data-sgos-video'));
      title.textContent = btn.getAttribute('data-sgos-label') || 'Video';
      frame.innerHTML = '';
      empty.hidden = !!src;
      if (src) {
        const f = document.createElement('iframe');
        f.src = src; f.title = title.textContent; f.loading = 'lazy';
        f.allow = 'encrypted-media; picture-in-picture'; f.setAttribute('allowfullscreen', '');
        frame.appendChild(f);
      }
      dlg.showModal();
    }));
    const close = () => dlg.close();
    dlg.querySelectorAll('[data-sgos-close]').forEach(b => on(b, 'click', close));
    on(dlg, 'click', e => { if (e.target === dlg) close(); });
    on(dlg, 'close', () => { frame.innerHTML = ''; if (opener) opener.focus(); });
  }

  return () => off.forEach(f => f());
}
