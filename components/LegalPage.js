import { LegalToc } from './client/Widgets';
import { PageHero } from './ui';

export default function LegalPage({ title, sections }) {
  const toc = sections.map(([h], i) => [h, `s${i}`]).filter(([h]) => h);
  return (
    <>
      <PageHero eb="Sale Garners" title={title} center />
      <section className="sec" style={{ paddingTop: 10 }}><div className="wrap legal-wrap">
        <LegalToc items={toc} />
        <div className="legal">
          {sections.map(([h, parts], i) => (
            <div id={`s${i}`} key={i} data-r="">
              {h && <h2>{h}</h2>}
              {parts.map((p, k) => Array.isArray(p) ? <ul key={k}>{p.map(x => <li key={x}>{x}</li>)}</ul> : <p key={k}>{p}</p>)}
            </div>
          ))}
        </div>
      </div></section>
    </>
  );
}
