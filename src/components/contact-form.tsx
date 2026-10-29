"use client";

import { useId } from "react";
import { env } from "@/lib/env";
import { Field, FormStatus, Honeypot } from "./contact-fields";
import { useFormSubmit } from "./use-form-submit";

export function ContactForm({ contactEmail }: { contactEmail: string }) {
  const { state, submit } = useFormSubmit(env.contactEndpoint);
  const topicId = useId();
  const email = contactEmail;

  if (!env.contactEndpoint) {
    return (
      <p className="rounded-control bg-sky-100 p-4 text-sm text-ink-700">
        The enquiry form opens soon.{email ? ` Until then, write to ${email}.` : ""}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="relative space-y-4">
      <input type="hidden" name="_subject" value="Website enquiry: A Journey in Providence" />
      <Honeypot />
      <Field label="Full name" name="name" required autoComplete="name" />
      <Field label="Email address" name="email" type="email" required autoComplete="email" inputMode="email" />
      <div>
        <label htmlFor={topicId} className="mb-1 block text-sm font-semibold text-ink-900">What is your enquiry about?</label>
        <select id={topicId} name="topic" className="field" defaultValue="Media">
          <option>Media</option>
          <option>Bulk or corporate order</option>
          <option>Invite the author to speak</option>
          <option>Something else</option>
        </select>
      </div>
      <Field label="Message" name="message" required textarea />
      <p className="text-sm text-ink-500">
        We use these details only to reply to you. See the <a className="font-semibold underline" href="/privacy/">privacy notice</a>.
      </p>
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={state === "sending"}>
        {state === "sending" ? "Sending..." : "Send message"}
      </button>
      <FormStatus state={state} successText="Thank you. Your message has been sent and we will reply by email." fallbackEmail={email} />
    </form>
  );
}
