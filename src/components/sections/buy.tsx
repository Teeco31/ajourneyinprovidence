import Image from "next/image";
import { content } from "@/lib/content";
import { editionSentence } from "@/lib/editions";
import { storeHref } from "@/lib/types";
import { SectionHeading } from "../section-heading";

export function Buy() {
  const stores = content.stores.filter((s) => s.url);
  const { editions } = content;
  const { email } = content.site.contact;
  const intro = [editionSentence(editions), "Copies will also be available to buy and have signed at the NAPE launch, subject to confirmation."]
    .filter(Boolean)
    .join(" ");

  return (
    <section id="buy" aria-labelledby="buy-title" className="bg-sky-100 py-16 md:py-24">
      <div className="container-page">
        <SectionHeading id="buy-title" label="Buy the book" title="Get your copy" intro={intro} />

        {editions.length > 0 ? (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {editions.map((e) => (
              <li key={e.id} className="flex items-center gap-5 rounded-card bg-white p-5">
                {e.cover ? (
                  <Image
                    src={e.cover.src}
                    alt={`${e.name} cover of ${content.site.book.title}`}
                    width={e.cover.width}
                    height={e.cover.height}
                    sizes="7rem"
                    loading="lazy"
                    className="h-auto w-24 shrink-0 shadow-raised sm:w-28"
                  />
                ) : null}
                <div>
                  <p className="font-display text-4xl text-ink-900">{e.name}</p>
                  {e.note ? <p className="mt-1 text-base text-ink-700">{e.note}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {stores.length > 0 ? (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((s) => (
              <li key={s.id} className="flex flex-col rounded-card bg-white p-6">
                {s.format ? (
                  <p className="self-start rounded-control bg-sky-200 px-3 py-1 text-sm font-semibold text-ink-900">{s.format}</p>
                ) : null}
                <p className="mt-3 text-xl font-semibold text-ink-900">{s.name}</p>
                {s.note ? <p className="mt-1 text-sm text-ink-500">{s.note}</p> : null}
                {s.priceNgn || s.priceUsd ? (
                  <p className="mt-4 text-2xl font-semibold text-ink-900 tabular">
                    {[s.priceNgn, s.priceUsd].filter(Boolean).join(" / ")}
                  </p>
                ) : null}
                <a
                  href={storeHref(s.url, s.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mt-6"
                  aria-label={`Buy the ${s.format ? s.format.toLowerCase() : "book"} from ${s.name} (opens in a new tab)`}
                >
                  Buy from {s.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 max-w-xl rounded-card bg-white p-6 text-base text-ink-700">
            Online store links will appear here as soon as the book is on sale. Join the launch to buy a signed copy in person.
          </p>
        )}

        <div className="mt-10 max-w-xl rounded-card bg-white p-6">
          <h3 className="text-2xl text-ink-900">Bulk and corporate orders</h3>
          <p className="mt-2 text-base text-ink-700">{content.site.contact.bulkOrderNote}</p>
          <a href={email ? `mailto:${email}?subject=Bulk%20order%3A%20A%20Journey%20in%20Providence` : "#contact"} className="btn btn-dark mt-4">
            Ask about bulk orders
          </a>
        </div>
      </div>
    </section>
  );
}
