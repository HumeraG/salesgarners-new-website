import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { htmlToText } from '@/lib/text';
import { deleteJob, saveJob } from '../../../actions';
import DeleteButton from '../../../DeleteButton';

const TEMPLATE = `About the role:
Describe the role in two or three sentences.

What you'll do:
- Responsibility one
- Responsibility two

What we're looking for:
- Requirement one
- Requirement two`;

export default async function EditJob(props) {
  const params = await props.params;
  const isNew = params.id === 'new';
  const j = isNew ? { status: 'OPEN', job_type: 'FULL_TIME', work_mode: 'OFFICE', location: 'Pune', sort_order: 0, description: TEMPLATE } : (await query('SELECT * FROM jobs WHERE id=?', [Number(params.id)]))[0];
  if (!j) notFound();
  return (
    <>
      <Link className="link" href="/admin/jobs">← All vacancies</Link>
      <h1 style={{ marginTop: 12 }}>{isNew ? 'Add vacancy' : 'Edit vacancy'}</h1>
      <form action={saveJob} className="ef">
        <input type="hidden" name="id" value={j.id || ''} />
        <label>Job title<input type="text" name="title" defaultValue={j.title || ''} required placeholder="e.g. Demand Generation Executive" /></label>
        <label>URL slug <span className="muted" style={{ fontWeight: 500 }}>(leave empty to create from the title)</span><input type="text" name="slug" defaultValue={j.slug || ''} /></label>
        <div className="row2">
          <label>Department<input type="text" name="department" defaultValue={j.department || ''} placeholder="e.g. Marketing" /></label>
          <label>Location<input type="text" name="location" defaultValue={j.location || ''} /></label>
        </div>
        <div className="row2">
          <label>Job type<select name="job_type" defaultValue={j.job_type}><option value="FULL_TIME">Full-time</option><option value="PART_TIME">Part-time</option><option value="INTERNSHIP">Internship</option><option value="CONTRACT">Contract</option></select></label>
          <label>Work mode<select name="work_mode" defaultValue={j.work_mode}><option value="OFFICE">On-site</option><option value="HYBRID">Hybrid</option><option value="REMOTE">Remote</option></select></label>
        </div>
        <div className="row2">
          <label>Experience<input type="text" name="experience" defaultValue={j.experience || ''} placeholder="e.g. 2–4 years" /></label>
          <label>Salary <span className="muted" style={{ fontWeight: 500 }}>(optional, shown publicly)</span><input type="text" name="salary" defaultValue={j.salary || ''} placeholder="e.g. ₹6–9 LPA" /></label>
        </div>
        <label>Short summary <span className="muted" style={{ fontWeight: 500 }}>(shown on the jobs list)</span><input type="text" name="summary" defaultValue={j.summary || ''} /></label>
        <label>Full description
          <span className="muted" style={{ fontWeight: 500 }}>Type normally. Blank line = new paragraph · line ending with <b>:</b> = heading · line starting with <b>-</b> = bullet point</span>
          <textarea name="description" className="plain" defaultValue={htmlToText(j.description || '')} />
        </label>
        <div className="row2">
          <label>Status<select name="status" defaultValue={j.status}><option value="OPEN">Open (visible on /careers)</option><option value="CLOSED">Closed (hidden)</option></select></label>
          <label>Display order<input type="number" name="sort_order" defaultValue={j.sort_order ?? 0} /></label>
        </div>
        <div className="btns"><button className="btn p" type="submit">Save vacancy</button>{!isNew && j.status === 'OPEN' && <a className="btn s" href={`/careers/${j.slug}`} target="_blank" rel="noopener">View ↗</a>}</div>
      </form>
      {!isNew && <DeleteButton big action={deleteJob} id={j.id} name={j.title} label="Delete this vacancy" />}
    </>
  );
}
