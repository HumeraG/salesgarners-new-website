import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { deleteBlog, saveBlog } from '../../../actions';
import DeleteButton from '../../../DeleteButton';

export default async function EditBlog(props) {
  const params = await props.params;
  const isNew = params.id === 'new';
  const p = isNew ? { published: 1 } : (await query('SELECT * FROM blog_posts WHERE id=?', [Number(params.id)]))[0];
  if (!p) notFound();
  const date = p.published_at ? new Date(p.published_at).toISOString().slice(0, 10) : '';
  return (
    <>
      <Link className="link" href="/admin/blogs">← All posts</Link>
      <h1 style={{ marginTop: 12 }}>{isNew ? 'New post' : 'Edit post'}</h1>
      <form action={saveBlog} className="ef">
        <input type="hidden" name="id" value={p.id || ''} />
        <label>Title<input type="text" name="title" defaultValue={p.title || ''} required /></label>
        <label>URL slug <span className="muted" style={{ fontWeight: 500 }}>(leave empty to create from the title)</span><input type="text" name="slug" defaultValue={p.slug || ''} /></label>
        <label>Excerpt<input type="text" name="excerpt" defaultValue={p.excerpt || ''} /></label>
        <label>Cover image URL<input type="url" name="cover_image" defaultValue={p.cover_image || ''} placeholder="/blog/cover.webp or https://…" /></label>
        <label>Publish date<input type="date" name="published_at" defaultValue={date} /></label>
        <label>Content (HTML)<textarea name="content" defaultValue={p.content || ''} /></label>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}><input type="checkbox" name="published" defaultChecked={!!p.published} /> Published</label>
        <div className="btns"><button className="btn p" type="submit">Save post</button>{!isNew && <a className="btn s" href={`/blog/${p.slug}`} target="_blank" rel="noopener">View ↗</a>}</div>
      </form>
      {!isNew && <DeleteButton big action={deleteBlog} id={p.id} name={p.title} label="Delete this post" />}
    </>
  );
}
