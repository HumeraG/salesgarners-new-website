# SalesGarners Website

Next.js 14 (App Router, JavaScript only) + MySQL. Redesign of salesgarners.com with the same content, a new design with animations, light and dark themes, and an admin panel.

## Requirements
- Node.js 18.18+ (20 LTS recommended)
- MySQL 8 (or MariaDB 10.6+)

## First-time setup
```bash
npm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
# edit .env.local: DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET, NEXT_PUBLIC_GA_ID
npm run db:setup                # creates the database + tables, seeds blog posts, case studies and whitepapers
npm run dev                     # http://localhost:3000
```

## Production
```bash
npm run build
npm start                       # or run behind PM2 / systemd + Nginx
```
Restart the server after changing `.env.local`, `next.config.js` or `middleware.js`. `NEXT_PUBLIC_*` values are baked in at build time, so rebuild after changing them.

## Environment variables
| Name | What it is |
|---|---|
| `DATABASE_URL` | `mysql://USER:PASSWORD@HOST:3306/salesgarners` |
| `ADMIN_PASSWORD` | Password for `/admin`. Use a strong one in production. |
| `SESSION_SECRET` | Long random string that signs the admin cookie |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID (currently `G-8SW5HPP9DT`). When set, a cookie banner appears and GA loads only after the visitor clicks Accept. Leave empty to turn analytics and the banner off. |

The marketing pages still render without a database (blog and case studies fall back to built-in content). Forms need the database to save leads.

## What's where
```
app/
  (site)/              public pages, URLs match the current site
    layout.js          header, footer, cookie banner, theme boot script, Organization structured data
    page.js            home (hero uses the Signal funnel animation)
    about/  b2b-content-syndication/  lead-generation/  event-based-lead-generation/
    outbound-sales/  data-services/  audience-overview/  x-engage/
    blog/  blog/[slug]/  case-study/  case-study/[slug]/  whitepaper/
    contact-us/  pilot-campaign/  privacy-policy/  terms-conditions/
    careers/  careers/[slug]/
    [slug]/            forwards old WordPress post URLs (/<post-slug>/) to /blog/<post-slug>
  admin/               password-protected admin (leads, blogs, case studies, whitepapers, jobs, applications)
  api/                 leads, career applications, whitepaper downloads, admin CSV exports and resume downloads
  sitemap.js           /sitemap.xml (pages + blog posts, case studies, open jobs from the DB; refreshes hourly)
  robots.js            /robots.txt (blocks /admin and /api)
  icon.svg, favicon.ico, apple-icon.png   favicons
  globals.css          design system (colours, type, components, animations); dark theme is the default
  theme.css            light theme ("Aurora") and the Light / Auto / Dark toggle styles
components/
  ui.js                shared sections (page hero, cards, stats band, client logos, testimonials, CTA…)
  Footer.js
  client/              interactive parts:
    Header             fullscreen menu + theme toggle
    ThemeToggle        Light / Auto / Dark switch (saved in the browser, default Dark)
    SignalFunnel       home hero animation with the lead ticker
    ParticleShape      inner-page hero animation (one icon shape per page)
    Consent            cookie banner + Google Analytics loader
    Newsstand, RegionMap, Carousel, LeadForm, ApplyForm, JobFilters, Widgets,
    Interactions (scroll reveals, count-ups, progress bar, card spotlight)
    Globe              previous home hero animation (not used, kept in case you want it back)
lib/
  content.js           all page copy: services, publications, team, client logos, social links, legal text…
  data.js              blog / case study / jobs / whitepaper queries with fallback content
  text.js              plain-text to HTML for job descriptions
  uploads.js           file upload checks, private storage, signed download links
  db.js                MySQL pool (mysql2)
  auth.js              admin session (signed HTTP-only cookie)
db/
  schema.sql           tables: leads, blog_posts, case_studies, jobs, job_applications, whitepapers
  setup.js             creates DB + tables and seeds content
middleware.js          redirects www.salesgarners.com to salesgarners.com
next.config.js         permanent redirects from old WordPress URLs
public/
  brand/               SalesGarners logo (light and dark-text versions) and icon
  clients/             client logos: grey <name>.png, colour versions in clients/color/
  publications/        publication brand logos for the newsstand
  team/                leadership photos (see "Team photos" below)
  og.png               1200×630 share image for LinkedIn / WhatsApp / X
```

## Themes
- Dark is the default. Visitors can switch with the Light / Auto / Dark toggle in the header; Auto follows their device setting.
- The choice is saved in the browser and applied before the page paints, so there is no flash.
- To make Auto the default for first-time visitors, change `'dark'` to `'auto'` in `THEME_DEFAULT` (`components/client/ThemeToggle.js`) and in `THEME_BOOT` (`app/(site)/layout.js`).
- The admin panel always stays dark.

## Animations
- Home hero: Signal funnel. Contacts flow from the 115M+ database through ICP fit, intent and 3X QA™ gates; a ticker of delivered leads slides in along the bottom. Gate counts and lead names are illustrative.
- Inner pages: particle shape per page (set with the `shape` prop on `PageHero`, e.g. `shape="funnel"`).
- All animations pause when off screen and show a still frame for visitors with reduced motion turned on.

