'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '../actions';

function Btn() { const { pending } = useFormStatus(); return <button className="btn p" style={{ justifyContent: 'center' }} disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>; }

export default function LoginForm() {
  const [state, action] = useActionState(login, null);
  return (
    <form action={action}>
      <div className="logo"><img className="brand-logo" src="/brand/salesgarners-logo.svg" alt="SalesGarners" width="256" height="40" /><span className="adm-tag">Admin</span></div>
      <label htmlFor="pw" className="note">PASSWORD</label>
      <input id="pw" name="password" type="password" autoComplete="current-password" required autoFocus />
      {state?.error && <p style={{ color: '#FCA5A5', fontSize: 14 }} role="alert">{state.error}</p>}
      <Btn />
    </form>
  );
}
