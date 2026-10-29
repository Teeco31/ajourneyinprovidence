import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import Script from "next/script";
import { content } from "@/lib/content";
import { env, siteUrl } from "@/lib/env";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const display = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas", display: "swap" });
const sans = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });

const { book, author } = content.site;
const navLinks = [
  { href: "/#book", label: "The book" },
  { href: "/#author", label: "The author" },
  ...(content.trailers.some((v) => v.youtubeId || v.src) ? [{ href: "/#watch", label: "Watch" }] : []),
  { href: "/#launch", label: "Launch events" },
  { href: "/#buy", label: "Buy" },
  { href: "/gallery/", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
];

const description = `${book.title}: ${book.subtitle}. The life and career of ${author.name}, launching at the 44th Annual NAPE Conference, Lagos, 8 to 12 November 2026.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${book.title} by ${author.shortName}`, template: `%s | ${book.title}` },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "book",
    siteName: book.title,
    title: `${book.title}: ${book.subtitle}`,
    description,
    url: "/",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: `Cover of ${book.title} by ${author.shortName}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${book.title}: ${book.subtitle}`,
    description,
    images: ["/images/og.jpg"],
  },
};

export const viewport: Viewport = { themeColor: "#dff0fa", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a
          href="#main"
          className="absolute left-4 top-4 z-50 -translate-y-24 rounded-control bg-ink-900 px-4 py-3 font-semibold text-white focus:translate-y-0"
        >
          Skip to content
        </a>
        <SiteHeader links={navLinks} />
        <main id="main">{children}</main>
        <SiteFooter />
        {env.plausibleDomain ? (
          <Script defer data-domain={env.plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        ) : null}
      </body>
    </html>
  );
}
