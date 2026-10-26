import { query } from '@/lib/db';
import { PRIVATE_DIRS, readPrivate, verifyDownload } from '@/lib/uploads';

export const dynamic = 'force-dynamic';

// Serves a whitepaper PDF only with a valid, unexpired signed token (issued after the lead form)
export async function GET(req, ctx) {
  const params = await ctx.params;
  const id = Number(params.id);
  const t = new URL(req.url).searchParams.get('t');
  if (!id || !verifyDownload(id, t)) return new Response('This download link has expired. Please fill in the form again.', { status: 403 });
  const rows = await query('SELECT slug, pdf_file FROM whitepapers WHERE id=? AND published=1', [id]);
  if (!rows.length || !rows[0].pdf_file) return new Response('Not found', { status: 404 });
  try {
    const buf = await readPrivate(PRIVATE_DIRS.whitepapers, rows[0].pdf_file);
    return new Response(buf, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${rows[0].slug}.pdf"`, 'Cache-Control': 'private, no-store' } });
  } catch { return new Response('File missing on server', { status: 404 }); }
}
