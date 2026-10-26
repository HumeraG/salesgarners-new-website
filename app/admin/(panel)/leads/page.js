import { query } from '@/lib/db';
import { deleteLead, setLeadStatus } from '../../actions';
import DeleteButton from '../../DeleteButton';

const fmt = d => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
const TYPES = ['ALL', 'CONTACT', 'PILOT', 'WHITEPAPER'];
const STATUS = ['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'];

export default async function Leads(props) {
  const searchParams = await props.searchParams;
  const type = TYPES.includes(searchParams.type) ? searchParams.type : 'ALL';
  const q = (searchParams.q || '').trim();
  const where = []; const params = [];
  if (type !== 'ALL') { where.push('type=?'); params.push(type); }
  if (q) { where.push('(email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR company LIKE ?)'); params.push(...Array(4).fill(`%${q}%`)); }
  let rows = [], error = null;
  try { rows = await query(`SELECT * FROM leads ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC LIMIT 500`, params); }
  catch (e) { error = e.message; }

  return (
    <>
      <h1>Leads</h1>
      <form className="toolbar" method="get">
        <select name="type" defaultValue={type} aria-label="Form type">{TYPES.map(t => <option key={t}>{t}</option>)}</select>
        <input type="text" name="q" defaultValue={q} placeholder="Search name, email or company" aria-label="Search" style={{ minWidth: 260 }} />
        <button className="btn s sm" type="submit">Filter</button>
        <a className="btn p sm" href={`/api/admin/leads-csv?type=${type}&q=${encodeURIComponent(q)}`}>Export CSV</a>
        <span className="muted" style={{ marginLeft: 'auto' }}>{rows.length} shown</span>
      </form>
      {error && <p className="muted">Database error: {error}</p>}
      <div className="tblwrap"><table className="tbl">
        <thead><tr><th>DATE</th><th>TYPE</th><th>NAME</th><th>CONTACT</th><th>COMPANY / TITLE</th><th>DETAILS</th><th>STATUS</th><th /></tr></thead>
        <tbody>
          {rows.length === 0 && !error && <tr><td colSpan={8} className="muted">No leads match.</td></tr>}
          {rows.map(l => (
            <tr key={l.id}>
              <td style={{ whiteSpace: 'nowrap' }}>{fmt(l.created_at)}</td>
              <td><span className={`badge2 ${l.type}`}>{l.type}</span></td>
              <td>{l.first_name} {l.last_name || ''}</td>
              <td>{l.email}<br /><span className="muted">{l.phone || ''}</span></td>
              <td>{l.company || '—'}<br /><span className="muted">{l.job_title || ''}</span></td>
              <td style={{ maxWidth: 320 }}>{l.resource && <b>{l.resource}<br /></b>}<span className="muted">{l.message || ''}</span><br /><span className="note">{l.source_page || ''}</span></td>
              <td>
                <form action={setLeadStatus} style={{ display: 'flex', gap: 6 }}>
                  <input type="hidden" name="id" value={l.id} />
                  <select name="status" defaultValue={l.status} aria-label="Status">{STATUS.map(s => <option key={s}>{s}</option>)}</select>
                  <button className="btn s sm" type="submit">Save</button>
                </form>
              </td>
              <td><DeleteButton action={deleteLead} id={l.id} name={`the lead from ${l.email}`} /></td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </>
  );
}
