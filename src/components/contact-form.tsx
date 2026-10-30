"use client";

import { useState } from "react";
import { env, fallbackContactEmail } from "@/lib/env";
import { Field, FormStatus, Honeypot, SelectField, rules } from "./contact-fields";
import { useFormSubmit } from "./use-form-submit";

const TOPICS = ["Media", "Bulk or corporate order", "Invite the author to speak", "Something else"];
const BULK = "Bulk or corporate order";

/**
 * Every enquiry carries name, email, optional phone and organisation, a topic and a message. The subject line shows the topic.
 * A bulk order also asks how many copies and which edition, so it can be quoted without a second email.
 */
export function ContactForm({ contactEmail, editionNames }: { contactEmail: string; editionNames: string[] }) {
  const { state, errorMessage, submit } = useFormSubmit(env.contactEndpoint);
  const email = contactEmail || fallbackContactEmail;
  const editionOptions = editionNames.length > 1 ? [...editionNames, "Both"] : editionNames;

  const [topic, setTopic] = useState(TOPICS[0]);
  const [edition, setEdition] = useState(editionOptions[0] ?? "");

  return (
    <form action={env.contactEndpoint} method="POST" onSubmit={submit} onReset={() => setTopic(TOPICS[0])} className="relative space-y-4">
      <input type="hidden" name="form" value="contact" />
      <input type="hidden" name="_subject" value={`Website enquiry: ${topic}`} />
      <Honeypot />

      <Field label="Full name" name="name" required autoComplete="name" {...rules.name} />
      <Field label="Email address" name="email" type="email" required autoComplete="email" inputMode="email" {...rules.email} />
      <Field label="Phone number" name="phone" type="tel" optional autoComplete="tel" inputMode="tel" {...rules.phone} />
      <Field label="Organisation or publication" name="organisation" optional autoComplete="organization" {...rules.organisation} />
      <SelectField label="What is your enquiry about?" name="topic" options={TOPICS} value={topic} onChange={setTopic} required />

      {topic === BULK ? (
        <>
          <Field
            label="Number of copies"
            name="copies"
            type="number"
            required
            inputMode="numeric"
            min={1}
            max={10000}
            title="Enter a whole number of copies, from 1 to 10,000"
          />
          {editionOptions.length > 0 ? (
            <SelectField label="Which edition?" name="edition" options={editionOptions} value={edition} onChange={setEdition} />
          ) : null}
        </>
      ) : null}

      <Field label="Message" name="message" required textarea {...rules.message} />

      <p className="text-sm text-ink-500">
        We use these details only to reply to you. See the <a className="font-semibold underline" href="/privacy/">privacy notice</a>.
      </p>
      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={state === "sending"}>
        {state === "sending" ? "Sending..." : "Send message"}
      </button>
      <FormStatus
        state={state}
        errorMessage={errorMessage}
        successText="Thank you. Your message has been sent."
        fallbackEmail={email}
      />
    </form>
  );
}
