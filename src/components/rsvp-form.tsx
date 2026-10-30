"use client";

import { useState } from "react";
import { env, fallbackContactEmail } from "@/lib/env";
import { Field, FormStatus, Honeypot, SelectField, rules } from "./contact-fields";
import { useFormSubmit } from "./use-form-submit";

export type RsvpEvent = { id: string; title: string; dateLabel: string; hasLivestream: boolean };

/**
 * What an RSVP email contains, so the publisher can act on it without opening the site:
 * the event (title, id, date), who is coming, how to reach them, how many, and in person or online when a livestream exists.
 */
export function RsvpForm({ event, contactEmail }: { event: RsvpEvent; contactEmail: string }) {
  const { state, errorMessage, submit } = useFormSubmit(env.rsvpEndpoint);
  const email = contactEmail || fallbackContactEmail;
  const [attendance, setAttendance] = useState("In person");

  return (
    <form action={env.rsvpEndpoint} method="POST" onSubmit={submit} onReset={() => setAttendance("In person")} className="relative space-y-4">
      <input type="hidden" name="form" value="rsvp" />
      <input type="hidden" name="_subject" value={`RSVP: ${event.title}`} />
      <input type="hidden" name="event" value={event.title} />
      <input type="hidden" name="event_id" value={event.id} />
      <input type="hidden" name="event_date" value={event.dateLabel} />
      <Honeypot />

      <Field label="Full name" name="name" required autoComplete="name" {...rules.name} />
      <Field label="Email address" name="email" type="email" required autoComplete="email" inputMode="email" {...rules.email} />
      <Field
        label="Phone number"
        name="phone"
        type="tel"
        optional
        autoComplete="tel"
        inputMode="tel"
        hint="So we can reach you if the programme changes."
        {...rules.phone}
      />
      <Field label="Organisation" name="organisation" optional autoComplete="organization" {...rules.organisation} />
      <Field
        label="Number attending, including you"
        name="guests"
        type="number"
        required
        inputMode="numeric"
        defaultValue={1}
        min={1}
        max={10}
        title="Enter a whole number from 1 to 10"
      />
      {event.hasLivestream ? (
        <SelectField label="How will you attend?" name="attendance" options={["In person", "Online"]} value={attendance} onChange={setAttendance} />
      ) : null}

      <p className="text-sm text-ink-500">
        We use these details only to manage attendance. See the <a className="font-semibold underline" href="/privacy/">privacy notice</a>.
      </p>
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={state === "sending"}>
        {state === "sending" ? "Sending..." : "Confirm my attendance"}
      </button>
      <FormStatus state={state} errorMessage={errorMessage} successText="Thank you. Your RSVP has been received." fallbackEmail={email} />
    </form>
  );
}
