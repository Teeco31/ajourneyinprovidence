import Image from "next/image";
import { content } from "@/lib/content";
import { SectionHeading } from "../section-heading";

export function AboutAuthor() {
  const { author } = content.site;
  return (
    <section id="author" aria-labelledby="author-title" className="bg-sky-100 py-16 md:py-24">
      <div className="container-page grid gap-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <Image
            src="/images/portrait-tall-900.webp"
            alt={`${author.name} in a grey top hat and white traditional attire, smiling at the camera`}
            width={900}
            height={1200}
            sizes="(min-width: 768px) 28rem, 100vw"
            loading="lazy"
            className="h-auto w-full rounded-card shadow-raised md:sticky md:top-24"
          />
        </div>

        <div className="md:col-span-3">
          <SectionHeading id="author-title" label="About the author" title={author.name} />
          <div className="mt-6 space-y-4 text-base text-ink-700">
            {author.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <h3 className="mt-12 text-2xl text-ink-900">Roles and honours</h3>
          <ol className="mt-4 space-y-4">
            {author.highlights.map((h) => (
              <li key={h.title} className="rounded-card bg-white p-4">
                {h.period ? <p className="label-caps tabular">{h.period}</p> : null}
                <p className="text-base font-semibold text-ink-900">{h.title}</p>
                <p className="mt-1 text-sm text-ink-700">{h.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
