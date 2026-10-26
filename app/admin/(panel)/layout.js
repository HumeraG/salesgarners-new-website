import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { logout } from '../actions';
import '../admin.css';

export const metadata = { title: 'Admin', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }) {
  if (!(await isAdmin())) redirect('/admin/login');
  return (
    <div className="adm">
      <aside>
        <Link className="logo" href="/admin" style={{ padding: '6px 12px 18px' }}><img className="brand-logo" src="/brand/salesgarners-logo.svg" alt="SalesGarners" width="256" height="40" /><span className="adm-tag">Admin</span></Link>
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/leads">Leads</Link>
        <Link href="/admin/blogs">Blog posts</Link>
        <Link href="/admin/case-studies">Case studies</Link>
        <Link href="/admin/whitepapers">Whitepapers</Link>
        <Link href="/admin/jobs">Job vacancies</Link>
        <Link href="/admin/applications">Job applications</Link>
        <a href="/" target="_blank" rel="noopener">View site ↗</a>
        <form action={logout} style={{ marginTop: 'auto' }}><button type="submit">Log out</button></form>
      </aside>
      <main>{children}</main>
    </div>
  );
}
