'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { saveWhitepaper } from '../../../actions';

function Save() { const { pending } = useFormStatus(); return <button className="btn p" type="submit" disabled={pending}>{pending ? 'Uploading…' : 'Save whitepaper'}</button>; }

export default function WhitepaperForm({ w }) {
  const [state, action] = useActionState(saveWhitepaper, null);
  return (
    <form action={action} className="ef">
      <input type="hidden" name="id" value={w.id || ''} />
      <label>Title<input type="text" name="title" defaultValue={w.title || ''} required /></label>
      <label>URL slug <span className="muted" style={{ fontWeight: 500 }}>(also used as the PDF file name)</span><input type="text" name="slug" defaultValue={w.slug || ''} /></label>
      <label>Short description<input type="text" name="description" defaultValue={w.description || ''} /></label>
      <label>PDF file {w.pdf_original && <span className="muted" style={{ fontWeight: 500 }}>current: {w.pdf_original} (upload a new one to replace it)</span>}
        <input type="file" name="pdf" accept="application/pdf,.pdf" /></label>
      <label>Cover image <span className="muted" style={{ fontWeight: 500 }}>(JPG, PNG or WebP, max 3 MB; optional)</span>
        {w.cover_image && <img src={w.cover_image} alt="" style={{ width: 220, borderRadius: 10 }} />}
        <input type="file" name="cover" accept="image/png,image/jpeg,image/webp" /></label>
      <div className="row2">
        <label>Display order<input type="number" name="sort_order" defaultValue={w.sort_order ?? 0} /></label>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 24 }}><input type="checkbox" name="published" defaultChecked={!!w.published} /> Published on /whitepaper</label>
      </div>
      {state?.error && <p role="alert" style={{ color: '#FCA5A5' }}>{state.error}</p>}
      <div className="btns"><Save /></div>
    </form>
  );
}
