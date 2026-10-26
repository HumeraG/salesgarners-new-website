import LeadForm from '@/components/client/LeadForm';
import { ChatDemo, ScrollToButton } from '@/components/client/Widgets';
import { CardsGrid, Head, Testimonials } from '@/components/ui';

export const metadata = { title: 'Free Content Syndication Pilot', description: 'Launch a complimentary Content Syndication pilot with SalesGarners. 100 verified B2B leads, 10-day campaign.' };

const REVIEWS = [
  ['Campaign Director', 'B2B Media Agency — USA', 'SalesGarners helped us exceed client KPIs within the first month. The lead quality and turnaround were exceptional.'],
  ['Head of Client Delivery', 'Global Marketing Agency — UK', "Their targeting precision and transparent reporting made our decision easy. We've scaled 3X since our pilot."],
  ['Marketing Lead', 'B2B Technology Company', 'The combination of verified data and engagement insights gives our team much better context for follow-up.'],
  ['Director of Demand Generation', 'Enterprise Software Company', 'The pilot gave us a clear view of lead quality, campaign performance, and the value of targeted B2B engagement.'],
];

export default function Page() {
  return (
    <>
      <section className="phero" style={{ paddingBottom: 80 }}><div className="glow a" /><div className="glow b" /><div className="wrap split" style={{ alignItems: 'start' }}>
        <div className="in" style={{ maxWidth: 'none' }}>
          <span className="eyebrow fadeup">Free Content Syndication Pilot</span>
          <h1 className="fadeup">Unlock <span className="gt">FREE</span> Content Syndication Leads</h1>
          <p className="lead fadeup" style={{ animationDelay: '.1s' }}>Launch a complimentary Content Syndication pilot with SalesGarners and experience targeted B2B lead generation without the initial investment.</p>
          <div className="chips fadeup" style={{ animationDelay: '.2s' }}>{['Targeted B2B Audience', 'Content Syndication', 'High-Intent Lead Generation', 'Drive Measurable Pipeline'].map(t => <span className="chip" key={t}><span className="v">✓</span>{t}</span>)}</div>
          <div className="g3 fadeup" style={{ animationDelay: '.3s', gap: 12 }}>{[['$$$', 'Campaign Value'], ['100%', 'Free Pilot'], ['B2B', 'Targeted Audience']].map(([a, b]) => <div className="met" key={b}><b className="gt">{a}</b><span>{b}</span></div>)}</div>
        </div>
        <div className="fadeup" style={{ animationDelay: '.2s' }} id="pilot-form">
          <div className="card" style={{ padding: 32 }}>
            <LeadForm id="pilot" type="PILOT" rows={[['firstName', 'lastName'], ['email'], ['company'], ['jobTitle', 'phone']]} required={['firstName', 'lastName', 'email', 'company']}
              labels={{ firstName: 'First name', lastName: 'Last name', email: 'Email', phone: 'Phone No.' }}
              successTitle="Pilot request received" successText="A strategist will reach out to set up your pilot." resetLabel="Submit another" />
          </div>
        </div>
      </div></section>

      <section className="sec alt"><div className="wrap">
        <Head title="What You'll Get" lead="Get the tools, data, expertise, and campaign support you need to make your Content Syndication pilot successful." />
        <CardsGrid cols={3} icons={['database', 'trending', 'globe', 'shield', 'users', 'badge']} items={[['115M+ Exclusive Contacts', 'Access to first-party B2B contacts for precision targeting.'], ['1.5M+ Leads Delivered', 'Proven track record of successful global campaigns.'], ['Global Coverage', 'NA, EMEA, LATAM, APAC and ANZ regions covered.'], ['100% Compliance', 'Lead replacement guarantee with full compliance.'], ['Dedicated Strategist', 'Full campaign support from experienced strategists.'], ['ISO 9001:2015 Certified', 'Trusted quality management standards.']]} />
      </div></section>

      <section className="sec"><div className="wrap">
        <Head title="Pilot Campaign Highlights" />
        <CardsGrid cols={4} items={[['$$$ Campaign Credit', 'No cost, no commitment'], ['100 Verified B2B Leads', 'Minimum guarantee'], ['10-Day Campaign', 'Fast turnaround with results'], ['Full Transparency', 'Complete post-campaign report']]} />
        <p style={{ textAlign: 'center', marginTop: 28 }} data-r=""><span className="chip" style={{ borderColor: '#FBBF24', color: 'var(--warn-ink)' }}>Limited slots available this quarter</span></p>
      </div></section>

      <section className="sec alt"><div className="wrap">
        <Head title="Who Should Join?" lead="This pilot is designed for B2B organizations looking to test and strengthen their content syndication and lead generation efforts." />
        <CardsGrid cols={3} icons={['layers', 'zap', 'globe', 'shield', 'users', 'trending']} items={[['B2B SaaS Companies', 'Reach relevant decision-makers and build a stronger pipeline for your software solutions.'], ['Technology Companies', 'Promote your technology solutions to targeted B2B audiences.'], ['IT & Cloud Providers', 'Generate relevant prospects for your IT, cloud, infrastructure, and managed services.'], ['Cybersecurity Companies', 'Connect your security content with professionals actively evaluating solutions.'], ['B2B Marketing Teams', 'Expand content reach and support your demand generation strategy.'], ['Growing Businesses', 'Test a scalable approach to B2B lead generation before expanding your campaign.']]} />
        <div className="stack center" style={{ marginTop: 48 }} data-r=""><h3 className="h3" style={{ fontSize: 26 }}>Ready to put your content in front of the right audience?</h3><p className="lead">Start with the complimentary pilot and see what targeted Content Syndication can do for your pipeline.</p></div>
      </div></section>

      <section className="sec"><div className="wrap split">
        <div className="stack" data-r="">
          <span className="eyebrow">Powered by X-Engage</span>
          <h2 className="h2">Turn Content Into Conversations.</h2>
          <p className="lead">X-Engage tracks and analyzes content interactions in real time, helping you identify, prioritize, and convert high-intent buyers.</p>
          <div className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}><b className="gt" style={{ font: '800 56px/1 var(--display)' }}><span data-count="94">94</span>%</b><div><b>Engagement Signal</b><p style={{ fontSize: 14 }}>Content Engagement Insights</p></div></div>
        </div>
        <div className="stack">
          <h3 className="h3" data-r="">Know Who Is Engaging — And Why It Matters</h3>
          <p style={{ color: 'var(--muted)' }} data-r="">Go beyond simple content downloads. X-Engage gives your team deeper visibility into how prospects interact with your content, helping you recognize buying signals and focus on the right opportunities.</p>
          <div className="g2" style={{ gap: 14 }}>{[['Real-Time Engagement', 'Track content interactions and engagement activity as it happens.'], ['Lead Scoring', 'Identify high-intent prospects using meaningful engagement signals.'], ['AI-Powered Interaction', 'Use AI-driven insights to understand prospect behavior and intent.'], ['Sales Context', 'Give sales teams the context they need for smarter follow-ups.']].map(([a, b]) => <div className="card" style={{ padding: 20, gap: 8 }} data-r="" key={a}><b style={{ fontFamily: 'var(--display)' }}>{a}</b><p style={{ fontSize: 14 }}>{b}</p></div>)}</div>
          <p className="note" data-r="">From engagement to opportunity: turn content interactions into actionable buyer intelligence for your sales and marketing teams.</p>
        </div>
      </div></section>

      <section className="sec alt"><div className="wrap">
        <Head eb="AI-powered content interaction" title="Make Every Content Interaction Count." lead="Turn passive content consumption into meaningful conversations with AI-powered engagement, qualification, and buyer insights." />
        <div className="split" style={{ alignItems: 'start' }}>
          <ChatDemo />
          <div className="stack">{[['Conversational In-Content AI', 'Give prospects the ability to interact with your content through intelligent, conversational experiences that help uncover their interests and needs.'], ['AI as a Signal Generator', 'Capture meaningful engagement signals from content interactions and identify prospects showing stronger buying intent.'], ['AI-Led Qualification', 'Help marketing and sales teams understand which prospects are more relevant and ready for meaningful follow-up.'], ['Built-In Consent & Governance', 'Support responsible engagement with consent-focused workflows and governance built into the content interaction experience.']].map(([a, b], i) => <div className="card" style={{ flexDirection: 'row', gap: 18, padding: 22 }} data-r="" key={a}><span className="num">0{i + 1}</span><div className="stack" style={{ gap: 6 }}><b style={{ fontFamily: 'var(--display)', fontSize: 18 }}>{a}</b><p style={{ fontSize: 14.5 }}>{b}</p></div></div>)}</div>
        </div>
        <div className="g2" style={{ marginTop: 56 }}>
          <div className="card" data-r=""><span className="eyebrow">Why it matters</span><h3 className="h3" style={{ fontSize: 28 }}>Go Beyond the Download.</h3><p>Traditional content syndication often stops at the download. AI-powered interaction helps you understand what happens next — and turns engagement into real opportunities.</p><div className="chips">{['Understand buyer interests', 'Identify stronger engagement signals', 'Improve lead qualification', 'Give sales better follow-up context'].map(t => <span className="chip" key={t}><span className="v">✓</span>{t}</span>)}</div></div>
          <div className="card" data-r=""><span className="eyebrow">Where teams use it</span><h3 className="h3" style={{ fontSize: 28 }}>Powering Smarter Go-To-Market Teams.</h3><p>Connect content engagement with your wider demand generation and lead generation strategy.</p><div className="chips">{['Content Syndication Campaigns', 'Demand Generation', 'ABM Campaigns', 'Sales Follow-Up'].map(t => <span className="chip" key={t}>{t}</span>)}</div></div>
        </div>
      </div></section>

      <section className="sec"><div className="wrap">
        <Head eb="Our Services" title="Everything You Need to Generate Demand." lead="From finding the right accounts to generating qualified leads, SalesGarners provides the data, targeting, and campaign expertise to support your B2B growth." />
        <div className="g3">{[['ABM', 'Account-Based Marketing', 'Reach the right accounts with focused targeting, account intelligence, and personalized B2B campaigns.'], ['CS', 'Content Syndication', 'Put your content in front of relevant B2B audiences and generate verified leads with targeted campaigns.'], ['LG', 'Lead Generation', 'Build a consistent pipeline with high-intent, verified B2B leads aligned with your ideal customer profile.'], ['EM', 'Event Marketing', 'Drive registrations and engagement for webinars, virtual events, and offline B2B events.'], ['CD', 'Contact Discovery', 'Discover relevant decision-makers and business contacts using targeted data and audience intelligence.'], ['BI', 'Data & Audience Intelligence', 'Strengthen your campaigns with accurate data, audience insights, and actionable engagement intelligence.']].map(([m, a, b]) => <article className="card" data-r="" key={m}><div className="it" style={{ font: '800 15px var(--display)' }}>{m}</div><h3 className="h3">{a}</h3><p>{b}</p></article>)}</div>
        <p className="lead" style={{ textAlign: 'center', margin: '40px auto 0' }} data-r="">One partner. Multiple growth solutions. Build stronger B2B campaigns with the right audience, the right data, and the right strategy.</p>
      </div></section>

      <Testimonials items={REVIEWS} eb="Trusted by B2B Teams" title="Results That Speak For Themselves." lead="See why marketing and demand generation teams choose SalesGarners for targeted B2B campaigns and high-quality leads." stars />

      <section className="sec"><div className="wrap">
        <Head title="Built for Quality. Designed for Results." lead="SalesGarners combines verified B2B data, precision targeting, campaign expertise, and engagement intelligence to help teams build stronger pipelines." />
        <div className="chips" style={{ justifyContent: 'center' }} data-r="">{['115M+ Contacts', '1.5M+ Leads Delivered', 'Global Coverage', '100% Compliance', 'ISO 9001:2015 Certified'].map(t => <span className="chip" key={t} style={{ fontSize: 16, padding: '12px 20px' }}><span className="v">✓</span>{t}</span>)}</div>
      </div></section>

      <section className="sec" style={{ paddingTop: 0 }}><div className="wrap"><div className="cta" data-r="">
        <i className="ring a" /><i className="ring b" />
        <span className="eyebrow" style={{ background: 'rgba(255,255,255,.15)', borderColor: 'rgba(255,255,255,.4)', color: '#fff' }}>Limited Pilot Opportunity</span>
        <h2>Ready to Start Your Free Pilot?</h2>
        <p>Experience the SalesGarners advantage with a $2,000 Content Syndication campaign at absolutely no cost and no long-term commitment.</p>
        <ScrollToButton target="pilot-form">Unlock FREE Content Syndication Leads — FILL FORM NOW</ScrollToButton>
        <p style={{ fontSize: 14 }}>Fill out the form at the top of the page to get started.</p>
      </div></div></section>
    </>
  );
}
