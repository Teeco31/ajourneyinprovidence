"use client";

import Image from "next/image";
import { useState } from "react";
import type { Edition, Picture } from "@/lib/types";

type Props = {
  editions: Edition[];
  title: string;
  subtitle: string;
  authorShortName: string;
  priority?: boolean;
};

/** Shown only if no edition has a cover yet, so the hero never loses the book. */
const FALLBACK: Edition = {
  id: "default",
  name: "Hardback",
  isbn: "",
  note: "",
  cover: { src: "/images/cover-800.webp", width: 800, height: 1071 },
  spine: { src: "/images/spine.webp", width: 143, height: 1400 },
  fullJacket: null,
};

/** The spine's true width as a share of the cover's width, worked out from the two pictures. */
const spineShare = (cover: Picture, spine: Picture) => ((spine.width / spine.height) * (cover.height / cover.width)) * 100;

/**
 * A 3D book built from the real files: front cover plus spine, turned 22 degrees so the spine shows.
 * Every edition sits in the same grid cell, so the cell is as tall as the tallest book and switching never moves the page.
 * Only opacity changes between editions.
 */
export function BookCover({ editions, title, subtitle, authorShortName, priority = false }: Props) {
  const withCover = editions.filter((e) => e.cover);
  const books = withCover.length > 0 ? withCover : [FALLBACK];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col items-center">
      <div className="mx-auto grid w-72 pl-8 sm:w-80 md:w-96">
        {books.map((e, i) => {
          const cover = e.cover as Picture;
          const selected = i === active;
          return (
            <div
              key={e.id}
              inert={!selected}
              aria-hidden={!selected}
              className={`self-center transition-opacity duration-200 ease-out ${selected ? "opacity-100" : "pointer-events-none opacity-0"}`}
              style={{ gridArea: "1 / 1", perspective: "1600px" }}
            >
              <div className="relative" style={{ transformStyle: "preserve-3d", transform: "rotateY(22deg)" }}>
                {e.spine ? (
                  <div
                    aria-hidden="true"
                    className="absolute top-0 h-full overflow-hidden"
                    style={{ right: "100%", width: `${spineShare(cover, e.spine).toFixed(2)}%`, transformOrigin: "right center", transform: "rotateY(-90deg)" }}
                  >
                    <Image src={e.spine.src} alt="" fill sizes="3rem" className="object-cover" />
                  </div>
                ) : null}
                <Image
                  src={cover.src}
                  alt={`${e.name} cover of ${title}: ${subtitle}, by ${authorShortName}. A portrait of the author in a grey top hat and white traditional attire.`}
                  width={cover.width}
                  height={cover.height}
                  sizes="(min-width: 768px) 24rem, 18rem"
                  priority={priority && i === 0}
                  className="h-auto w-full shadow-overlay"
                />
              </div>
            </div>
          );
        })}
      </div>

      {books.length > 1 ? (
        <div role="group" aria-label="Choose an edition" className="mt-8 inline-flex gap-1 rounded-control bg-white p-1">
          {books.map((e, i) => (
            <button
              key={e.id}
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={`min-h-11 cursor-pointer rounded-control px-5 text-sm font-semibold transition-colors duration-150 ${
                i === active ? "bg-ink-900 text-white" : "text-ink-900 hover:bg-sky-100"
              }`}
            >
              {e.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
