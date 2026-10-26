import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { signDownload } from '@/lib/uploads';

const TYPES = ['CONTACT', 'PILOT', 'WHITEPAPER'];
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const clean = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);

// Simple per-IP limit: 5 submissions per 10 minutes (per server instance)
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter(t => now - t < win);
  list.push(now); hits.set(ip, list);
  return list.length > 5;
}

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }

  // honeypot filled = bot: pretend success
  if (b.website) return NextResponse.json({ ok: true });

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || null;
  if (ip && limited(ip)) return NextResponse.json({ error: 'Too many submissions. Please try again in a few minutes.' }, { status: 429 });

  const type = String(b.type || '').toUpperCase();
  const firstName = clean(b.firstName, 120);
  const email = clean(b.email, 191);
  if (!TYPES.includes(type)) return NextResponse.json({ error: 'Unknown form.' }, { status: 400 });
  if (!firstName) return NextResponse.json({ error: 'Enter your name.' }, { status: 400 });
  if (!email || !isEmail(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  if (type === 'PILOT' && !clean(b.company, 191)) return NextResponse.json({ error: 'Enter your company name.' }, { status: 400 });

  if (!process.env.DATABASE_URL) {
    console.warn('[leads] DATABASE_URL not set; lead not stored:', { type, email });
    return NextResponse.json({ error: 'The form is not connected to the database yet.' }, { status: 503 });
  }

  try {
    await query(
      `INSERT INTO leads (type, first_name, last_name, email, phone, company, job_title, message, resource, source_page, ip_address, user_agent)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [type, firstName, clean(b.lastName, 120), email, clean(b.phone, 40), clean(b.company, 191), clean(b.jobTitle, 191), clean(b.message, 2000), clean(b.resource, 191), clean(b.sourcePage, 191), ip, clean(req.headers.get('user-agent'), 255)]
    );
    let downloadUrl = null;
    const wpId = Number(b.whitepaperId) || null;
    if (type === 'WHITEPAPER' && wpId) {
      const w = await query('SELECT id FROM whitepapers WHERE id=? AND published=1 AND pdf_file IS NOT NULL', [wpId]);
      if (w.length) downloadUrl = `/api/whitepapers/${wpId}/file?t=${signDownload(wpId)}`;
    }
    return NextResponse.json({ ok: true, downloadUrl });
  } catch (e) {
    console.error('[leads]', e.message);
    return NextResponse.json({ error: 'We could not save your details. Please try again or email info@salesgarners.com.' }, { status: 500 });
  }
}
