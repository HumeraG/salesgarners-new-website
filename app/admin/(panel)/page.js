import Link from 'next/link';
import { query } from '@/lib/db';

const fmt = d => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

async function load() {
  try {
    const [counts] = await Promise.all([query(`SELECT
      COUNT(*) total,
      SUM(type='CONTACT') contact, SUM(type='PILOT') pilot, SUM(type='WHITEPAPER') whitepaper,
      SUM(status='NEW') fresh, SUM(created_at >= NOW() - INTERVAL 7 DAY) week FROM leads`)]);
    const recent = await query('SELECT id,type,first_name,last_name,email,company,created_at FROM leads ORDER BY created_at DESC LIMIT 8');
    const [hr] = await query("SELECT (SELECT COUNT(*) FROM jobs WHERE status='OPEN') open_jobs, (SELECT COUNT(*) FROM job_applications WHERE status='NEW') new_apps");
    return { c: { ...counts[0], ...hr }, recent };
  } catch (e) { return { error: e.message }; }
}

export default async function Dashboard() {
  const { c, recent, error } = await load();
  if (error) return <><h1>Dashboard</h1><p className="muted">Could not reach the database: {error}. Check DATABASE_URL and run <code>npm run db:setup</code>.</p></>;
  const tiles = [['Total leads', c.total], ['New (not contacted)', c.fresh], ['Last 7 days', c.week], ['Contact form', c.contact], ['Pilot requests', c.pilot], ['Whitepaper downloads', c.whitepaper], ['Open jobs', c.open_jobs], ['New applications', c.new_apps]];
  return (
    <>
      <h1>Dashboard</h1>
      <div className="stats">{tiles.map(([l, v]) => <div className="stat" key={l}><b>{Number(v || 0)}</b><span>{l}</span></div>)}</div>
      <div className="toolbar" style={{ justifyContent: 'space-between' }}><h2 className="h3">Latest leads</h2><Link className="link" href="/admin/leads">All leads →</Link></div>
      <div className="tblwrap"><table className="tbl">
        <thead><tr><th>DATE</th><th>TYPE</th><th>NAME</th><th>EMAIL</th><th>COMPANY</th></tr></thead>
        <tbody>
          {recent.length === 0 && <tr><td colSpan={5} className="muted">No leads yet. Submissions from the contact, pilot and whitepaper forms will appear here.</td></tr>}
          {recent.map(l => <tr key={l.id}><td>{fmt(l.created_at)}</td><td><span className={`badge2 ${l.type}`}>{l.type}</span></td><td>{l.first_name} {l.last_name || ''}</td><td>{l.email}</td><td>{l.company || '—'}</td></tr>)}
        </tbody>
      </table></div>
    </>
  );
}
