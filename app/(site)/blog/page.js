import Link from 'next/link';
import { getBlogs } from '@/lib/data';
import { BtnP, Cta, PageHero } from '@/components/ui';

export const metadata = { title: 'Blogs', description: 'Insights on B2B demand generation, content syndication and buyer intent from SalesGarners.' };
export const revalidate = 300;

const GRADS = [['#6D43E7', '#2563EB'], ['#BB32C8', '#6D43E7'], ['#0EA5E9', '#6D43E7'], ['#DB2777', '#7C3AED'], ['#059669', '#2563EB'], ['#EA580C', '#BB32C8']];
const fmtDate = d => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '');

export default async function Blog() {
  const posts = await getBlogs();
  return (
    <>
      <PageHero shape="book" chip={['Resources','Latest insights']} eb="Resources" title="Blogs" lead="Ideas and playbooks on demand generation, content syndication and intent-based lead generation for B2B tech teams."><BtnP href="/pilot-campaign">Start a Free Pilot</BtnP></PageHero>
      <section className="sec" style={{ paddingTop: 20 }}><div className="wrap">
        {posts.length === 0 ? <p className="lead" style={{ textAlign: 'center', marginInline: 'auto' }}>No posts yet. Add the first one from the admin panel.</p> : (
          <div className="g3">
            {posts.map((p, i) => (
              <Link className="card blog" href={`/blog/${p.slug}`} key={p.slug} data-r="">
                <div className="bimg" style={{ '--a': GRADS[i % 6][0], '--b': GRADS[i % 6][1] }}>{p.cover_image && <img src={p.cover_image} alt={p.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}</div>
                {p.published_at && <span className="date">{fmtDate(p.published_at)}</span>}
                <h3>{p.title}</h3>
                {p.excerpt && <p>{p.excerpt}</p>}
                <span className="link" style={{ marginTop: 'auto' }}>Read More »</span>
              </Link>
            ))}
          </div>
        )}
      </div></section>
      <Cta />
    </>
  );
}
