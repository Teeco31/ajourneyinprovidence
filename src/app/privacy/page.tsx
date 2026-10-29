import type { Metadata } from "next";
import { content } from "@/lib/content";

export const metadata: Metadata = { title: "Privacy notice", alternates: { canonical: "/privacy/" } };

export default function PrivacyPage() {
  const { book, contact } = content.site;
  return (
    <article className="container-page max-w-3xl py-16">
      <h1 className="text-5xl text-ink-900">Privacy notice</h1>
      <p className="mt-2 text-sm text-ink-500">Draft for the publisher&apos;s legal review before launch.</p>

      <div className="mt-8 space-y-8 text-base text-ink-700">
        <section>
          <h2 className="text-3xl text-ink-900">Who we are</h2>
          <p className="mt-2">
            This website is run by {book.publisher}, the publisher of {book.title}. We handle personal data in line with the Nigeria Data Protection Act 2023.
            {contact.email ? ` You can write to us at ${contact.email}.` : ""}
          </p>
        </section>
        <section>
          <h2 className="text-3xl text-ink-900">What we collect and why</h2>
          <p className="mt-2">
            When you RSVP or send an enquiry, we collect the details you type into the form: your name, email address, and any organisation, guest number or message you add.
            We use them only to manage launch attendance and to reply to you. Our lawful basis is your consent, given when you submit the form.
          </p>
        </section>
        <section>
          <h2 className="text-3xl text-ink-900">Who handles it</h2>
          <p className="mt-2">
            Form submissions are processed by Formspree, which emails them to us. We do not sell your data or use it for marketing without asking you first.
          </p>
        </section>
        <section>
          <h2 className="text-3xl text-ink-900">Analytics</h2>
          <p className="mt-2">
            If switched on, we use Plausible Analytics. It does not use cookies and does not collect personal data. Links to online stores carry campaign tags so we can see which store a visit came from.
          </p>
        </section>
        <section>
          <h2 className="text-3xl text-ink-900">Your rights</h2>
          <p className="mt-2">
            You can ask to see, correct or delete your data at any time, and you can withdraw consent. We keep RSVP and enquiry details only for as long as we need them for the launch and follow-up.
          </p>
        </section>
      </div>
    </article>
  );
}
