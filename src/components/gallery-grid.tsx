"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Photo } from "@/lib/types";

/** Thumbnail grid with a full-screen viewer. The native dialog handles Escape, focus trapping and returning focus. */
export function GalleryGrid({ photos }: { photos: Photo[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  function open(i: number) {
    setIndex(i);
    ref.current?.showModal();
  }
  const step = (d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length));
  const photo = index === null ? null : photos[index];

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`Open photo: ${p.caption || p.alt}`}
              className="group relative block aspect-4/3 w-full cursor-pointer overflow-hidden rounded-card bg-sky-200"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </button>
            {p.caption ? <p className="mt-2 text-sm text-ink-700">{p.caption}</p> : null}
          </li>
        ))}
      </ul>

      <dialog
        ref={ref}
        aria-label="Photo viewer"
        onClose={() => setIndex(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) ref.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none bg-ink-900 p-0 text-white backdrop:bg-ink-900"
      >
        {photo ? (
          <div className="relative h-full w-full">
            <div className="absolute inset-x-4 bottom-24 top-16">
              <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <button type="button" onClick={() => ref.current?.close()} className="btn btn-secondary absolute right-4 top-4">
              Close
            </button>
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4">
              <button type="button" onClick={() => step(-1)} className="btn btn-secondary" aria-label="Previous photo">
                Previous
              </button>
              <p className="min-w-0 flex-1 text-center text-sm" aria-live="polite">
                {photo.caption || photo.alt}
                <span className="ml-2 text-sky-200 tabular">{(index ?? 0) + 1} of {photos.length}</span>
              </p>
              <button type="button" onClick={() => step(1)} className="btn btn-secondary" aria-label="Next photo">
                Next
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
