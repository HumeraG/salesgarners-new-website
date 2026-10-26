'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { checkPassword, createSession, destroySession, isAdmin } from '@/lib/auth';
import { query } from '@/lib/db';
import { PRIVATE_DIRS, PUBLIC_DIRS, removeUpload, saveUpload, UploadError } from '@/lib/uploads';

const guard = async () => { if (!(await isAdmin())) redirect('/admin/login'); };
const slugify = s => String(s).toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-').slice(0, 180);
const str = (fd, k) => { const v = fd.get(k); return typeof v === 'string' && v.trim() ? v.trim() : null; };

export async function login(_, fd) {
  if (!checkPassword(fd.get('password') || '')) return { error: 'Wrong password.' };
  await createSession(); redirect('/admin');
}
export async function logout() { await destroySession(); redirect('/admin/login'); }

export async function setLeadStatus(fd) {
  await guard();
  const status = String(fd.get('status'));
  if (!['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'].includes(status)) return;
  await query('UPDATE leads SET status=? WHERE id=?', [status, Number(fd.get('id'))]);
  revalidatePath('/admin/leads');
}
export async function deleteLead(fd) {
  await guard(); await query('DELETE FROM leads WHERE id=?', [Number(fd.get('id'))]); revalidatePath('/admin/leads');
}

export async function saveBlog(fd) {
  await guard();
  const id = Number(fd.get('id')) || null;
  const title = str(fd, 'title'); if (!title) throw new Error('Title is required');
  const slug = slugify(str(fd, 'slug') || title);
  const vals = [slug, title, str(fd, 'excerpt'), str(fd, 'content'), str(fd, 'cover_image'), fd.get('published') ? 1 : 0, str(fd, 'published_at') || new Date().toISOString().slice(0, 10)];
  if (id) await query('UPDATE blog_posts SET slug=?,title=?,excerpt=?,content=?,cover_image=?,published=?,published_at=? WHERE id=?', [...vals, id]);
  else await query('INSERT INTO blog_posts (slug,title,excerpt,content,cover_image,published,published_at) VALUES (?,?,?,?,?,?,?)', vals);
  revalidatePath('/blog'); revalidatePath(`/blog/${slug}`); redirect('/admin/blogs');
}
export async function deleteBlog(fd) {
  await guard(); await query('DELETE FROM blog_posts WHERE id=?', [Number(fd.get('id'))]); revalidatePath('/blog'); redirect('/admin/blogs');
}

export async function saveCase(fd) {
  await guard();
  const id = Number(fd.get('id')) || null;
  const title = str(fd, 'title'); if (!title) throw new Error('Title is required');
  const slug = slugify(str(fd, 'slug') || title);
  const vals = [slug, title, str(fd, 'summary'), str(fd, 'content'), str(fd, 'cover_image'), str(fd, 'external_url'), Number(fd.get('sort_order')) || 0, fd.get('published') ? 1 : 0];
  if (id) await query('UPDATE case_studies SET slug=?,title=?,summary=?,content=?,cover_image=?,external_url=?,sort_order=?,published=? WHERE id=?', [...vals, id]);
  else await query('INSERT INTO case_studies (slug,title,summary,content,cover_image,external_url,sort_order,published) VALUES (?,?,?,?,?,?,?,?)', vals);
  revalidatePath('/case-study'); revalidatePath('/'); redirect('/admin/case-studies');
}
export async function deleteCase(fd) {
  await guard(); await query('DELETE FROM case_studies WHERE id=?', [Number(fd.get('id'))]); revalidatePath('/case-study'); revalidatePath('/'); redirect('/admin/case-studies');
}

// ---------- Jobs ----------
const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'];
const WORK_MODES = ['OFFICE', 'HYBRID', 'REMOTE'];
export async function saveJob(fd) {
  await guard();
  const id = Number(fd.get('id')) || null;
  const title = str(fd, 'title'); if (!title) throw new Error('Title is required');
  const slug = slugify(str(fd, 'slug') || title);
  const jt = JOB_TYPES.includes(fd.get('job_type')) ? fd.get('job_type') : 'FULL_TIME';
  const wm = WORK_MODES.includes(fd.get('work_mode')) ? fd.get('work_mode') : 'OFFICE';
  const status = fd.get('status') === 'CLOSED' ? 'CLOSED' : 'OPEN';
  const vals = [slug, title, str(fd, 'department'), str(fd, 'location'), jt, wm, str(fd, 'experience'), str(fd, 'salary'), str(fd, 'summary'), str(fd, 'description'), status, Number(fd.get('sort_order')) || 0];
  if (id) await query('UPDATE jobs SET slug=?,title=?,department=?,location=?,job_type=?,work_mode=?,experience=?,salary=?,summary=?,description=?,status=?,sort_order=? WHERE id=?', [...vals, id]);
  else await query('INSERT INTO jobs (slug,title,department,location,job_type,work_mode,experience,salary,summary,description,status,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', vals);
  revalidatePath('/careers'); revalidatePath(`/careers/${slug}`); redirect('/admin/jobs');
}
export async function toggleJob(fd) {
  await guard();
  await query("UPDATE jobs SET status=IF(status='OPEN','CLOSED','OPEN') WHERE id=?", [Number(fd.get('id'))]);
  revalidatePath('/careers'); revalidatePath('/admin/jobs');
}
export async function deleteJob(fd) {
  await guard(); await query('DELETE FROM jobs WHERE id=?', [Number(fd.get('id'))]); revalidatePath('/careers'); redirect('/admin/jobs');
}

