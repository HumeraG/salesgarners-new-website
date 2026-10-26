// Plain-text <-> HTML for job descriptions (admins type simple text, the site shows formatted content)
// Rules: blank line = new paragraph · a line ending with ":" = heading · a line starting with "-" "•" or "*" = bullet

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const isBullet = l => /^\s*[-•*]\s+/.test(l);
const looksLikeHtml = s => /^\s*<(p|h\d|ul|ol|div|br|strong|em)\b/i.test(s || '');

export function textToHtml(text) {
  if (!text) return '';
  const out = [];
  for (const block of String(text).replace(/\r\n/g, '\n').split(/\n\s*\n/)) {
    const lines = block.split('\n').map(l => l.trimEnd()).filter(l => l.trim());
    let para = [], list = [];
    const flushPara = () => { if (para.length) out.push(`<p>${para.map(esc).join('<br>')}</p>`); para = []; };
    const flushList = () => { if (list.length) out.push(`<ul>${list.map(l => `<li>${esc(l)}</li>`).join('')}</ul>`); list = []; };
    for (const l of lines) {
      if (isBullet(l)) { flushPara(); list.push(l.replace(/^\s*[-•*]\s+/, '')); }
      else if (/:\s*$/.test(l) && l.trim().length <= 80) { flushPara(); flushList(); out.push(`<h3>${esc(l.trim().replace(/:\s*$/, ''))}</h3>`); }
      else { flushList(); para.push(l.trim()); }
    }
    flushPara(); flushList();
  }
  return out.join('\n');
}

// For editing descriptions that were saved as HTML before the plain-text editor
export function htmlToText(html) {
  if (!html) return '';
  if (!looksLikeHtml(html)) return html;
  return String(html)
    .replace(/\r\n/g, '\n')
    .replace(/<h\d[^>]*>([\s\S]*?)<\/h\d>/gi, (_, t) => `\n\n${t.trim()}:\n`)
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `- ${t.trim()}\n`)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .split('\n').map(l => l.trim())
    // drop blank lines between bullets and straight after a heading, so lists stay together
    .filter((l, i, a) => {
      if (l) return true;
      const prev = a.slice(0, i).reverse().find(x => x), next = a.slice(i + 1).find(x => x);
      if (!prev || !next) return false;
      return !((isBullet(prev) && isBullet(next)) || /:$/.test(prev));
    })
    .join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// Render whatever is stored (old HTML or new plain text)
export const renderRich = s => (looksLikeHtml(s) ? s : textToHtml(s));
export const plainSummary = s => htmlToText(s).replace(/\n+/g, ' ').slice(0, 5000);
