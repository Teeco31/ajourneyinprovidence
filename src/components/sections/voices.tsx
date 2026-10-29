import { content } from "@/lib/content";
import { SectionHeading } from "../section-heading";

export function Voices() {
  const { endorsements, press } = content;
  if (endorsements.length === 0 && press.length === 0) return null;

  return (
    <section id="voices" aria-labelledby="voices-title" className="bg-white py-16 md:py-24">
      <div className="container-page">
        <SectionHeading id="voices-title" label="Endorsements and press" title="What people are saying" />

        {endorsements.length > 0 ? (
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {endorsements.map((e) => (
              <li key={e.name}>
                <figure className="h-full rounded-card bg-sky-100 p-6">
                  <blockquote className="text-lg font-semibold text-ink-900">{e.quote}</blockquote>
                  <figcaption className="mt-4 text-sm text-ink-700">
                    <span className="font-semibold text-ink-900">{e.name}</span>, {e.title}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : null}

        {press.length > 0 ? (
          <div className="mt-12">
            <h3 className="text-3xl text-ink-900">In the press</h3>
            <ul className="mt-4 divide-y divide-sky-200">
              {press.map((p) => (
                <li key={p.url}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex min-h-12 flex-col gap-1 py-4 hover:text-gold-700 sm:flex-row sm:items-baseline sm:justify-between">
                    <span className="font-semibold">{p.headline}</span>
                    <span className="text-sm text-ink-500">{p.outlet} · {p.date}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
