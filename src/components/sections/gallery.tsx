import Image from "next/image";
import Link from "next/link";
import { content } from "@/lib/content";
import { SectionHeading } from "../section-heading";

/** The home page shows at most three photos. The full set lives on /gallery/. Hidden until the first photo is published. */
const TEASER_COUNT = 3;

export function Gallery() {
  const photos = content.photos;
  if (photos.length === 0) return null;

  // The client ticks "Show on the home page" on up to three photos. With none ticked, the newest three are used.
  const featured = photos.filter((p) => p.featured);
  const teaser = (featured.length > 0 ? featured : photos).slice(0, TEASER_COUNT);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="bg-sky-100 py-16 md:py-24">
      <div className="container-page">
        <SectionHeading id="gallery-title" label="Gallery" title="From the launch" />

        {/* Two across on phones and tablets, three on wide screens. One or two photos get a layout that fits. Each tile opens the full gallery. */}
        <ul
          className={`mt-10 grid gap-3 lg:gap-4 ${
            teaser.length === 1 ? "max-w-md grid-cols-1" : teaser.length === 2 ? "grid-cols-2 lg:max-w-3xl" : "grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {teaser.map((p, i) => (
            <li key={p.id} className={i === 2 ? "hidden lg:block" : undefined}>
              <Link href="/gallery/" className="group relative block aspect-4/3 overflow-hidden rounded-card bg-sky-200" aria-label={`Open the gallery: ${p.caption || p.alt}`}>
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 22rem, 50vw"
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/gallery/" className="btn btn-dark mt-8">
          See all photos{photos.length > 1 ? ` (${photos.length})` : ""}
        </Link>
      </div>
    </section>
  );
}
