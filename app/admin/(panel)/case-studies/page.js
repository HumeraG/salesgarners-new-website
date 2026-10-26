import Link from 'next/link';
import { query } from '@/lib/db';
import { deleteCase } from '../../actions';
import DeleteButton from '../../DeleteButton';

export default async function Cases() {
  let rows = [], error = null;
  try { rows = await query('SELECT id,slug,title,published,sort_order,external_url FROM case_studies ORDER BY sort_order, id'); } catch (e) { error = e.message; }
  return (
    <>
      <div className="toolbar" style={{ justifyContent: 'space-between' }}><h1 style={{ margin: 0 }}>Case studies</h1><Link className="btn p sm" href="/admin/case-studies/new">New case study</Link></div>
      {error && <p className="muted">Database error: {error}</p>}
      <div className="tblwrap"><table className="tbl">
        <thead><tr><th>ORDER</th><th>TITLE</th><th>LINKS TO</th><th>STATUS</th><th /></tr></thead>
        <tbody>
          {rows.map(c => (
            <tr key={c.id}>
              <td>{c.sort_order}</td>
              <td><b>{c.title}</b></td>
              <td className="note">{c.external_url || `/case-study/${c.slug}`}</td>
              <td>{c.published ? <span className="badge2 PILOT">PUBLISHED</span> : <span className="badge2">DRAFT</span>}</td>
              <td><div className="acts"><Link className="link" href={`/admin/case-studies/${c.id}`}>Edit</Link><DeleteButton action={deleteCase} id={c.id} name={c.title} /></div></td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </>
  );
}
