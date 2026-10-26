import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { deleteWhitepaper } from '../../../actions';
import WhitepaperForm from './WhitepaperForm';
import DeleteButton from '../../../DeleteButton';

export default async function EditWhitepaper(props) {
  const params = await props.params;
  const isNew = params.id === 'new';
  const w = isNew ? { published: 1, sort_order: 0 } : (await query('SELECT * FROM whitepapers WHERE id=?', [Number(params.id)]))[0];
  if (!w) notFound();
  return (
    <>
      <Link className="link" href="/admin/whitepapers">← All whitepapers</Link>
      <h1 style={{ marginTop: 12 }}>{isNew ? 'New whitepaper' : 'Edit whitepaper'}</h1>
      <WhitepaperForm w={JSON.parse(JSON.stringify(w))} />
      {!isNew && <DeleteButton big action={deleteWhitepaper} id={w.id} name={w.title} label="Delete this whitepaper" />}
    </>
  );
}
