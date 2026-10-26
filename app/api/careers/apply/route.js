import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { PRIVATE_DIRS, removeUpload, saveUpload, UploadError } from '@/lib/uploads';

export const dynamic = 'force-dynamic';
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const clean = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
const hits = new Map();

export async function POST(req) {
  let fd;
  try { fd = await req.formData(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (fd.get('website')) return NextResponse.json({ ok: true });

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || null;
  if (ip) { const now = Date.now(); const l = (hits.get(ip) || []).filter(t => now - t < 3600e3); l.push(now); hits.set(ip, l); if (l.length > 5) return NextResponse.json({ error: 'Too many applications from this connection. Please try again later.' }, { status: 429 }); }

  const fullName = clean(fd.get('fullName'), 191), email = clean(fd.get('email'), 191);
  if (!fullName) return NextResponse.json({ error: 'Enter your full name.' }, { status: 400 });
  if (!email || !isEmail(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'Applications are not connected to the database yet.' }, { status: 503 });

  let jobId = Number(fd.get('jobId')) || null;
  if (jobId) { const j = await query("SELECT id FROM jobs WHERE id=? AND status='OPEN'", [jobId]); if (!j.length) return NextResponse.json({ error: 'This role is no longer open.' }, { status: 410 }); }

  let file;
  try { file = await saveUpload(fd.get('resume'), { dir: PRIVATE_DIRS.resumes, exts: ['pdf', 'doc', 'docx'], maxMB: 5 }); }
  catch (e) { return NextResponse.json({ error: e instanceof UploadError ? e.message : 'Could not save your resume.' }, { status: 400 }); }
  if (!file) return NextResponse.json({ error: 'Attach your resume.' }, { status: 400 });

  try {
    await query('INSERT INTO job_applications (job_id, full_name, email, phone, linkedin, cover_note, resume_file, resume_original, ip_address) VALUES (?,?,?,?,?,?,?,?,?)',
      [jobId, fullName, email, clean(fd.get('phone'), 40), clean(fd.get('linkedin'), 255), clean(fd.get('coverNote'), 1500), file.stored, file.original, ip]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    await removeUpload(PRIVATE_DIRS.resumes, file.stored);
    console.error('[apply]', e.message);
    return NextResponse.json({ error: 'We could not save your application. Please try again.' }, { status: 500 });
  }
}
