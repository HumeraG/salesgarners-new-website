import { isAdmin } from '@/lib/auth';
import { query } from '@/lib/db';
import { MIME, PRIVATE_DIRS, readPrivate } from '@/lib/uploads';

export const dynamic = 'force-dynamic';

export async function GET(_, ctx) {
  const params = await ctx.params;
  if (!(await isAdmin())) return new Response('Unauthorized', { status: 401 });
  const r = (await query('SELECT full_name, resume_file, resume_original FROM job_applications WHERE id=?', [Number(params.id)]))[0];
  if (!r?.resume_file) return new Response('Not found', { status: 404 });
  try {
    const buf = await readPrivate(PRIVATE_DIRS.resumes, r.resume_file);
    const ext = r.resume_file.split('.').pop();
    const name = `${r.full_name.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-')}-resume.${ext}`;
    return new Response(buf, { headers: { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Content-Disposition': `attachment; filename="${name}"`, 'Cache-Control': 'private, no-store' } });
  } catch { return new Response('File missing on server', { status: 404 }); }
}
