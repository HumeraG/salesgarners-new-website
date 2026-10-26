import { query } from './db';

// Fallback content used when the database is not configured yet (local dev, first deploy).
const FALLBACK_BLOGS = [
  ['ai-powered-b2b-demand-generation-in-2026-how-buyer-intent-is-changing-the-game', 'AI-Powered B2B Demand Generation in 2026: How Buyer Intent Is Changing the Game', '2026-10-14'],
  ['demand-generation-how-to-build-a-pipeline-that-doesnt-depend-on-luck', "Demand Generation: How to Build a Pipeline That Doesn't Depend on Luck", null],
  ['b2b-demand-generation-strategies-to-attract-and-convert-the-right-buyers', 'B2B Demand Generation: Strategies to Attract and Convert the Right Buyers', null],
  ['demand-generation-how-b2b-companies-can-build-interest-before-the-buyer-is-ready-to-buy', 'Demand Generation: How B2B Companies Can Build Interest Before the Buyer Is Ready to Buy', null],
  ['content-syndication-how-b2b-brands-can-reach-the-right-buyers-beyond-their-own-website', 'Content Syndication: How B2B Brands Can Reach the Right Buyers Beyond Their Own Website', null],
  ['content-syndication-the-b2b-lead-generation-channel-that-scales', 'Content Syndication: The B2B Lead Generation Channel That Scales', null],
].map(([slug, title, d]) => ({ slug, title, excerpt: null, content: null, cover_image: null, published_at: d ? new Date(d) : null }));

const FALLBACK_CASES = [
  ['abm-partner', "Building Trust Through Transparency: Our ABM Partner's Success with SalesGarners and X-Engage", 'https://salesgarners.com/case-study/abm-partner/'],
  ['converting-interest-to-action', 'Converting Interest to Action: Multi-Touch MQL Campaign for SAP Combining Content, Outreach, and Conversations', 'https://salesgarners.com/case-study/converting-interest-to-action/'],
  ['empowering-our-demand-platform-partner', 'Empowering our Demand Platform Partner to Secure Enterprise Budgets with SalesGarners and X-Engage', 'https://salesgarners.com/case-study/empowering-our-demand-platform-partner-3/'],
  ['high-intent-content-syndication-at-scale', 'Driving 4,000 Qualified Leads for a Global Cybersecurity Firm: High-Intent Content Syndication at Scale', 'https://salesgarners.com/case-study/high-intent-content-syndication-at-scale/'],
].map(([slug, title, external_url]) => ({ slug, title, summary: null, content: null, cover_image: null, external_url }));

const hasDb = () => !!process.env.DATABASE_URL;

async function safe(fn, fallback) {
  if (!hasDb()) return fallback;
  try { return await fn(); } catch (e) { console.error('[db]', e.message); return fallback; }
}

export const getBlogs = () => safe(() => query('SELECT slug,title,excerpt,cover_image,published_at FROM blog_posts WHERE published=1 ORDER BY published_at DESC, id DESC'), FALLBACK_BLOGS);
export const getBlog = slug => safe(async () => (await query('SELECT * FROM blog_posts WHERE slug=? AND published=1 LIMIT 1', [slug]))[0] || null, FALLBACK_BLOGS.find(b => b.slug === slug) || null);
export const getCases = () => safe(() => query('SELECT slug,title,summary,cover_image,external_url FROM case_studies WHERE published=1 ORDER BY sort_order, id'), FALLBACK_CASES);
export const getCase = slug => safe(async () => (await query('SELECT * FROM case_studies WHERE slug=? AND published=1 LIMIT 1', [slug]))[0] || null, FALLBACK_CASES.find(c => c.slug === slug) || null);

