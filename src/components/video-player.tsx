"use client";

import Image from "next/image";
import { useState } from "react";
import type { Trailer } from "@/lib/types";

/**
 * Click to play. Nothing heavy loads until the visitor presses play, so the page stays light on mobile data.
 * Plays a YouTube video (privacy-friendly domain) or a small self-hosted MP4.
 */
export function VideoPlayer({ video }: { video: Trailer }) {
  const [playing, setPlaying] = useState(false);
  const poster = video.poster || "/images/cover-800.webp";

  if (playing) {
    return video.youtubeId ? (
      <iframe
        title={video.title}
        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="aspect-video w-full rounded-card bg-ink-900"
      />
    ) : (
      <video src={video.src} poster={poster} controls autoPlay playsInline preload="none" className="aspect-video w-full rounded-card bg-ink-900" />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${video.title}`}
      className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-card bg-ink-900"
    >
      <Image src={poster} alt="" fill loading="lazy" sizes="(min-width: 1024px) 36rem, 100vw" className="object-cover" />
      <span className="absolute inset-0 flex items-center justify-center bg-ink-900/30 transition-colors duration-200 group-hover:bg-ink-900/10">
        <span className="flex size-16 items-center justify-center rounded-full bg-gold-500 text-ink-900 transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-1 size-7" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
