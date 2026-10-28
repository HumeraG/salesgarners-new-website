import { SG } from '@/lib/content';
import { PUB_DETAILS, PUB_SECTIONS, PUB_DISCLAIMER } from '@/lib/publications';
import './publications.css';

export const metadata = { title: 'Publications', description: 'Six independent B2B technology publications from SalesGarners: TechMediaGlobal, MarTech360Hub, HRTech360Hub, FinTech360Hub, SalesTech360Hub and Startup360Hub.' };

// [grid-column, grid-row] for the bento tiles on desktop
const POS = { techmediaglobal: ['1 / span 2', '1 / span 2'], martech360hub: ['3 / span 2', '1'], hrtech360hub: ['3', '2'], fintech360hub: ['4', '2'], salestech360hub: ['2', '3'], startup360hub: ['3 / span 2', '3'] };
const WIDE = new Set(['techmediaglobal', 'martech360hub', 'startup360hub']);
// Homepage screenshots shown inside each tile with space around them (public/publications/screens/<slug>.webp)
const SHOTS = new Set(['techmediaglobal', 'martech360hub', 'fintech360hub', 'startup360hub']);

const Logo = ({ slug, kind, name }) => (
  <>
    <img className="pl-d" src={`/publications/${slug}-${kind}-reverse.svg`} alt={name} loading="lazy" decoding="async" />
    <img className="pl-l" src={`/publications/${slug}-${kind}-full-color.svg`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
  </>
);

export default function Page() {
  const pubs = SG.publications.map(([code, name, , url, cl, cd, slug]) => ({ code, name, url, cl, cd, slug, domain: url.replace('https://', ''), d: PUB_DETAILS[slug] }));
  return (
    <div className="pubpage">
      <header className="wrap pp-head">
        <div className="stack">
          <span className="eyebrow">Our Publications</span>
          <h1 className="h1">The whole network at a glance</h1>
        </div>
        <p className="lead">Every title in one view. Open a tile to jump to the full details below.</p>
      </header>

      <section className="wrap">
        <div className="pp-bento">
          {pubs.map(p => {
            const big = WIDE.has(p.slug); const hero = p.slug === 'techmediaglobal'; const [gc, gr] = POS[p.slug];
            return (
              <a key={p.slug} href={`#${p.slug}`} className={`pp-tile ${hero ? 'hero' : ''}${SHOTS.has(p.slug) ? ' has-shot' : ''}`} style={{ '--pcl': p.cl, '--pcd': p.cd, '--gc': gc, '--gr': gr }}>
                
                <div className="top"><span className="mk"><Logo slug={p.slug} kind="mark" name="" /></span><span className="dom">{p.domain}</span></div>
                {SHOTS.has(p.slug) && <span className="pp-frame" aria-hidden="true"><img src={`/publications/screens/${p.slug}.webp`} alt="" loading="lazy" decoding="async" /></span>}
                <div className="bot">
                  <h2>{p.name}</h2>
                  <p>{big ? p.d[1] : p.d[0]}</p>
                  {big && <div className="chips">{p.d[2].map(t => <span key={t}>{t}</span>)}</div>}
                </div>
              </a>
            );
          })}
          <div className="pp-count" style={{ '--gc': '1', '--gr': '3' }}><b>{pubs.length}</b><span>publications, one network</span></div>
        </div>
      </section>

      <section className="wrap pp-index">
        <aside>
          <span className="eyebrow">Profiles</span>
          <h2 className="h2">Meet each publication</h2>
          <p>Six independent B2B technology titles from SalesGarners. Jump to any of them.</p>
          <nav aria-label="Publications">
            {pubs.map(p => <a key={p.slug} href={`#${p.slug}`} style={{ '--pcl': p.cl, '--pcd': p.cd }}><span className="mk"><Logo slug={p.slug} kind="mark" name="" /></span>{p.name}</a>)}
          </nav>
        </aside>
        <div className="pp-list">
          {pubs.map(p => (
            <article key={p.slug} id={p.slug} style={{ '--pcl': p.cl, '--pcd': p.cd }}>
              <div className="ah">
                <span className="hl"><Logo slug={p.slug} kind="horizontal" name={p.name} /></span>
                <span className="cn"><i />Brand colour</span>
              </div>
              <h3>{p.d[0]}</h3>
              <dl>
                <dt>Focus</dt><dd>{p.d[1]}</dd>
                <dt>Readers</dt><dd>{p.d[3]}</dd>
                <dt>Covers</dt><dd className="chips">{p.d[2].map(t => <span key={t}><i />{t}</span>)}</dd>
                <dt>Sections</dt><dd className="sec-l">{PUB_SECTIONS}</dd>
              </dl>
              <div className="acts">
                <a className="v" href={p.url} target="_blank" rel="noopener noreferrer">Visit {p.domain} →</a>
                <a className="g" href="/contact-us">Get featured</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap pp-end">
        <a className="pp-feat" href="/contact-us">
          <span className="k">FOR BRANDS AND EXPERTS</span>
          <h2>Get featured across the network</h2>
          <span className="s">Press releases, guest articles and interviews. →</span>
        </a>
        <p className="pp-disc">{PUB_DISCLAIMER}</p>
      </section>
    </div>
  );
}