// ---------- Careers ----------
export const JOB_TYPES = { FULL_TIME: 'Full-time', PART_TIME: 'Part-time', INTERNSHIP: 'Internship', CONTRACT: 'Contract' };
export const WORK_MODES = { OFFICE: 'On-site', HYBRID: 'Hybrid', REMOTE: 'Remote' };
// Shown when no database is configured (local dev, first deploy). Once DATABASE_URL is set, roles are managed in /admin.
const job = (slug, title, department, experience, summary, description) => ({
  id: null, slug, title, department, location: 'Pune', job_type: 'FULL_TIME', work_mode: 'OFFICE', experience, salary: null, summary, description, status: 'OPEN', created_at: new Date('2026-10-22'),
});
const FALLBACK_JOBS = [
  job('lead-generation-executive', 'Lead Generation Executive', 'Lead Generation', '6+ months',
    'Generate and qualify B2B leads for global technology campaigns.',
`About the role:
You will run lead generation campaigns for B2B technology clients, working with first-party data and intent signals to deliver qualified leads against agreed targets.

What you will do:
- Run lead generation campaigns end to end, from list building to qualified lead delivery
- Qualify leads against client criteria such as job role, company size and industry
- Follow up with prospects by email and phone to confirm interest
- Track campaign progress and report daily and weekly numbers
- Keep lead data accurate and compliant with client and privacy requirements

What we are looking for:
- 6+ months of experience in B2B lead generation or a similar role
- Clear written and spoken English
- Comfort with CRM tools and spreadsheets
- Target-driven, organised and quick to learn`),
  job('demand-generation-executive', 'Demand Generation Executive', 'Demand Generation', '1+ year',
    'Plan and run demand generation programmes that build pipeline for B2B technology brands.',
`About the role:
You will plan and run demand generation programmes for B2B technology brands, using content syndication, email and intent data to create and nurture pipeline.

What you will do:
- Plan and launch multi-channel demand generation campaigns
- Work with content syndication and intent data to reach the right buyers
- Coordinate with clients on targeting, assets and campaign goals
- Monitor performance and optimise for lead quality and volume
- Share clear campaign reports with the team and clients

What we are looking for:
- 1+ year of experience in demand generation, B2B marketing or content syndication
- Good understanding of the B2B funnel, MQLs and lead quality
- Strong communication and campaign coordination skills
- Analytical mindset, comfortable working with campaign data`),
  job('mis-executive', 'MIS Executive', 'Operations', '1+ year',
    'Build and maintain the reports and dashboards that keep campaign delivery on track.',
`About the role:
You will own the reporting that keeps our campaigns on track, turning campaign and delivery data into clear daily, weekly and monthly reports.

What you will do:
- Prepare and share daily, weekly and monthly MIS reports
- Maintain campaign trackers, dashboards and delivery records
- Check data for accuracy and fix gaps with the campaign teams
- Spot trends and flag delivery risks early
- Support management with ad hoc data requests

What we are looking for:
- 1+ year of experience in an MIS, reporting or data role
- Strong Excel or Google Sheets skills, including formulas, pivot tables and lookups
- Attention to detail and a habit of double-checking numbers
- Clear communication and good time management`),
  job('research-analyst', 'Research Analyst', 'Research', '6+ months',
    'Research target accounts and contacts to keep our B2B data accurate and campaign-ready.',
`About the role:
You will research companies and decision makers to build and verify the data behind our campaigns, supporting both lead generation and our first-party database.

What you will do:
- Research target accounts, industries and decision makers
- Build and verify contact and company data from reliable sources
- Keep records accurate, complete and up to date
- Support campaign teams with account and audience research
- Meet daily research and accuracy targets

What we are looking for:
- 6+ months of experience in B2B research, data research or a similar role
- Strong online research skills and attention to detail
- Good written English and comfort with spreadsheets
- Curious, careful and able to work to targets`),
  job('appointment-generation-executive', 'Appointment Generation Executive', 'Appointment Generation', '1+ year',
    'Set up qualified meetings between B2B decision makers and our clients.',
`About the role:
You will connect with B2B decision makers by phone and email to set up qualified meetings and conversations for our clients.

What you will do:
- Reach out to target prospects by phone and email
- Introduce client offerings and qualify interest and fit
- Schedule meetings and confirm them with prospects and clients
- Log all conversations and outcomes in the CRM
- Meet weekly appointment targets

What we are looking for:
- 1+ year of experience in appointment setting, telemarketing, inside sales or SDR work
- Confident, clear spoken English and good phone presence
- Ability to handle objections politely and professionally
- Organised, persistent and target-driven`),
];
// Sample roles show while the jobs table is empty or unreachable; as soon as real roles exist in the database (added in /admin) those replace them.
export const getOpenJobs = () => safe(async () => {
  const rows = await query("SELECT id,slug,title,department,location,job_type,work_mode,experience,salary,summary FROM jobs WHERE status='OPEN' ORDER BY sort_order, created_at DESC");
  return rows.length ? rows : FALLBACK_JOBS;
}, FALLBACK_JOBS);
export const getJob = slug => safe(async () => (await query("SELECT * FROM jobs WHERE slug=? AND status='OPEN' LIMIT 1", [slug]))[0] || FALLBACK_JOBS.find(j => j.slug === slug) || null, FALLBACK_JOBS.find(j => j.slug === slug) || null);

// ---------- Whitepapers ----------
const FALLBACK_WP = ['SMART LEAD TARGETING PLAYBOOK', 'UNLOCK 3X ROI WITH THE POWER OF INTENT-DRIVEN DEMAND GENERATION', "THE INTENT DATA BUYER'S GUIDE", 'CLIENT EXPERIENCE PLAYBOOK']
  .map((t, i) => ({ id: null, slug: `wp-${i}`, title: t, description: null, cover_image: null, has_pdf: 0 }));
export const getWhitepapers = () => safe(() => query('SELECT id,slug,title,description,cover_image,(pdf_file IS NOT NULL) AS has_pdf FROM whitepapers WHERE published=1 ORDER BY sort_order, id'), FALLBACK_WP);
