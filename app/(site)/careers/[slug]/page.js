import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/Icon';
import ApplyForm from '@/components/client/ApplyForm';
import { getJob, JOB_TYPES, WORK_MODES } from '@/lib/data';
import { plainSummary, renderRich } from '@/lib/text';

export const revalidate = 60;

export async function generateMetadata(props) {
  const params = await props.params;
  const j = await getJob(params.slug);
  return j ? { title: `${j.title} | Careers`, description: j.summary || undefined } : { title: 'Role not found' };
}

export default async function Job(props) {
  const params = await props.params;
  const j = await getJob(params.slug);
  if (!j) notFound();
  const facts = [['pin', 'Location', j.location || 'Pune'], ['clock', 'Type', JOB_TYPES[j.job_type]], ['globe', 'Work mode', WORK_MODES[j.work_mode]], ['trending', 'Experience', j.experience], ['badge', 'Salary', j.salary]].filter(f => f[2]);
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'JobPosting', title: j.title, description: renderRich(j.description) || j.summary || j.title,
    datePosted: new Date(j.created_at).toISOString().slice(0, 10), employmentType: j.job_type,
    hiringOrganization: { '@type': 'Organization', name: 'SalesGarners Marketing Pvt. Ltd.', sameAs: 'https://salesgarners.com' },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: j.location || 'Pune', addressCountry: 'IN' } },
    ...(j.work_mode === 'REMOTE' ? { jobLocationType: 'TELECOMMUTE' } : {}),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="phero"><div className="glow a" /><div className="glow b" /><div className="wrap"><div className="in">
        <Link className="link fadeup" href="/careers">← All roles</Link>
        {j.department && <span className="eyebrow fadeup">{j.department}</span>}
        <h1 className="fadeup" style={{ fontSize: 'clamp(34px,5vw,60px)' }}>{j.title}</h1>
        {j.summary && <p className="lead fadeup">{j.summary}</p>}
        <div className="chips fadeup">{facts.map(([i, k, v]) => <span className="chip" key={k}><Icon name={i} size={15} color="#B79CFF" /> {v}</span>)}</div>
      </div></div></section>
      <section className="sec" style={{ paddingTop: 10 }}><div className="wrap job-detail">
        <article className="legal prose" dangerouslySetInnerHTML={{ __html: renderRich(j.description) || '<p>Details coming soon.</p>' }} />
        <aside className="card apply-card" id="apply">
          <h2 className="h3">Apply for this role</h2>
          <ApplyForm jobId={j.id} jobTitle={j.title} />
        </aside>
      </div></section>
    </>
  );
}
