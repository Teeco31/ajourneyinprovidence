import Image from "next/image";
import { content } from "@/lib/content";
import { SectionHeading } from "../section-heading";

export function AboutBook() {
  const { book } = content.site;
  const facts = [
    { term: "Publisher", value: book.publisher },
    { term: "ISBN", value: book.isbn },
    book.formats ? { term: "Formats", value: book.formats } : null,
    book.pages ? { term: "Pages", value: book.pages } : null,
  ].filter((f): f is { term: string; value: string } => f !== null);

  return (
    <section id="book" aria-labelledby="book-title" className="bg-white py-16 md:py-24">
      <div className="container-page grid items-start gap-12 md:grid-cols-2">
        <div>
          <SectionHeading id="book-title" label="About the book" title="Preparation for something you cannot yet see" />
          <blockquote className="mt-8 text-xl font-semibold text-ink-900">{book.blurb}</blockquote>
          <div className="mt-6 space-y-4 text-base text-ink-700">
            {book.synopsis.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="font-semibold text-ink-900">{book.closing}</p>
          </div>
          {book.samplePdf ? (
            <a href={book.samplePdf} className="btn btn-dark mt-8" download>
              Download a sample chapter (PDF)
            </a>
          ) : null}
        </div>

        <div className="md:sticky md:top-24">
          <Image
            src="/images/back-900.webp"
            alt="The back cover of the book. It carries the blurb, a short biography of Chamberlain Oyibo, the SW Advantage Resources logo and the ISBN barcode."
            width={900}
            height={1259}
            sizes="(min-width: 768px) 32rem, 100vw"
            loading="lazy"
            className="h-auto w-full rounded-card shadow-raised"
          />
        </div>
      </div>

      <div className="container-page mt-16 grid gap-12 md:grid-cols-2">
        <div>
          <h3 className="text-2xl text-ink-900">Themes</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {book.themes.map((t) => (
              <li key={t} className="rounded-control bg-sky-100 px-4 py-2 text-sm font-semibold text-ink-900">{t}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-2xl text-ink-900">Book details</h3>
          <dl className="mt-4 divide-y divide-sky-200">
            {facts.map((f) => (
              <div key={f.term} className="flex justify-between gap-6 py-3">
                <dt className="text-sm text-ink-500">{f.term}</dt>
                <dd className="text-right text-sm font-semibold text-ink-900 tabular">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="container-page mt-16">
        <Image
          src="/images/wrap-1800.webp"
          alt="The full printed jacket laid flat: back cover on the left, the spine in the middle and the front cover on the right."
          width={1800}
          height={1175}
          sizes="(min-width: 1152px) 72rem, 100vw"
          loading="lazy"
          className="h-auto w-full rounded-card"
        />
        <p className="mt-3 text-sm text-ink-500">The full jacket, back to front.</p>
      </div>
    </section>
  );
}
