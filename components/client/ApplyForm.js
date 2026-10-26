'use client';
import { useRef, useState } from 'react';
import { Icon } from '../Icon';

const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const EXTS = ['pdf', 'doc', 'docx'];

export default function ApplyForm({ jobId, jobTitle }) {
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle');
  const [msg, setMsg] = useState('');
  const [fileName, setFileName] = useState('');
  const form = useRef(null);
  const id = jobId ? `job${jobId}` : 'general';

  const validate = fd => {
    const e = {};
    if (!String(fd.get('fullName') || '').trim()) e.fullName = 'Enter your full name.';
    const em = String(fd.get('email') || '').trim();
    if (!isEmail(em)) e.email = 'Enter a valid email like name@company.com.';
    const f = fd.get('resume');
    if (!f || !f.size) e.resume = 'Attach your resume (PDF, DOC or DOCX).';
    else if (!EXTS.includes(f.name.split('.').pop().toLowerCase())) e.resume = 'Resume must be a PDF, DOC or DOCX file.';
    else if (f.size > 5 * 1024 * 1024) e.resume = 'Resume must be 5 MB or smaller.';
    const li = String(fd.get('linkedin') || '').trim();
    if (li && !/^https?:\/\//i.test(li)) e.linkedin = 'Paste the full link, starting with https://';
    setErrors(e); return !Object.keys(e).length;
  };

  const submit = async ev => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    if (!validate(fd)) { ev.currentTarget.querySelector('[aria-invalid="true"]')?.focus(); return; }
    if (jobId) fd.set('jobId', jobId);
    setState('sending'); setMsg('');
    try {
      const res = await fetch('/api/careers/apply', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setState('sent'); form.current?.reset(); setFileName('');
    } catch (e) { setState('error'); setMsg(e.message); }
  };

  if (state === 'sent') return (
    <div className="ok" style={{ display: 'flex' }} role="status">
      <div className="ckbig"><Icon name="check" size={30} /></div>
      <h3 className="h3">Application received</h3>
      <p style={{ color: 'var(--muted)' }}>Thanks for applying{jobTitle ? ` for ${jobTitle}` : ''}. Our team will review it and get back to you.</p>
      <button className="btn s sm" type="button" onClick={() => setState('idle')}>Submit another</button>
    </div>
  );

  const fld = (name, label, props = {}) => (
    <div className={`fld ${errors[name] ? 'bad' : ''}`}>
      <label htmlFor={`${id}-${name}`}>{label}</label>
      {props.textarea
        ? <textarea id={`${id}-${name}`} name={name} maxLength={1500} aria-invalid={!!errors[name]} />
        : <input id={`${id}-${name}`} name={name} type={props.type || 'text'} autoComplete={props.ac} aria-invalid={!!errors[name]} onChange={() => errors[name] && setErrors(e => ({ ...e, [name]: undefined }))} />}
      <span className="err">{errors[name]}</span>
    </div>
  );

  return (
    <form className="form" ref={form} onSubmit={submit} noValidate encType="multipart/form-data">
      {fld('fullName', 'Full name *', { ac: 'name' })}
      <div className="row2">{fld('email', 'Email *', { type: 'email', ac: 'email' })}{fld('phone', 'Phone', { type: 'tel', ac: 'tel' })}</div>
      {fld('linkedin', 'LinkedIn profile', { type: 'url', ac: 'url' })}
      <div className={`fld ${errors.resume ? 'bad' : ''}`}>
        <label htmlFor={`${id}-resume`}>Resume * <span className="note">PDF, DOC or DOCX, max 5 MB</span></label>
        <label className="filepick" htmlFor={`${id}-resume`}>
          <Icon name="file" size={18} color="#B79CFF" />
          <span>{fileName || 'Choose a file'}</span>
        </label>
        <input id={`${id}-resume`} name="resume" type="file" accept=".pdf,.doc,.docx" className="sr-file" aria-invalid={!!errors.resume}
          onChange={e => { setFileName(e.target.files?.[0]?.name || ''); setErrors(x => ({ ...x, resume: undefined })); }} />
        <span className="err">{errors.resume}</span>
      </div>
      {fld('coverNote', 'Cover note', { textarea: true })}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
      {state === 'error' && <p role="alert" style={{ color: 'var(--err)', fontSize: 14 }}>{msg}</p>}
      <button className="btn p" type="submit" style={{ justifyContent: 'center' }} disabled={state === 'sending'}>{state === 'sending' ? 'Uploading…' : <>Submit application <span className="ar">→</span></>}</button>
    </form>
  );
}
