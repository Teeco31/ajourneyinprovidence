import { content, primaryEvent } from "@/lib/content";
import { BookCover } from "../book-cover";
import { Countdown } from "../countdown";
import { Wave } from "../wave";

export function Hero() {
  const { book, author } = content.site;
  const event = primaryEvent();
  return (
    <section id="top" className="bg-sky-100">
      <div className="container-page grid items-center gap-12 pb-12 pt-12 md:grid-cols-2 md:pb-16 md:pt-16">
        <div className="order-2 md:order-1">
          <p className="text-sm font-semibold uppercase tracking-widest text-ink-900">{author.shortName}</p>
          <h1 className="mt-4 text-6xl text-ink-900 md:text-8xl">
            {book.title.replace(" Providence", "")}
            <span className="block text-gold-700">Providence</span>
          </h1>
          <p className="mt-4 text-xl font-semibold text-ink-700">{book.subtitle}</p>
          <p className="mt-6 max-w-prose text-base text-ink-700">{book.blurb}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#buy" className="btn btn-primary">Buy the book</a>
            <a href="#launch" className="btn btn-secondary">Attend the launch</a>
          </div>

          {event ? (
            <div className="mt-8 max-w-sm">
              <Countdown target={event.start} end={event.end} label={event.countdownLabel} />
            </div>
          ) : null}
        </div>

        <div className="order-1 md:order-2">
          <BookCover priority />
        </div>
      </div>
      <Wave className="text-white" />
    </section>
  );
}
