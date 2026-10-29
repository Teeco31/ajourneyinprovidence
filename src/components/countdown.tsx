"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number };

function split(ms: number): Parts {
  const total = Math.max(0, Math.floor(ms / 60000));
  return { days: Math.floor(total / 1440), hours: Math.floor((total % 1440) / 60), minutes: total % 60 };
}

export function Countdown({ target, end, label }: { target: string; end: string; label: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  const start = new Date(target).getTime();
  const finish = new Date(end).getTime();
  const state = now === null ? "loading" : now < start ? "before" : now <= finish ? "live" : "after";
  const parts = state === "before" && now !== null ? split(start - now) : null;

  return (
    <div className="rounded-card bg-white p-4 shadow-raised">
      <p className="label-caps">{label}</p>
      {state === "before" && parts ? (
        <p className="mt-2 flex gap-6 font-display text-4xl text-ink-900 tabular" aria-label={`${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes to go`}>
          <span>{parts.days}<span className="ml-1 text-sm font-sans font-semibold text-ink-500">days</span></span>
          <span>{parts.hours}<span className="ml-1 text-sm font-sans font-semibold text-ink-500">hrs</span></span>
          <span>{parts.minutes}<span className="ml-1 text-sm font-sans font-semibold text-ink-500">min</span></span>
        </p>
      ) : state === "live" ? (
        <p className="mt-2 font-display text-4xl text-ink-900">Happening now</p>
      ) : state === "after" ? (
        <p className="mt-2 font-display text-4xl text-ink-900">Thank you for joining us</p>
      ) : (
        <p className="mt-2 font-display text-4xl text-ink-900 tabular" aria-hidden="true">&nbsp;</p>
      )}
    </div>
  );
}