## Client logos ("Trusted by" strip)
- 23 logos, listed in `CLIENTS` in `lib/content.js` as `[slug, name, colour-file-extension]`.
- Grey version shows by default; on hover the official colour logo sweeps in from left to right.
- To add one: put `public/clients/<slug>.png` (grey) and `public/clients/color/<slug>.svg` or `.png` (colour), then add a line to `CLIENTS`.

## Team photos
- Leadership is in `SG.team` in `lib/content.js` (name, role, photo file, LinkedIn, email).
- Save photos as `public/team/nayil.png`, `asma.png`, `shafin.png`, `abrar.jpeg`, then rebuild. Until a file is there, the old salesgarners.com image link is used, and that link stops working once WordPress is replaced.
- If a photo can't load, the card shows the person's initials.

## SEO
- `/sitemap.xml` and `/robots.txt` are generated automatically.
- Every page has a canonical URL on https://salesgarners.com, Open Graph / Twitter tags and the share image `public/og.png`.
- Organization structured data (name, logo, address, phone, social profiles) is in `app/(site)/layout.js`.
- Redirects: old WordPress URLs in `next.config.js` (e.g. `/demand-generation/` to `/lead-generation`, `/feed`, `/category/*`, `/tag/*`, `/wp-admin`); old root-level blog URLs forward to `/blog/<slug>` when that post exists; `www.` forwards to the bare domain.
- To keep old blog links working, add the old posts in `/admin` with the same slug as the old URL (e.g. `7-types-of-sales-leads-a-complete-guide-to-understanding-and-managing-leads`).

## Analytics and cookies
- Google Analytics 4 loads only after the visitor clicks Accept on the cookie banner (Google Consent Mode, no advertising cookies).
- Reject loads nothing and clears any `_ga` cookies. "Cookie settings" in the footer reopens the banner.

## Social links
Instagram, LinkedIn, Facebook and X are in `SOCIAL` in `lib/content.js`; the footer, the fullscreen menu and the structured data all read from there.

## Careers
- `/careers` lists open jobs from the database (filter by department and location) plus a general "send your CV" form
- `/careers/[slug]` shows the full role with an Apply form (name, email, phone, LinkedIn, cover note, resume upload)
- Resumes (PDF/DOC/DOCX, max 5 MB) are saved in `storage/resumes`, which is **not** public. Admins download them from Job applications.
- Each job page includes Google JobPosting structured data

## Whitepapers
- `/whitepaper` lists published whitepapers from the database
- Visitors fill a short form (saved as a WHITEPAPER lead) and then get a Download PDF button. The link is signed and expires after 30 minutes.
- PDFs (max 20 MB) are saved in `storage/whitepapers` (not public); cover images in `public/uploads/whitepapers`
- A whitepaper with no PDF yet still captures the lead and tells the visitor it will be emailed

## Server folders for uploads
`storage/` and `public/uploads/` are created by `npm run db:setup`. They are in `.gitignore`, so **back them up** and keep them across deploys (on EC2, keep the app folder or mount these paths to persistent storage). Hosting on Vercel would need S3 instead of local disk.

## Forms → database
| Form | Page | Lead type |
|---|---|---|
| Contact | /contact-us | CONTACT |
| Free pilot | /pilot-campaign | PILOT |
| Whitepaper download | /whitepaper | WHITEPAPER (stores which whitepaper) |
| Job application | /careers, /careers/[slug] | stored in job_applications |

Spam protection: hidden honeypot field + 5 submissions per IP per 10 minutes.

## Admin (`/admin`)
- Dashboard with lead counts, open jobs, new applications and latest submissions
- Job vacancies: add vacancy (title, department, location, type, work mode, experience, salary, summary, plain-text description: blank line = paragraph, line ending with ":" = heading, line starting with "-" = bullet), close/reopen, edit, delete
- Job applications: filter by role and status, update status (NEW / SHORTLISTED / INTERVIEW / REJECTED / HIRED), download resume, delete, export CSV
- Whitepapers: add/edit with PDF and cover upload, publish/unpublish, order, delete (also removes the PDF and cover); shows download count
- Leads: filter by type, search, change status (NEW / CONTACTED / QUALIFIED / CLOSED), delete, export CSV
- Blog posts and case studies: create, edit (HTML content), publish/unpublish, delete. Case studies can link to an external URL instead of having their own page.
- Every list has a Delete button on each row, and every delete asks for confirmation first.

## Publication logos
The newsstand covers use the official logos from each Brand-Kit (`public/publications/*`) and the brand colours set in `lib/content.js`.

## Still to do before launch
- Content: write the blog post bodies and case studies in `/admin` (case studies still link to old WordPress pages), and upload the whitepaper PDFs
- Team photos into `public/team/`, and Asma's LinkedIn URL in `SG.team`
- Email alerts for new leads, pilot requests and job applications (not built yet; submissions only go to the database)
- Security: strong `ADMIN_PASSWORD`, login attempt limit, Cloudflare Turnstile on forms
- Hosting: server, MySQL, environment variables, domain + SSL, backups of the database and upload folders
- Optional: match the brand guide fonts (Outfit + Inter) and Garner Violet `#7E3EE4`
- Final QA: Lighthouse, Safari / iPhone, full test of every form and admin flow on the live server
