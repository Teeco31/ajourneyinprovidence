import { content } from "@/lib/content";
import Image from "next/image";
import { ContactForm } from "../contact-form";
import { SectionHeading } from "../section-heading";

export function Contact() {
  const { contact, book, pressKit } = content.site;
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-white py-16 md:py-24">
      <div className="container-page grid gap-12 md:grid-cols-2">
        <div>
          <SectionHeading id="contact-title" label="Contact and media" title="Get in touch" intro={`For media, bulk orders and speaking invitations, contact the publisher, ${book.publisher}.`} />
          <dl className="mt-8 space-y-3 text-base">
            {contact.email ? (
              <div>
                <dt className="text-sm text-ink-500">Email</dt>
                <dd><a className="font-semibold underline" href={`mailto:${contact.email}`}>{contact.email}</a></dd>
              </div>
            ) : null}
            {contact.phone ? (
              <div>
                <dt className="text-sm text-ink-500">Phone</dt>
                <dd><a className="font-semibold underline" href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a></dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-8">
            <p className="text-sm text-ink-500">Published by</p>
            <Image
              src="/images/publisher-logo.webp"
              alt={`${book.publisher} logo`}
              width={360}
              height={247}
              loading="lazy"
              className="mt-2 h-auto w-40 rounded-card"
            />
          </div>

          {pressKit.length > 0 ? (
            <div className="mt-8">
              <h3 className="text-2xl text-ink-900">Media kit</h3>
              <ul className="mt-4 space-y-2">
                {pressKit.map((f) => (
                  <li key={f.href}>
                    <a className="btn btn-dark w-full sm:w-auto" href={f.href} download>{f.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="rounded-card bg-sky-50 p-6 md:p-8">
          <ContactForm contactEmail={contact.email} />
        </div>
      </div>
    </section>
  );
}
