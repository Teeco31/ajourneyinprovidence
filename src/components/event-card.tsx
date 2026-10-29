import Link from "next/link";
import { googleCalendarUrl } from "@/lib/ics";
import type { EventItem, EventStatus } from "@/lib/types";
import { RsvpForm } from "./rsvp-form";

const statusStyle: Record<EventStatus, string> = {
  Upcoming: "bg-sky-200 text-ink-900",
  Live: "bg-success-100 text-success-600",
  Past: "bg-ink-900 text-white",
};

export function EventCard({ event, status, contactEmail }: { event: EventItem; status: EventStatus; contactEmail: string }) {
  const map = `https://www.google.com/maps?q=${encodeURIComponent(event.mapQuery)}`;
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(event.mapQuery)}&output=embed`;
  const past = status === "Past";

  return (
    <article className="rounded-card bg-sky-50 p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-control px-3 py-1 text-sm font-semibold ${statusStyle[status]}`}>{status}</span>
        <span className="label-caps">{event.kind}</span>
      </div>
      <h3 className="mt-4 text-3xl text-ink-900 md:text-4xl">{event.title}</h3>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div>
          <dl className="space-y-4 text-base">
            <div>
              <dt className="text-sm text-ink-500">Date</dt>
              <dd className="font-semibold text-ink-900">{event.dateLabel}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-500">Time (WAT)</dt>
              <dd className="font-semibold text-ink-900">{event.timeLabel}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-500">Venue</dt>
              <dd className="font-semibold text-ink-900">{event.venue}</dd>
              <dd className="text-ink-700">{event.address}</dd>
            </div>
            {event.dressCode ? (
              <div>
                <dt className="text-sm text-ink-500">Dress code</dt>
                <dd className="font-semibold text-ink-900">{event.dressCode}</dd>
              </div>
            ) : null}
          </dl>
          <p className="mt-4 text-sm text-ink-700">{event.details}</p>

          {!past ? (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a className="btn btn-dark" href={`/events/${event.id}/calendar.ics`}>Add to calendar (.ics)</a>
              <a className="btn btn-secondary" href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">Google Calendar</a>
              {event.livestreamUrl ? (
                <a className="btn btn-primary" href={event.livestreamUrl} target="_blank" rel="noopener noreferrer">Watch the livestream</a>
              ) : null}
            </div>
          ) : null}
          <p className="mt-4 text-sm">
            <a className="font-semibold text-gold-700 underline" href={event.infoUrl} target="_blank" rel="noopener noreferrer">
              Conference information on nape.org.ng
            </a>
          </p>
          {event.gallery ? (
            <Link className="btn btn-dark mt-4" href={event.gallery}>See photos from this event</Link>
          ) : null}
        </div>

        <div>
          <iframe
            title={`Map showing ${event.venue}`}
            src={embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-64 w-full rounded-control bg-sky-200"
          />
          <a className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-gold-700 underline" href={map} target="_blank" rel="noopener noreferrer">
            Open in Google Maps
          </a>
        </div>
      </div>

      {event.rsvp && !past ? (
        <div className="mt-8 rounded-card bg-white p-6">
          <h4 className="text-2xl font-display text-ink-900">RSVP</h4>
          <div className="mt-4 max-w-md">
            <RsvpForm eventTitle={event.title} contactEmail={contactEmail} />
          </div>
        </div>
      ) : null}
    </article>
  );
}
