import { content, primaryEvent } from "@/lib/content";
import { siteUrl } from "@/lib/env";

export function JsonLd() {
  const { book, author } = content.site;
  const event = primaryEvent();
  const person = {
    "@type": "Person",
    "@id": `${siteUrl}/#author`,
    name: author.name,
    jobTitle: "Petroleum geologist and energy executive",
    description: author.bio[0],
  };
  const graph = [
    person,
    {
      "@type": "Book",
      "@id": `${siteUrl}/#book`,
      name: book.title,
      alternativeHeadline: book.subtitle,
      description: book.blurb,
      workExample: content.editions.map((e) => ({
        "@type": "Book",
        name: `${book.title} (${e.name})`,
        bookFormat: e.name === "Paperback" ? "https://schema.org/Paperback" : "https://schema.org/Hardcover",
        ...(e.isbn ? { isbn: e.isbn } : {}),
        ...(e.cover ? { image: e.cover.src.startsWith("http") ? e.cover.src : `${siteUrl}${e.cover.src}` } : {}),
      })),
      inLanguage: "en",
      author: { "@id": `${siteUrl}/#author` },
      publisher: { "@type": "Organization", name: book.publisher },
      image: `${siteUrl}/images/cover-800.webp`,
      url: siteUrl,
    },
    ...(event ? [{
      "@type": "Event",
      name: event.title,
      startDate: event.start,
      endDate: event.end,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: event.venue,
        address: { "@type": "PostalAddress", streetAddress: "Victoria Island", addressLocality: "Lagos", addressCountry: "NG" },
      },
      image: `${siteUrl}/images/og.jpg`,
      description: event.details,
      about: { "@id": `${siteUrl}/#book` },
    }] : []),
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}
