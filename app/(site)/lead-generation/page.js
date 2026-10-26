import Difference from '@/components/Difference';
import { BtnP, BtnS, CardsGrid, Cta, Head, PageHero, Testimonials, Trusted } from '@/components/ui';

export const metadata = { title: 'Lead Generation', description: 'Sales qualified lead generation: vetted, verified leads aligned to your ICP and buying signals.' };

export default function Page() {
  return (
    <>
      <PageHero shape="funnel" chip={['ICP matched','Human verified leads']} eb="Sales Qualified Lead Generation" title={<>Fuel Your Pipeline with Targeted Leads That <span className="gt">Actually Convert</span></>} lead="We help you connect with the right buyers at the right time – no noise, no guesswork. Our leads are vetted, verified, and aligned to your ICP and buying signals. You get pipeline ready prospects that engage and convert faster. Less chasing, more closing.">
        <BtnP>Book a Demo</BtnP><BtnS href="/contact-us">Talk to an Expert</BtnS>
      </PageHero>
      <Trusted />
      <section className="sec alt"><div className="wrap">
        <Head eb="Why our lead gen drives results that actually close" title="Built for Pipeline. Tuned for Revenue" />
        <Head eb="What you get" title="Leads That Convert, Not Just Click" />
        <CardsGrid cols={2} icons={['file', 'layers', 'check', 'badge']} items={[
          ['Content Syndication', 'Turn high-quality content into high-intent leads. We place your content in front of in market buyers actively researching solutions like yours. Build awareness, generate top funnel demand, and drive consistent lead flow minus the guesswork.'],
          ['Full-Funnel Nurtured Leads', 'Leads that don’t just enter your funnel they move through it. We track lead journey signals across touchpoints, sending you warm, sales-ready prospects based on where they are in their decision process so you can engage with context and convert faster.'],
          ['BANT-Qualified Leads', 'Mid-to-bottom funnel leads, already vetted. Each lead is validated across Budget, Authority, Need, and Timeline to ensure they’re serious. Get precise sales intel and reduce cycles with ready to close buyers in hand.'],
          ['Highly Qualified Leads (HQL)', 'Verified leads that actually fit your ICP. We filter using firmographic and demographic signals, validate interest with intent data, and send only those who’ve shown real buying signals. No noise just clarity and conversions.'],
        ]} />
      </div></section>
      <Difference />
      <Testimonials />
      <Cta />
    </>
  );
}
