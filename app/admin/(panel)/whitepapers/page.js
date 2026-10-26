import Link from 'next/link';
import { query } from '@/lib/db';
import { deleteWhitepaper } from '../../actions';
import DeleteButton from '../../DeleteButton';

export default async function Whitepapers() {
  let rows = [], error = null;
  try { rows = await query('SELECT id,slug,title,published,sort_order,pdf_original,cover_image FROM whitepapers ORDER BY sort_order, id'); } catch (e) { error = e.message; }
  let dl = {};
  try { (await query("SELECT resource, COUNT(*) n FROM leads WHERE type='WHITEPAPER' GROUP BY resource")).forEach(r => (dl[r.resource] = Number(r.n))); } catch {}
  return (
    <>
      <div className="toolbar" style={{ justifyContent: 'space-between' }}><h1 style={{ margin: 0 }}>Whitepapers</h1><Link className="btn p sm" href="/admin/whitepapers/new">New whitepaper</Link></div>
      {error && <p className="muted">Database error: {error}</p>}
      <div className="tblwrap"><table className="tbl">
        <thead><tr><th>ORDER</th><th>TITLE</th><th>PDF</th><th>DOWNLOADS</th><th>STATUS</th><th /></tr></thead>
        <tbody>
          {rows.map(w => (
            <tr key={w.id}>
              <td>{w.sort_order}</td>
              <td><b>{w.title}</b></td>
              <td>{w.pdf_original ? <span className="note">{w.pdf_original}</span> : <span className="badge2">NO PDF YET</span>}</td>
              <td><Link className="link" href="/admin/leads?type=WHITEPAPER">{dl[w.title] || 0}</Link></td>
              <td>{w.published ? <span className="badge2 PILOT">PUBLISHED</span> : <span className="badge2">DRAFT</span>}</td>
              <td><div className="acts"><Link className="link" href={`/admin/whitepapers/${w.id}`}>Edit</Link><DeleteButton action={deleteWhitepaper} id={w.id} name={w.title} /></div></td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </>
  );
}
