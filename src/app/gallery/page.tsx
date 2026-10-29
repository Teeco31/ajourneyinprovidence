import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/lib/content";
import { GalleryGrid } from "@/components/gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from the launch of A Journey in Providence and from events along the way.",
  alternates: { canonical: "/gallery/" },
};

export default function GalleryPage() {
  const { photos, events } = content;

  // One album per event that has photos, newest event first. Photos with no event go under "More photos".
  const albums = [...events]
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
    .map((e) => ({ id: `event-${e.id}`, title: e.title, subtitle: e.dateLabel, photos: photos.filter((p) => p.eventId === e.id) }))
    .filter((a) => a.photos.length > 0);
  const loose = photos.filter((p) => !events.some((e) => e.id === p.eventId));
  if (loose.length > 0) albums.push({ id: "more", title: "More photos", subtitle: "", photos: loose });

  return (
    <section className="bg-sky-100 py-16 md:py-24">
      <div className="container-page">
        <p className="label-caps">Gallery</p>
        <h1 className="mt-2 text-5xl text-ink-900 md:text-7xl">Photos and moments</h1>

        {albums.length === 0 ? (
          <div className="mt-10 max-w-xl rounded-card bg-white p-6">
            <p className="text-base text-ink-700">Photos from the launch will be added here after the event.</p>
            <Link href="/" className="btn btn-primary mt-6">Back to the home page</Link>
          </div>
        ) : (
          <div className="mt-12 space-y-16">
            {albums.map((a) => (
              <section key={a.id} id={a.id} aria-labelledby={`${a.id}-title`}>
                <h2 id={`${a.id}-title`} className="text-3xl text-ink-900 md:text-4xl">{a.title}</h2>
                {a.subtitle ? <p className="mt-1 text-sm text-ink-500">{a.subtitle}</p> : null}
                <div className="mt-6">
                  <GalleryGrid photos={a.photos} />
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
