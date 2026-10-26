import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Tabs } from '@/components/client/Widgets';
import { SG } from '@/lib/content';
import fs from 'fs';
import path from 'path';
import { BtnP, Cta, Head, StatBand, Trusted, initials } from '@/components/ui';
import ParticleShape from '@/components/client/ParticleShape';
import OurStory from '@/components/OurStory';

export const metadata = { title: 'About', description: 'SalesGarners helps B2B businesses grow faster by aligning sales and marketing through data driven strategies.' };

// Serve the photo from /public/team when it has been added, otherwise the old site's URL.
const teamPhoto = t => (fs.existsSync(path.join(process.cwd(), 'public', 'team', t.photo)) ? `/team/${t.photo}` : t.legacy);

export default function About() {
  return (
    <>
      <section className="phero pv"><div className="glow a" /><div className="glow b" /><div className="grid" /><div className="wrap pgrid">
        <div className="in">
          <span className="eyebrow fadeup">About SalesGarners</span>
          <h1 className="fadeup" style={{ animationDelay: '.08s' }}>Accelerating Marketing Growth <span className="gt">With Precision, Innovation, And Results</span></h1>
          <p className="lead fadeup" style={{ animationDelay: '.16s' }}>We help B2B companies generate high quality leads, engage the right audience, and drive measurable pipeline impact.</p>
          <div className="btns fadeup" style={{ animationDelay: '.24s' }}><BtnP href="/contact-us">Start Now</BtnP></div>
        </div>
        <ParticleShape shape="sg">
          <div className="pcards">{[['Precision', 'Targeting'], ['Innovation', 'Driven'], ['Results', 'That Matter']].map(([a, b]) => <span key={a}>{a} <em>{b}</em></span>)}</div>
        </ParticleShape>
      </div></section>

      <Trusted />

      <section className="sec"><div className="wrap split">
        <div className="stack" data-r="">
          <span className="eyebrow">Who we are</span>
          <h2 className="h2">Who We Are?</h2>
          <p className="lead">SalesGarners helps B2B businesses grow faster by aligning sales and marketing through data driven strategies. With services like demand generation, digital marketing, and our X-Engage platform, we turn high intent leads into real results backed by a team that blends experience with fresh ideas.</p>
        </div>
        <StatBand items={[['100', '+', 'Clients Served'], ['1.5', 'M+', 'Leads delivered']]} />
      </div></section>

      <section className="sec alt"><div className="wrap">
        <Tabs labels={['Our Vision', 'Our Mission', 'Our Expertise']}>
          <p className="lead" style={{ fontSize: 20, color: 'var(--fg)', maxWidth: 'none' }}>SalesGarners aspires to be a global leader in Sales and Marketing services, driving measurable growth for businesses across industries. We are committed to empowering our clients by enhancing their marketing &amp; sales funnels and achieving sustainable success.</p>
          <p className="lead" style={{ fontSize: 20, color: 'var(--fg)', maxWidth: 'none' }}>With a team of dedicated professionals possessing profound expertise and a deep understanding of diverse business landscapes, we design tailored solutions to address each client’s unique needs. Our passion lies in fostering longterm relationships between our clients and their audiences through impactful and seamless digital campaigns.</p>
          <div className="chips">
            {SG.services.map(s => <Link className="chip" href={`/${s.slug}`} key={s.slug}><Icon name={s.icon} size={16} color="#B79CFF" /> {s.short}</Link>)}
            <Link className="chip" href="/x-engage"><Icon name="activity" size={16} color="#B79CFF" /> X-Engage platform</Link>
          </div>
        </Tabs>
      </div></section>

      <OurStory />

      <section className="sec"><div className="wrap">
        <Head eb="Leadership" title="Our Leadership Team" />
        <div className="g4">
          {SG.team.map(t => (
            <article className="card tcard" data-r="" key={t.name}>
              <div className="ph">
                <span aria-hidden="true">{initials(t.name)}</span>
                <img src={teamPhoto(t)} alt={`${t.name}, ${t.role}`} loading="lazy" width="400" height="400" />
              </div>
              <div className="meta">
                <div><b>{t.name}</b><small>{t.role}</small></div>
                <div className="soc2">
                  {t.linkedin && <a href={t.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${t.name} on LinkedIn`}>in</a>}
                  {t.email && <a href={`mailto:${t.email}`} aria-label={`Email ${t.name}`}><Icon name="mail" size={13} /></a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div></section>

      <Cta />
    </>
  );
}
