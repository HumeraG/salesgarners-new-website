import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCase } from '@/lib/data';
import { Cta } from '@/components/ui';

export const revalidate = 300;

export async function generateMetadata(props) {
  const params = await props.params;
  const c = await getCase(params.slug);
  return c ? { title: c.title, description: c.summary || undefined } : { title: 'Case study not found' };
}

export default async function Page(props) {
  const params = await props.params;
  const c = await getCase(params.slug);
  if (!c) notFound();
  if (!c.content && c.external_url) redirect(c.external_url);
  return (
    <>
      <section className="phero"><div className="glow a" /><div className="glow b" /><div className="wrap"><div className="in">
        <Link className="link fadeup" href="/case-study">← All case studies</Link>
        <span className="tag fadeup">CASE STUDY</span>
        <h1 className="fadeup" style={{ fontSize: 'clamp(32px,4.6vw,56px)' }}>{c.title}</h1>
        {c.summary && <p className="lead fadeup">{c.summary}</p>}
      </div></div></section>
      <section className="sec" style={{ paddingTop: 0 }}><div className="wrap">
        <article className="legal prose" dangerouslySetInnerHTML={{ __html: c.content || '' }} />
      </div></section>
      <Cta />
    </>
  );
}
