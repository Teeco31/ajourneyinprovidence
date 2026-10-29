import { content } from "@/lib/content";
import { siteUrl } from "@/lib/env";

export function ShareButtons() {
  const { book } = content.site;
  const text = `${book.title}: ${book.subtitle}`;
  const url = encodeURIComponent(siteUrl);
  const msg = encodeURIComponent(text);
  const targets = [
    { label: "WhatsApp", href: `https://wa.me/?text=${msg}%20${url}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${msg}&url=${url}` },
    { label: "Email", href: `mailto:?subject=${msg}&body=${url}` },
  ];
  return (
    <ul className="flex flex-wrap gap-2">
      {targets.map((t) => (
        <li key={t.label}>
          <a
            href={t.href}
            target={t.label === "Email" ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-control bg-ink-700 px-4 text-sm font-semibold text-white hover:bg-gold-500 hover:text-ink-900"
            aria-label={`Share on ${t.label}`}
          >
            {t.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
