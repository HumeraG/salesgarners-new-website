import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// Private files (resumes, whitepaper PDFs) live outside /public so they can't be fetched directly.
export const PRIVATE_DIRS = { resumes: 'storage/resumes', whitepapers: 'storage/whitepapers' };
export const PUBLIC_DIRS = { whitepaperCovers: 'public/uploads/whitepapers' };

const SIGNATURES = {
  pdf: [[0x25, 0x50, 0x44, 0x46]],                // %PDF
  doc: [[0xd0, 0xcf, 0x11, 0xe0]],                // OLE (old Word)
  docx: [[0x50, 0x4b, 0x03, 0x04]],               // zip
  png: [[0x89, 0x50, 0x4e, 0x47]],
  jpg: [[0xff, 0xd8, 0xff]], jpeg: [[0xff, 0xd8, 0xff]],
  webp: [[0x52, 0x49, 0x46, 0x46]],               // RIFF
};

export class UploadError extends Error {}

/**
 * Validates and saves an uploaded File (from formData) to disk.
 * Returns { stored, original } or null if no file was sent.
 */
export async function saveUpload(file, { dir, exts, maxMB }) {
  if (!file || typeof file === 'string' || !file.size) return null;
  const original = path.basename(String(file.name || 'file')).slice(0, 200);
  const ext = original.split('.').pop().toLowerCase();
  if (!exts.includes(ext)) throw new UploadError(`File type .${ext} is not allowed. Use ${exts.map(e => '.' + e).join(', ')}.`);
  if (file.size > maxMB * 1024 * 1024) throw new UploadError(`File is too large. Maximum size is ${maxMB} MB.`);
  const buf = Buffer.from(await file.arrayBuffer());
  const sigs = SIGNATURES[ext];
  if (sigs && !sigs.some(sig => sig.every((b, i) => buf[i] === b))) throw new UploadError('The file does not look like a valid ' + ext.toUpperCase() + ' file.');
  const stored = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`;
  const abs = path.join(process.cwd(), dir);
  await fs.mkdir(abs, { recursive: true });
  await fs.writeFile(path.join(abs, stored), buf);
  return { stored, original };
}

export async function removeUpload(dir, stored) {
  if (!stored) return;
  try { await fs.unlink(path.join(process.cwd(), dir, path.basename(stored))); } catch {}
}

export async function readPrivate(dir, stored) {
  const safe = path.basename(stored);
  return fs.readFile(path.join(process.cwd(), dir, safe));
}

export const MIME = { pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };

// Short-lived signed links for gated downloads
const key = () => process.env.SESSION_SECRET || 'dev-only-secret-change-me';
export function signDownload(id, minutes = 30) {
  const exp = Math.floor(Date.now() / 1000) + minutes * 60;
  const sig = crypto.createHmac('sha256', key()).update(`wp.${id}.${exp}`).digest('base64url');
  return `${exp}.${sig}`;
}
export function verifyDownload(id, token) {
  const [exp, sig] = String(token || '').split('.');
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  const good = crypto.createHmac('sha256', key()).update(`wp.${id}.${exp}`).digest('base64url');
  return good.length === sig.length && crypto.timingSafeEqual(Buffer.from(good), Buffer.from(sig));
}
