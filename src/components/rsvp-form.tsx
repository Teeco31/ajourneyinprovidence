"use client";

import { env } from "@/lib/env";
import { Field, FormStatus, Honeypot } from "./contact-fields";
import { useFormSubmit } from "./use-form-submit";

export function RsvpForm({ eventTitle, contactEmail }: { eventTitle: string; contactEmail: string }) {
  const { state, submit } = useFormSubmit(env.rsvpEndpoint);
  const email = contactEmail;

  if (!env.rsvpEndpoint) {
    return (
      <p className="rounded-control bg-sky-100 p-4 text-sm text-ink-700">
        RSVP opens soon.{email ? ` In the meantime, write to ${email}.` : ""}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="relative space-y-4" noValidate={false}>
      <input type="hidden" name="_subject" value={`RSVP: ${eventTitle}`} />
      <Honeypot />
      <Field label="Full name" name="name" required autoComplete="name" />
      <Field label="Email address" name="email" type="email" required autoComplete="email" inputMode="email" />
      <Field label="Organisation" name="organisation" autoComplete="organization" optional />
      <Field label="Number of guests" name="guests" type="number" inputMode="numeric" optional />
      <p className="text-sm text-ink-500">
        We use these details only to manage attendance. See the <a className="font-semibold underline" href="/privacy/">privacy notice</a>.
      </p>
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={state === "sending"}>
        {state === "sending" ? "Sending..." : "Confirm my attendance"}
      </button>
      <FormStatus state={state} successText="Thank you. Your RSVP is in, and a confirmation will follow by email." fallbackEmail={email} />
    </form>
  );
}
