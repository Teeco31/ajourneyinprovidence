"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Wave } from "./wave";

export type NavLink = { href: string; label: string };

const FOCUSABLE = "a[href], button:not([disabled])";

export function SiteHeader({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = (returnFocus = false) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  };

  // Menu open: lock page scroll, move focus into the panel, keep Tab inside it, close on Escape or when the screen widens.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close(true);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onWide = () => mq.matches && close();

    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-sky-200 bg-sky-100">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link href="/#top" className="inline-flex min-h-11 flex-col justify-center leading-none text-ink-900">
          <span className="text-xs font-semibold uppercase tracking-widest md:hidden">A Journey in</span>
          <span className="font-display text-3xl md:text-2xl">
            <span className="hidden md:inline">A Journey in </span>
            <span className="text-gold-700">Providence</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center rounded-control px-3 text-sm font-semibold text-ink-700 hover:bg-sky-200">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/#buy" className="btn btn-primary min-h-11 px-4 py-2 text-sm">
            Buy
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-control bg-ink-900 text-white transition-colors duration-150 hover:bg-ink-700"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 8h16M4 16h10" />
            </svg>
          </button>
        </div>
      </div>

      {/* Full-screen menu for phones. Slides down; moves transform only, so it stays smooth on cheap devices. */}
      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex h-dvh flex-col bg-ink-900 text-white transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container-page flex h-16 shrink-0 items-center justify-between">
          <p className="font-display text-3xl">
            A Journey in <span className="text-gold-500">Providence</span>
          </p>
          <button
            ref={closeRef}
            type="button"
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-control bg-white text-ink-900 transition-colors duration-150 hover:bg-sky-100"
            aria-label="Close menu"
            onClick={() => close(true)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav aria-label="Primary" className="container-page flex min-h-0 flex-1 flex-col overflow-y-auto py-4">
          <ol className="my-auto">
            {links.map((l, i) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => close()}
                  className="group flex min-h-12 items-baseline gap-4 py-1 transition-colors duration-150 hover:text-gold-500"
                >
                  <span className="w-6 text-xs font-semibold tabular text-gold-500">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display menu-link-size">{l.label}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="shrink-0 bg-sky-100 text-ink-900">
          <Wave className="-mt-px rotate-180 text-ink-900" />
          <div className="container-page flex items-center gap-4 pb-6 pt-2">
            <Image src="/images/cover-800.webp" alt="" width={800} height={1071} sizes="5rem" className="h-auto w-20 shrink-0 shadow-raised" />
            <div className="flex flex-1 flex-col gap-2">
              <Link href="/#buy" onClick={() => close()} className="btn btn-primary">
                Buy the book
              </Link>
              <Link href="/#launch" onClick={() => close()} className="btn btn-secondary">
                Attend the launch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
