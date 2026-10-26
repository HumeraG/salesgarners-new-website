import { LINKS } from '@/lib/content';
import { BtnP, BtnS, CardsGrid, Cta, Head, PageHero, Signals, Testimonials } from '@/components/ui';

export const metadata = { title: 'X-Engage', description: 'X-Engage reveals contact level engagement so you can identify high intent prospects faster.' };

export default function Page() {
  return (
    <>
      <PageHero shape="x" chip={['X-Engage','Intent-driven engagement']} eb="X-Engage" title={<>Transform Content Engagement into <span className="gt">Intelligent Demand Generation</span></>} lead="B2B tech teams invest heavily in thought leadership content ebooks, reports, and guides but real buyer intent often remains invisible. X-Engage reveals contact level engagement, helping you identify high intent prospects faster, expand brand reach, and turn early interest into sales ready demand.">
        <BtnP>Request Your Demo</BtnP><BtnS href={LINKS.portal}>X-Engage Portal</BtnS>
      </PageHero>
      <section className="sec alt"><div className="wrap">
        <div className="split">
          <div className="stack" data-r="">
            <h2 className="h2">Meet X-Engage: Smart, Contact-Level Engagement</h2>
            <p className="lead">Go beyond clicks and opens. X-Engage captures every interaction on your shared content at an individual contact level, not just at an account level (which most tools and manual methods only cover). That means you can see who is engaging, what they’re consuming, and when they’re ready to convert.</p>
            <p className="lead">And when combined with our ABM capabilities, we’re able to bring in-market accounts into your funnel and push high intent ICP contacts straight to your sales team.</p>
          </div>
          <Signals />
        </div>
        <div style={{ marginTop: 64 }}>
          <CardsGrid cols={4} icons={['target', 'users', 'globe', 'trending']} items={[['Target Ideal Accounts', 'Target the right ICPs based on high conversion intent signals'], ['Prioritize Contact Engagement', 'Prioritize contact level engagement (not just account level surrogates)'], ['Identify In-Market Accounts', 'Identify high intent, in market accounts for your ABM team'], ['Drive Demand & Revenue', 'Turn engagement insights into revenue driving demand gen actions']]} />
        </div>
      </div></section>
      <section className="sec"><div className="wrap">
        <Head title="See the Full Picture with Granular Precision" />
        <CardsGrid cols={2} icons={['activity', 'clock']} items={[['Detailed Content Engagement Metrics', 'Move beyond opens and clicks, understand exactly how each individual contact interacts with your assets. Track granular metrics such as page views, downloads, interaction duration, and scroll depth for every piece of content.'], ['Time-Stamped Engagement Data', 'Gain insight into when your content resonates. Use precise, time stamped data points to understand the context of each engagement so your sales and marketing teams can act quickly and intelligently.']]} />
      </div></section>
      <section className="sec alt"><div className="wrap">
        <Head title="Industry First Lead-Level Insights" />
        <CardsGrid cols={2} icons={['target', 'layers']} items={[['Precision Lead Scoring', 'Unlike traditional, account level tools, X-Engage delivers true contact level intelligence. Know exactly which individuals are ready for immediate follow up, who needs nurturing, and which content will move them forward.'], ['Intelligent Lead Prioritization', 'Automatically prioritize outreach based on actual, contact level engagement. And when aggregated at the account level, X-Engage helps you uncover high intent ICP accounts and focus on the most conversion ready opportunities.']]} />
      </div></section>
      <section className="sec"><div className="wrap">
        <Head title="Unified Dashboard for Clarity and Action" />
        <CardsGrid cols={3} icons={['zap', 'grid', 'bell']} items={[['Real-Time Engagement Data', 'Gain insight into when your content resonates. Use precise, real time data points to understand the context of each engagement so your sales and marketing teams can act quickly and intelligently.'], ['Centralized Account Activity', 'See individual engagements rolled up into a unified account timeline, helping your GTM teams align strategy and outreach.'], ['Proactive Engagement Alerts', 'Receive alerts when key accounts (or specific contacts within them) engage deeply so you never miss a high intent signal.']]} />
      </div></section>
      <section className="sec alt"><div className="wrap">
        <Head title="Power Your Demand Generation with Intelligent Insights" />
        <CardsGrid cols={3} icons={['zap', 'trending', 'target']} items={[['Accelerate Sales Cycles', 'Equip sales with precise, action ready insights'], ['Optimize Marketing Spend', 'Double down on high performing content and channels'], ['Drive Higher Conversions', 'Target the right ICPs with high intent, high conversion signals']]} />
      </div></section>
      <Testimonials />
      <section className="sec"><div className="wrap split">
        <div className="stack" data-r="">
          <h2 className="h2">Integrate with the Platforms That Reveal Hidden Intent</h2>
          <p className="lead">X-Engage plugs seamlessly into platforms like Bombora, 6sense, and Factors.ai to enrich your engagement data with real account level intent signals.</p>
          <p className="lead">That means you’re not just tracking who clicked, but uncovering which in market accounts and contacts are actively researching solutions like yours.</p>
        </div>
        <div className="card" style={{ padding: 44, alignItems: 'center', gap: 22 }} data-r="">
          <div className="logo" style={{ fontSize: 24 }}><span className="mk">XE</span>X-Engage</div>
          <div style={{ width: 2, height: 40, background: 'var(--grad)' }} />
          <div className="chips" style={{ justifyContent: 'center' }}>{['Bombora', '6sense', 'Factors.ai'].map(t => <span className="chip" key={t} style={{ fontSize: 16, padding: '12px 20px' }}>{t}</span>)}</div>
        </div>
      </div></section>
      <Cta title="Smart Insights, Intelligent Results" text="Don’t just track engagement understand and leverage it. Make your demand generation smarter, faster, and more effective with X-Engage." label="Request Your Demo" />
    </>
  );
}
