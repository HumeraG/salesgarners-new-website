import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { deleteCase, saveCase } from '../../../actions';
import DeleteButton from '../../../DeleteButton';

export default async function EditCase(props) {
  const params = await props.params;
  const isNew = params.id === 'new';
  const c = isNew ? { published: 1, sort_order: 0 } : (await query('SELECT * FROM case_studies WHERE id=?', [Number(params.id)]))[0];
  if (!c) notFound();
  return (
    <>
      <Link className="link" href="/admin/case-studies">← All case studies</Link>
      <h1 style={{ marginTop: 12 }}>{isNew ? 'New case study' : 'Edit case study'}</h1>
      <form action={saveCase} className="ef">
        <input type="hidden" name="id" value={c.id || ''} />
        <label>Title<input type="text" name="title" defaultValue={c.title || ''} required /></label>
        <label>URL slug<input type="text" name="slug" defaultValue={c.slug || ''} /></label>
        <label>Summary<input type="text" name="summary" defaultValue={c.summary || ''} /></label>
        <label>Cover image URL<input type="url" name="cover_image" defaultValue={c.cover_image || ''} /></label>
        <label>External link <span className="muted" style={{ fontWeight: 500 }}>(used when there is no content below)</span><input type="url" name="external_url" defaultValue={c.external_url || ''} /></label>
        <label>Sort order<input type="number" name="sort_order" defaultValue={c.sort_order ?? 0} /></label>
        <label>Content (HTML)<textarea name="content" defaultValue={c.content || ''} /></label>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}><input type="checkbox" name="published" defaultChecked={!!c.published} /> Published</label>
        <div className="btns"><button className="btn p" type="submit">Save case study</button></div>
      </form>
      {!isNew && <DeleteButton big action={deleteCase} id={c.id} name={c.title} label="Delete this case study" />}
    </>
  );
}
