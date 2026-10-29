import AudienceCrowd from '@/components/client/AudienceCrowd';
import { AudienceTabs } from '@/components/client/Widgets';
import { SG } from '@/lib/content';
import { BtnP, BtnS, Cta, DatabaseSection, Head, PageHero, Publications, Trusted } from '@/components/ui';

export const metadata = { title: 'Audience Overview', description: 'Exclusive first party contact database: industry coverage, company size, job role and job function breakdown.' };

export default function Page() {
  const max = Math.max(...SG.audience.industries.map(x => x[1]));
  return (
    <>
      <PageHero visual={<AudienceCrowd />} chip={['Delivered','1.5M+ leads']} eb="SalesGarners" title="Audience Overview" lead="Explore the B2B decision makers we reach, broken down by industry, job function, seniority and region."><BtnP>Book a Demo</BtnP><BtnS href="/contact-us">Talk to an Expert</BtnS></PageHero>
      <DatabaseSection standalone />
      <section className="sec alt"><div className="wrap">
        <Head title="Industry Coverage" />
        <div className="ind" data-hbars="" data-r="">
          {SG.audience.industries.map(([t, v]) => (
            <div className="hb" key={t}><span className="t">{t}</span><span className="v">{v.toFixed(2)} M</span><div className="tr"><i data-w={((v / max) * 100).toFixed(1)} /></div></div>
          ))}
        </div>
      </div></section>
      <section className="sec"><div className="wrap" style={{ maxWidth: 900 }}>
        <AudienceTabs tabs={SG.audience.tabs} />
      </div></section>
      <Publications dark />
      <Trusted title="Trusted by forward-thinking B2B marketers" text="" />
      <Cta />
    </>
  );
}
