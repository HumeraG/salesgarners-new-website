import { isAdmin } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
const esc = v => { if (v == null) return ''; const s = v instanceof Date ? v.toISOString() : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

export async function GET(req) {
  if (!(await isAdmin())) return new Response('Unauthorized', { status: 401 });
  const u = new URL(req.url); const type = u.searchParams.get('type'); const q = (u.searchParams.get('q') || '').trim();
  const where = []; const params = [];
  if (['CONTACT', 'PILOT', 'WHITEPAPER'].includes(type)) { where.push('type=?'); params.push(type); }
  if (q) { where.push('(email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR company LIKE ?)'); params.push(...Array(4).fill(`%${q}%`)); }
  const rows = await query(`SELECT id,created_at,type,status,first_name,last_name,email,phone,company,job_title,resource,message,source_page FROM leads ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC`, params);
  const cols = ['id', 'created_at', 'type', 'status', 'first_name', 'last_name', 'email', 'phone', 'company', 'job_title', 'resource', 'message', 'source_page'];
  const csv = [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n');
  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="salesgarners-leads-${new Date().toISOString().slice(0, 10)}.csv"` } });
}
