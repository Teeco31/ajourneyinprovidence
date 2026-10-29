import Link from "next/link";
import { content } from "@/lib/content";
import { GalleryGrid } from "../gallery-grid";
import { SectionHeading } from "../section-heading";

/** Latest photos on the home page. The full set lives on /gallery/. Hidden until the first photo is published. */
export function Gallery() {
  const photos = content.photos;
  if (photos.length === 0) return null;

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="bg-sky-100 py-16 md:py-24">
      <div className="container-page">
        <SectionHeading id="gallery-title" label="Gallery" title="From the launch" />
        <div className="mt-10">
          <GalleryGrid photos={photos.slice(0, 6)} />
        </div>
        {photos.length > 6 ? (
          <Link href="/gallery/" className="btn btn-dark mt-8">
            See all {photos.length} photos
          </Link>
        ) : null}
      </div>
    </section>
  );
}
