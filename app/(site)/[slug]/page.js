import { notFound, permanentRedirect } from 'next/navigation';
import { getBlog } from '@/lib/data';

// Old WordPress blog posts lived at the site root (/<post-slug>/).
// If a post with this slug exists, forward permanently to /blog/<slug>; otherwise show the 404 page.
export const dynamic = 'force-dynamic';

export default async function LegacyPost(props) {
  const params = await props.params;
  const slug = decodeURIComponent(params.slug || '').toLowerCase();
  if (!/^[a-z0-9-]{3,200}$/.test(slug)) notFound();
  const post = await getBlog(slug);
  if (post) permanentRedirect(`/blog/${slug}`);
  notFound();
}
