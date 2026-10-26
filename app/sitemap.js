import { getBlogs, getCases, getOpenJobs } from '@/lib/data';

const BASE = 'https://salesgarners.com';
const PAGES = [
  ['', 1, 'weekly'], ['about', .8, 'monthly'], ['b2b-content-syndication', .9, 'monthly'], ['lead-generation', .9, 'monthly'],
  ['event-based-lead-generation', .8, 'monthly'], ['outbound-sales', .8, 'monthly'], ['data-services', .8, 'monthly'],
  ['audience-overview', .7, 'monthly'], ['publications', .7, 'monthly'], ['x-engage', .8, 'monthly'], ['pilot-campaign', .8, 'monthly'], ['contact-us', .7, 'yearly'],
  ['blog', .8, 'weekly'], ['case-study', .7, 'monthly'], ['whitepaper', .7, 'monthly'], ['careers', .6, 'weekly'],
  ['privacy-policy', .2, 'yearly'], ['terms-conditions', .2, 'yearly'],
];

// Regenerate at most once an hour so new posts/jobs appear without a rebuild
export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();
  const [blogs, cases, jobs] = await Promise.all([getBlogs(), getCases(), getOpenJobs()]);
  return [
    ...PAGES.map(([p, priority, changeFrequency]) => ({ url: `${BASE}/${p}`.replace(/\/$/, '') || BASE, lastModified: now, changeFrequency, priority })),
    ...blogs.map(b => ({ url: `${BASE}/blog/${b.slug}`, lastModified: b.published_at || now, changeFrequency: 'monthly', priority: .6 })),
    ...cases.filter(c => !c.external_url).map(c => ({ url: `${BASE}/case-study/${c.slug}`, lastModified: now, changeFrequency: 'yearly', priority: .6 })),
    ...jobs.map(j => ({ url: `${BASE}/careers/${j.slug}`, lastModified: now, changeFrequency: 'weekly', priority: .5 })),
  ];
}
