import type { Metadata } from "next";
import QRCode from "qrcode";
import { content } from "@/lib/content";
import { siteUrl } from "@/lib/env";
import { PrintButton } from "@/components/print-button";

export const metadata: Metadata = { title: "Printable QR code", robots: { index: false } };

export default async function QrPage() {
  const svg = await QRCode.toString(`${siteUrl}/?utm_source=qr&utm_medium=print&utm_campaign=book_launch`, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 2,
    color: { dark: "#11171d", light: "#ffffff" },
  });
  const { book } = content.site;

  return (
    <section className="py-16">
      <div className="container-page flex flex-col items-center text-center">
        <h1 className="text-5xl text-ink-900">{book.title}</h1>
        <p className="mt-2 text-base text-ink-700">Scan to read about the book, find the launch and buy a copy.</p>
        <div
          role="img"
          aria-label={`QR code linking to ${siteUrl}`}
          className="mt-8 w-full max-w-sm rounded-card bg-white p-4 qr"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <p className="mt-4 text-lg font-semibold text-ink-900">{siteUrl.replace(/^https?:\/\//, "")}</p>
        <PrintButton />
        <p className="mt-4 max-w-md text-sm text-ink-500">
          For banners, save this page as a PDF and send it to the printer. The code stays sharp at any size.
        </p>
      </div>
    </section>
  );
}
