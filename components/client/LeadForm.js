'use client';
import { useState } from 'react';
import { Icon } from '../Icon';

const FIELD_DEFS = {
  firstName: { label: 'First Name', autoComplete: 'given-name' },
  lastName: { label: 'Last Name', autoComplete: 'family-name' },
  fullName: { label: 'Full name', autoComplete: 'name' },
  email: { label: 'Email Address', type: 'email', autoComplete: 'email' },
  phone: { label: 'Phone Number', type: 'tel', autoComplete: 'tel' },
  company: { label: 'Company Name', autoComplete: 'organization' },
  jobTitle: { label: 'Job Title', autoComplete: 'organization-title' },
  message: { label: 'Message', textarea: true, max: 180 },
};

const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/**
 * Generic lead form that posts to /api/leads.
 * rows: array of rows, each row an array of field keys (2 keys = side by side)
 * required: field keys that must be filled
 */
export default function LeadForm({ id, type, rows, required = [], labels = {}, resource, extra = {}, submitLabel = 'Submit', successTitle = 'Message received', successText = 'Thanks, we’ll get back to you shortly.', resetLabel = 'Send another', compact = false }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [serverError, setServerError] = useState('');
  const [download, setDownload] = useState(null);

  const set = (k, v) => { setValues(s => ({ ...s, [k]: v })); setErrors(e => ({ ...e, [k]: undefined })); };

  const validate = () => {
    const e = {};
    for (const k of required) { if (!String(values[k] || '').trim()) e[k] = `Enter your ${(labels[k] || FIELD_DEFS[k].label).toLowerCase()}.`; }
    if (values.email && !isEmail(values.email.trim())) e.email = 'Enter a valid email like name@company.com.';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const submit = async ev => {
    ev.preventDefault();
    if (!validate()) { ev.currentTarget.querySelector('[aria-invalid="true"]')?.focus(); return; }
    setState('sending'); setServerError('');
    try {
      const body = { ...values, ...extra, type, resource, sourcePage: window.location.pathname, website: ev.currentTarget.website.value };
      if (body.fullName) { const [f, ...l] = body.fullName.trim().split(/\s+/); body.firstName = f; body.lastName = l.join(' ') || undefined; delete body.fullName; }
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setDownload(data.downloadUrl || null); setState('sent'); setValues({});
    } catch (err) { setState('error'); setServerError(err.message); }
  };

  if (state === 'sent') {
    return (
      <div className="ok" style={{ display: 'flex' }} role="status">
        <div className="ckbig"><Icon name="check" size={30} /></div>
        <h3 className="h3">{successTitle}</h3>
        <p style={{ color: 'var(--muted)' }}>{successText}</p>
        {download && <a className="btn p" href={download}>Download PDF <Icon name="download" size={18} /></a>}
        <button className="btn s sm" type="button" onClick={() => { setState('idle'); setDownload(null); }}>{resetLabel}</button>
      </div>
    );
  }

  const field = k => {
    const d = FIELD_DEFS[k]; const fid = `${id}-${k}`; const req = required.includes(k); const label = (labels[k] || d.label) + (req ? ' *' : '');
    return (
      <div className={`fld ${errors[k] ? 'bad' : ''}`} key={k}>
        <label htmlFor={fid}>{label}</label>
        {d.textarea
          ? <textarea id={fid} name={k} maxLength={d.max} value={values[k] || ''} onChange={e => set(k, e.target.value)} aria-invalid={!!errors[k]} />
          : <input id={fid} name={k} type={d.type || 'text'} autoComplete={d.autoComplete} value={values[k] || ''} onChange={e => set(k, e.target.value)} aria-invalid={!!errors[k]} />}
        {d.textarea && <span className="note" style={{ textAlign: 'right' }}>{(values[k] || '').length} / {d.max}</span>}
        <span className="err">{errors[k]}</span>
      </div>
    );
  };

  return (
    <form className="form" onSubmit={submit} noValidate>
      {rows.map((row, i) => row.length > 1 ? <div className="row2" key={i}>{row.map(field)}</div> : field(row[0]))}
      {/* honeypot: real users never see or fill this */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
      {state === 'error' && <p className="err" style={{ display: 'block', color: 'var(--err)' }} role="alert">{serverError}</p>}
      <button className="btn p" type="submit" style={{ justifyContent: 'center' }} disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : <>{submitLabel} <span className="ar">→</span></>}
      </button>
    </form>
  );
}
