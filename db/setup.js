// Creates the database tables and seeds blog posts + case studies.
// Usage: npm run db:setup   (reads DATABASE_URL from .env.local or .env)
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

function loadEnv() {
  for (const f of ['.env.local', '.env']) {
    const p = path.join(__dirname, '..', f);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
}

const blogs = [
  ['ai-powered-b2b-demand-generation-in-2026-how-buyer-intent-is-changing-the-game', 'AI-Powered B2B Demand Generation in 2026: How Buyer Intent Is Changing the Game', '2026-10-14'],
  ['demand-generation-how-to-build-a-pipeline-that-doesnt-depend-on-luck', "Demand Generation: How to Build a Pipeline That Doesn't Depend on Luck", null],
  ['b2b-demand-generation-strategies-to-attract-and-convert-the-right-buyers', 'B2B Demand Generation: Strategies to Attract and Convert the Right Buyers', null],
  ['demand-generation-how-b2b-companies-can-build-interest-before-the-buyer-is-ready-to-buy', 'Demand Generation: How B2B Companies Can Build Interest Before the Buyer Is Ready to Buy', null],
  ['content-syndication-how-b2b-brands-can-reach-the-right-buyers-beyond-their-own-website', 'Content Syndication: How B2B Brands Can Reach the Right Buyers Beyond Their Own Website', null],
  ['content-syndication-the-b2b-lead-generation-channel-that-scales', 'Content Syndication: The B2B Lead Generation Channel That Scales', null],
];
const cases = [
  ['abm-partner', "Building Trust Through Transparency: Our ABM Partner's Success with SalesGarners and X-Engage", 'https://salesgarners.com/case-study/abm-partner/'],
  ['converting-interest-to-action', 'Converting Interest to Action: Multi-Touch MQL Campaign for SAP Combining Content, Outreach, and Conversations', 'https://salesgarners.com/case-study/converting-interest-to-action/'],
  ['empowering-our-demand-platform-partner', 'Empowering our Demand Platform Partner to Secure Enterprise Budgets with SalesGarners and X-Engage', 'https://salesgarners.com/case-study/empowering-our-demand-platform-partner-3/'],
  ['high-intent-content-syndication-at-scale', 'Driving 4,000 Qualified Leads for a Global Cybersecurity Firm: High-Intent Content Syndication at Scale', 'https://salesgarners.com/case-study/high-intent-content-syndication-at-scale/'],
];

const whitepapers = [
  ['smart-lead-targeting-playbook', 'Smart Lead Targeting Playbook'],
  ['unlock-3x-roi-intent-driven-demand-generation', 'Unlock 3X ROI with the Power of Intent-Driven Demand Generation'],
  ['intent-data-buyers-guide', "The Intent Data Buyer's Guide"],
  ['client-experience-playbook', 'Client Experience Playbook'],
];

(async () => {
  loadEnv();
  if (!process.env.DATABASE_URL) { console.error('DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.'); process.exit(1); }
  const url = new URL(process.env.DATABASE_URL);
  const dbName = url.pathname.replace('/', '');
  const base = await mysql.createConnection({ host: url.hostname, port: url.port || 3306, user: decodeURIComponent(url.username), password: decodeURIComponent(url.password), multipleStatements: true });
  await base.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await base.end();
  const conn = await mysql.createConnection({ uri: process.env.DATABASE_URL, multipleStatements: true });
  await conn.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
  for (const [slug, title, date] of blogs) {
    await conn.query('INSERT IGNORE INTO blog_posts (slug, title, excerpt, content, published_at) VALUES (?,?,?,?,?)',
      [slug, title, null, '<p>Content to be migrated from the current WordPress post. Edit this post in /admin.</p>', date || new Date()]);
  }
  for (let i = 0; i < cases.length; i++) {
    const [slug, title, ext] = cases[i];
    await conn.query('INSERT IGNORE INTO case_studies (slug, title, external_url, sort_order) VALUES (?,?,?,?)', [slug, title, ext, i]);
  }
  for (let i = 0; i < whitepapers.length; i++) {
    const [slug, title] = whitepapers[i];
    await conn.query('INSERT IGNORE INTO whitepapers (slug, title, sort_order) VALUES (?,?,?)', [slug, title, i]);
  }
  await conn.end();
  for (const d of ['storage/resumes', 'storage/whitepapers', 'public/uploads/whitepapers']) fs.mkdirSync(path.join(__dirname, '..', d), { recursive: true });
  console.log(`Database "${dbName}" ready: tables created; blog posts, case studies and whitepapers seeded (existing rows left untouched).`);
})().catch(e => { console.error(e.message); process.exit(1); });
