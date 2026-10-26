import { query } from '@/lib/db';
import { deleteApplication, setApplicationStatus } from '../../actions';
import DeleteButton from '../../DeleteButton';

const fmt = d => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
const STATUS = ['NEW', 'SHORTLISTED', 'INTERVIEW', 'REJECTED', 'HIRED'];

export default async function Applications(props) {
  const searchParams = await props.searchParams;
  const job = searchParams.job || 'ALL';
  const status = STATUS.includes(searchParams.status) ? searchParams.status : 'ALL';
  const where = [], params = [];
  if (job === 'GENERAL') where.push('a.job_id IS NULL'); else if (Number(job)) { where.push('a.job_id=?'); params.push(Number(job)); }
  if (status !== 'ALL') { where.push('a.status=?'); params.push(status); }
  let rows = [], jobs = [], error = null;
  try {
    jobs = await query('SELECT id,title,status FROM jobs ORDER BY status, title');
    rows = await query(`SELECT a.*, j.title job_title FROM job_applications a LEFT JOIN jobs j ON j.id=a.job_id ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY a.created_at DESC LIMIT 500`, params);
  } catch (e) { error = e.message; }
  const qs = new URLSearchParams({ job, status }).toString();
  return (
    <>
      <h1 style={{ marginBottom: 6 }}>Job applications</h1><p className="muted" style={{ marginBottom: 20 }}>People who applied through /careers, with their resumes.</p>
      <form className="toolbar" method="get">
        <select name="job" defaultValue={job} aria-label="Role"><option value="ALL">All roles</option><option value="GENERAL">General applications</option>{jobs.map(j => <option key={j.id} value={j.id}>{j.title}{j.status === 'CLOSED' ? ' (closed)' : ''}</option>)}</select>
        <select name="status" defaultValue={status} aria-label="Status"><option value="ALL">All statuses</option>{STATUS.map(s => <option key={s}>{s}</option>)}</select>
        <button className="btn s sm" type="submit">Filter</button>
        <a className="btn p sm" href={`/api/admin/applications-csv?${qs}`}>Export CSV</a>
        <span className="muted" style={{ marginLeft: 'auto' }}>{rows.length} shown</span>
      </form>
      {error && <p className="muted">Database error: {error}</p>}
      <div className="tblwrap"><table className="tbl">
        <thead><tr><th>DATE</th><th>ROLE</th><th>CANDIDATE</th><th>CONTACT</th><th>NOTE</th><th>RESUME</th><th>STATUS</th><th /></tr></thead>
        <tbody>
          {rows.length === 0 && !error && <tr><td colSpan={8} className="muted">No applications match.</td></tr>}
          {rows.map(a => (
            <tr key={a.id}>
              <td style={{ whiteSpace: 'nowrap' }}>{fmt(a.created_at)}</td>
              <td>{a.job_title || <span className="muted">General</span>}</td>
              <td><b>{a.full_name}</b>{a.linkedin && <><br /><a className="link" style={{ fontSize: 13 }} href={a.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></>}</td>
              <td>{a.email}<br /><span className="muted">{a.phone || ''}</span></td>
              <td style={{ maxWidth: 280 }} className="muted">{a.cover_note || '—'}</td>
              <td>{a.resume_file ? <a className="btn s sm" href={`/api/admin/resume/${a.id}`}>Download</a> : '—'}</td>
              <td>
                <form action={setApplicationStatus} style={{ display: 'flex', gap: 6 }}>
                  <input type="hidden" name="id" value={a.id} />
                  <select name="status" defaultValue={a.status} aria-label="Status">{STATUS.map(s => <option key={s}>{s}</option>)}</select>
                  <button className="btn s sm" type="submit">Save</button>
                </form>
              </td>
              <td><DeleteButton action={deleteApplication} id={a.id} name={`the application from ${a.full_name}`} /></td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </>
  );
}
