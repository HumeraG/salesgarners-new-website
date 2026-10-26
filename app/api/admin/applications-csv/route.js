import { isAdmin } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
const esc = v => { if (v == null) return ''; const s = v instanceof Date ? v.toISOString() : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

export async function GET(req) {
  if (!(await isAdmin())) return new Response('Unauthorized', { status: 401 });
  const u = new URL(req.url); const job = u.searchParams.get('job'); const status = u.searchParams.get('status');
  const where = [], params = [];
  if (job === 'GENERAL') where.push('a.job_id IS NULL'); else if (Number(job)) { where.push('a.job_id=?'); params.push(Number(job)); }
  if (['NEW', 'SHORTLISTED', 'INTERVIEW', 'REJECTED', 'HIRED'].includes(status)) { where.push('a.status=?'); params.push(status); }
  const rows = await query(`SELECT a.id,a.created_at,COALESCE(j.title,'General') role,a.status,a.full_name,a.email,a.phone,a.linkedin,a.cover_note,a.resume_original FROM job_applications a LEFT JOIN jobs j ON j.id=a.job_id ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY a.created_at DESC`, params);
  const cols = ['id', 'created_at', 'role', 'status', 'full_name', 'email', 'phone', 'linkedin', 'cover_note', 'resume_original'];
  const csv = [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n');
  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="salesgarners-applications-${new Date().toISOString().slice(0, 10)}.csv"` } });
}
