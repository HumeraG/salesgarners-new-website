import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlog } from '@/lib/data';
import { Arrow, Cta } from '@/components/ui';

export const revalidate = 300;
const fmtDate = d => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '');

export async function generateMetadata(props) {
  const params = await props.params;
  const p = await getBlog(params.slug);
  return p ? { title: p.title, description: p.excerpt || undefined } : { title: 'Post not found' };
}

export default async function Post(props) {
  const params = await props.params;
  const p = await getBlog(params.slug);
  if (!p) notFound();
  return (
    <>
      <section className="phero"><div className="glow a" /><div className="glow b" /><div className="wrap"><div className="in">
        <Link className="link fadeup" href="/blog">← All posts</Link>
        {p.published_at && <span className="date fadeup">{fmtDate(p.published_at)}</span>}
        <h1 className="fadeup" style={{ fontSize: 'clamp(32px,4.6vw,56px)' }}>{p.title}</h1>
        {p.excerpt && <p className="lead fadeup">{p.excerpt}</p>}
      </div></div></section>
      <section className="sec" style={{ paddingTop: 0 }}><div className="wrap">
        {p.cover_image && <img src={p.cover_image} alt={p.title} style={{ borderRadius: 24, marginBottom: 40, width: '100%' }} />}
        <article className="legal prose" dangerouslySetInnerHTML={{ __html: p.content || '<p>This post is being migrated. Please check back soon.</p>' }} />
        <div style={{ maxWidth: 780, margin: '40px auto 0' }}><Link className="link" href="/blog">More posts <Arrow /></Link></div>
      </div></section>
      <Cta />
    </>
  );
}
