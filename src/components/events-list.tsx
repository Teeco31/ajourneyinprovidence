"use client";

import { useEffect, useState } from "react";
import { eventStatus, type EventItem } from "@/lib/types";
import { EventCard } from "./event-card";

/** Status is worked out in the visitor's browser, so events move to the archive on their own without a rebuild. */
export function EventsList({ events, contactEmail }: { events: EventItem[]; contactEmail: string }) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 60000);
    return () => window.clearInterval(id);
  }, []);

  const withStatus = events.map((event) => ({ event, status: eventStatus(event, now) }));
  const current = withStatus.filter((e) => e.status !== "Past");
  const past = withStatus.filter((e) => e.status === "Past");

  return (
    <div className="mt-10 space-y-10">
      {current.length === 0 ? (
        <p className="rounded-card bg-sky-50 p-6 text-base text-ink-700">No upcoming events are listed right now. New dates will appear here.</p>
      ) : (
        <div className="space-y-6">
          {current.map(({ event, status }) => (
            <EventCard key={event.id} event={event} status={status} contactEmail={contactEmail} />
          ))}
        </div>
      )}

      {past.length > 0 ? (
        <div>
          <h3 className="text-3xl text-ink-900">Past events</h3>
          <div className="mt-6 space-y-6">
            {past.map(({ event, status }) => (
              <EventCard key={event.id} event={event} status={status} contactEmail={contactEmail} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
