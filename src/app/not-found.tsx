import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page py-24">
      <h1 className="text-5xl text-ink-900">This page could not be found</h1>
      <p className="mt-4 max-w-prose text-base text-ink-700">The link may be old or mistyped. The home page has the book, the launch details and where to buy.</p>
      <Link href="/" className="btn btn-primary mt-8">Go to the home page</Link>
    </section>
  );
}
