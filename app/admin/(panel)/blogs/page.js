import Link from 'next/link';
import { query } from '@/lib/db';
import { deleteBlog } from '../../actions';
import DeleteButton from '../../DeleteButton';

export default async function Blogs() {
  let rows = [], error = null;
  try { rows = await query('SELECT id,slug,title,published,published_at FROM blog_posts ORDER BY published_at DESC, id DESC'); } catch (e) { error = e.message; }
  return (
    <>
      <div className="toolbar" style={{ justifyContent: 'space-between' }}><h1 style={{ margin: 0 }}>Blog posts</h1><Link className="btn p sm" href="/admin/blogs/new">New post</Link></div>
      {error && <p className="muted">Database error: {error}</p>}
      <div className="tblwrap"><table className="tbl">
        <thead><tr><th>TITLE</th><th>DATE</th><th>STATUS</th><th /></tr></thead>
        <tbody>
          {rows.map(p => (
            <tr key={p.id}>
              <td><b>{p.title}</b><br /><span className="note">/blog/{p.slug}</span></td>
              <td style={{ whiteSpace: 'nowrap' }}>{p.published_at ? new Date(p.published_at).toLocaleDateString('en-IN') : '—'}</td>
              <td>{p.published ? <span className="badge2 PILOT">PUBLISHED</span> : <span className="badge2">DRAFT</span>}</td>
              <td><div className="acts"><Link className="link" href={`/admin/blogs/${p.id}`}>Edit</Link><DeleteButton action={deleteBlog} id={p.id} name={p.title} /></div></td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </>
  );
}
