import Link from 'next/link';
import { query } from '@/lib/db';
import { deleteJob, toggleJob } from '../../actions';
import DeleteButton from '../../DeleteButton';

const T = { FULL_TIME: 'Full-time', PART_TIME: 'Part-time', INTERNSHIP: 'Internship', CONTRACT: 'Contract' };

export default async function Jobs() {
  let rows = [], error = null;
  try { rows = await query('SELECT j.*, (SELECT COUNT(*) FROM job_applications a WHERE a.job_id=j.id) apps FROM jobs j ORDER BY j.status, j.sort_order, j.created_at DESC'); } catch (e) { error = e.message; }
  return (
    <>
      <div className="toolbar" style={{ justifyContent: 'space-between' }}><div><h1 style={{ margin: 0 }}>Job vacancies</h1><p className="muted" style={{ marginTop: 6 }}>Roles you post here appear on /careers. See who applied under Job applications.</p></div><Link className="btn p sm" href="/admin/jobs/new">Add vacancy</Link></div>
      {error && <p className="muted">Database error: {error}</p>}
      <div className="tblwrap"><table className="tbl">
        <thead><tr><th>ROLE</th><th>DETAILS</th><th>APPLICATIONS</th><th>STATUS</th><th /></tr></thead>
        <tbody>
          {rows.length === 0 && !error && <tr><td colSpan={5} className="muted">No vacancies yet. Click “Add vacancy” to post your first role.</td></tr>}
          {rows.map(j => (
            <tr key={j.id}>
              <td><b>{j.title}</b><br /><span className="note">/careers/{j.slug}</span></td>
              <td>{j.department || '—'} · {j.location || 'Pune'}<br /><span className="muted">{T[j.job_type]} · {j.work_mode.toLowerCase()}</span></td>
              <td><Link className="link" href={`/admin/applications?job=${j.id}`}>{Number(j.apps)}</Link></td>
              <td>
                <form action={toggleJob} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="hidden" name="id" value={j.id} />
                  {j.status === 'OPEN' ? <span className="badge2 PILOT">OPEN</span> : <span className="badge2">CLOSED</span>}
                  <button className="copy" type="submit">{j.status === 'OPEN' ? 'Close' : 'Reopen'}</button>
                </form>
              </td>
              <td><div className="acts"><Link className="link" href={`/admin/jobs/${j.id}`}>Edit</Link><DeleteButton action={deleteJob} id={j.id} name={j.title} /></div></td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </>
  );
}
