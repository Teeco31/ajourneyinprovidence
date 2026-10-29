"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type NavLink = { href: string; label: string };

export function SiteHeader({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-sky-100 border-b border-sky-200">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/#top" className="font-display text-2xl text-ink-900 min-h-11 inline-flex items-center">
          A Journey in <span className="ml-2 text-gold-700">Providence</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center rounded-control px-3 text-sm font-semibold text-ink-700 hover:bg-sky-200">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="btn btn-secondary md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav id="mobile-menu" aria-label="Primary" className="bg-white md:hidden">
          <ul className="container-page py-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center text-base font-semibold text-ink-900 hover:text-gold-700"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
