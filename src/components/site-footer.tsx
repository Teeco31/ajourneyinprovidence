import Link from "next/link";
import { content } from "@/lib/content";
import { ShareButtons } from "./share-buttons";
import { Wave } from "./wave";

export function SiteFooter() {
  const { book, social, contact } = content.site;
  const socials = Object.entries(social).filter(([, url]) => url);

  return (
    <footer className="bg-white">
      <Wave className="text-ink-900" />
      <div className="bg-ink-900 py-12 text-white">
        <div className="container-page grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-3xl">{book.title}</p>
            <p className="mt-2 text-sm text-sky-200">{book.subtitle}</p>
            <p className="mt-4 text-sm text-sky-200">Published by {book.publisher}</p>
            {contact.email || contact.phone ? (
              <ul className="mt-4 text-sm">
                {contact.email ? (
                  <li>
                    <a className="inline-flex min-h-11 items-center break-all underline" href={`mailto:${contact.email}`}>
                      {contact.email}
                    </a>
                  </li>
                ) : null}
                {contact.phone ? (
                  <li>
                    <a className="inline-flex min-h-11 items-center underline tabular" href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                      {contact.phone}
                    </a>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-semibold">Share this book</p>
            <div className="mt-3"><ShareButtons /></div>
            {socials.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-4 text-sm">
                {socials.map(([name, url]) => (
                  <li key={name}>
                    <a className="inline-flex min-h-11 items-center capitalize underline" href={url} target="_blank" rel="noopener noreferrer">{name}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-semibold">More</p>
            <ul className="mt-3 text-sm">
              <li><Link className="inline-flex min-h-11 items-center underline" href="/gallery/">Photo gallery</Link></li>
              <li><a className="inline-flex min-h-11 items-center underline" href="/privacy/">Privacy notice</a></li>
              <li><a className="inline-flex min-h-11 items-center underline" href="/qr/">Printable QR code</a></li>
            </ul>
          </div>
        </div>
        <p className="container-page mt-10 text-sm text-sky-200">
          © {new Date().getFullYear()} {book.publisher}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
