import { content } from "@/lib/content";
import { SectionHeading } from "../section-heading";
import { VideoPlayer } from "../video-player";

export function Trailers() {
  const videos = content.trailers.filter((v) => v.youtubeId || v.src);
  if (videos.length === 0) return null;

  return (
    <section id="watch" aria-labelledby="watch-title" className="bg-ink-900 py-16 text-white md:py-24">
      <div className="container-page">
        <p className="label-caps text-gold-500">Watch</p>
        <h2 id="watch-title" className="mt-2 text-4xl md:text-6xl">The trailers</h2>
        <ul className="mt-10 grid gap-8 md:grid-cols-2">
          {videos.map((v) => (
            <li key={v.title}>
              <VideoPlayer video={v} />
              <p className="mt-3 text-base font-semibold">{v.title}</p>
              {v.caption ? <p className="text-sm text-sky-200">{v.caption}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
