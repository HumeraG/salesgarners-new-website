import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE = 'sg_admin';
const MAX_AGE = 60 * 60 * 12; // 12 hours

const secret = () => {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error('SESSION_SECRET must be set (16+ characters)');
  return s;
};
const sign = payload => crypto.createHmac('sha256', secret()).update(payload).digest('base64url');

export function checkPassword(input) {
  const real = process.env.ADMIN_PASSWORD || '';
  if (!real) return false;
  const a = Buffer.from(String(input)), b = Buffer.from(real);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function createSession() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `admin.${exp}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: MAX_AGE });
}

export async function destroySession() { (await cookies()).delete(COOKIE); }

export async function isAdmin() {
  const v = (await cookies()).get(COOKIE)?.value; if (!v) return false;
  const i = v.lastIndexOf('.'); const payload = v.slice(0, i), sig = v.slice(i + 1);
  try {
    const good = sign(payload);
    if (good.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(good), Buffer.from(sig))) return false;
  } catch { return false; }
  return Number(payload.split('.')[1]) > Date.now() / 1000;
}
