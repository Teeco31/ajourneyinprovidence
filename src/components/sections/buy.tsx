import { content } from "@/lib/content";
import { storeHref } from "@/lib/types";
import { SectionHeading } from "../section-heading";

export function Buy() {
  const stores = content.stores.filter((s) => s.url);
  const { email } = content.site.contact;

  return (
    <section id="buy" aria-labelledby="buy-title" className="bg-sky-100 py-16 md:py-24">
      <div className="container-page">
        <SectionHeading
          id="buy-title"
          label="Buy the book"
          title="Get your copy"
          intro="Copies will also be available to buy and have signed at the NAPE launch, subject to confirmation."
        />

        {stores.length > 0 ? (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((s) => (
              <li key={s.id} className="flex flex-col rounded-card bg-white p-6">
                <p className="text-xl font-semibold text-ink-900">{s.name}</p>
                <p className="mt-1 text-sm text-ink-500">{[s.note, s.format].filter(Boolean).join(" · ")}</p>
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
                  aria-label={`Buy from ${s.name} (opens in a new tab)`}
                >
                  Buy from {s.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 max-w-xl rounded-card bg-white p-6 text-base text-ink-700">
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