// ---------- Applications ----------
export async function setApplicationStatus(fd) {
  await guard();
  const s = String(fd.get('status'));
  if (!['NEW', 'SHORTLISTED', 'INTERVIEW', 'REJECTED', 'HIRED'].includes(s)) return;
  await query('UPDATE job_applications SET status=? WHERE id=?', [s, Number(fd.get('id'))]);
  revalidatePath('/admin/applications');
}
export async function deleteApplication(fd) {
  await guard();
  const id = Number(fd.get('id'));
  const r = await query('SELECT resume_file FROM job_applications WHERE id=?', [id]);
  await query('DELETE FROM job_applications WHERE id=?', [id]);
  if (r[0]) await removeUpload(PRIVATE_DIRS.resumes, r[0].resume_file);
  revalidatePath('/admin/applications');
}

// ---------- Whitepapers ----------
export async function saveWhitepaper(prev, fd) {
  await guard();
  const id = Number(fd.get('id')) || null;
  const title = str(fd, 'title'); if (!title) return { error: 'Title is required.' };
  const slug = slugify(str(fd, 'slug') || title);
  let pdf = null, cover = null;
  try {
    pdf = await saveUpload(fd.get('pdf'), { dir: PRIVATE_DIRS.whitepapers, exts: ['pdf'], maxMB: 20 });
    cover = await saveUpload(fd.get('cover'), { dir: PUBLIC_DIRS.whitepaperCovers, exts: ['jpg', 'jpeg', 'png', 'webp'], maxMB: 3 });
  } catch (e) { return { error: e instanceof UploadError ? e.message : 'Upload failed.' }; }
  const coverUrl = cover ? `/uploads/whitepapers/${cover.stored}` : null;
  const published = fd.get('published') ? 1 : 0, sort = Number(fd.get('sort_order')) || 0, desc = str(fd, 'description');
  try {
    if (id) {
      const old = (await query('SELECT pdf_file, cover_image FROM whitepapers WHERE id=?', [id]))[0] || {};
      await query(`UPDATE whitepapers SET slug=?,title=?,description=?,sort_order=?,published=?${pdf ? ',pdf_file=?,pdf_original=?' : ''}${coverUrl ? ',cover_image=?' : ''} WHERE id=?`,
        [slug, title, desc, sort, published, ...(pdf ? [pdf.stored, pdf.original] : []), ...(coverUrl ? [coverUrl] : []), id]);
      if (pdf && old.pdf_file) await removeUpload(PRIVATE_DIRS.whitepapers, old.pdf_file);
      if (coverUrl && old.cover_image?.startsWith('/uploads/whitepapers/')) await removeUpload(PUBLIC_DIRS.whitepaperCovers, old.cover_image.split('/').pop());
    } else {
      await query('INSERT INTO whitepapers (slug,title,description,sort_order,published,pdf_file,pdf_original,cover_image) VALUES (?,?,?,?,?,?,?,?)', [slug, title, desc, sort, published, pdf?.stored || null, pdf?.original || null, coverUrl]);
    }
  } catch (e) { return { error: e.code === 'ER_DUP_ENTRY' ? 'Another whitepaper already uses this URL slug.' : 'Could not save: ' + e.message }; }
  revalidatePath('/whitepaper'); redirect('/admin/whitepapers');
}
export async function deleteWhitepaper(fd) {
  await guard();
  const id = Number(fd.get('id'));
  const r = (await query('SELECT pdf_file, cover_image FROM whitepapers WHERE id=?', [id]))[0];
  await query('DELETE FROM whitepapers WHERE id=?', [id]);
  if (r) { await removeUpload(PRIVATE_DIRS.whitepapers, r.pdf_file); if (r.cover_image?.startsWith('/uploads/whitepapers/')) await removeUpload(PUBLIC_DIRS.whitepaperCovers, r.cover_image.split('/').pop()); }
  revalidatePath('/whitepaper'); redirect('/admin/whitepapers');
}
