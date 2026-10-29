"use client";

import { useId } from "react";
import type { FormState } from "./use-form-submit";

export function Field({
  label,
  name,
  type = "text",
  required = false,
  optional = false,
  autoComplete,
  inputMode,
  textarea = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  textarea?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-ink-900">
        {label}
        {optional ? <span className="font-normal text-ink-500"> (optional)</span> : null}
      </label>
      {textarea ? (
        <textarea id={id} name={name} required={required} rows={5} className="field" />
      ) : (
        <input id={id} name={name} type={type} required={required} autoComplete={autoComplete} inputMode={inputMode} className="field" />
      )}
    </div>
  );
}

/** Hidden field that real people never fill in. Bots do. Formspree discards submissions where `_gotcha` has a value. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-96 h-0 w-0 overflow-hidden">
      <label>
        Leave this empty
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormStatus({ state, successText, fallbackEmail }: { state: FormState; successText: string; fallbackEmail: string }) {
  return (
    <div aria-live="polite" role="status">
      {state === "sent" ? (
        <p className="rounded-control bg-success-100 p-4 text-sm font-semibold text-success-600">{successText}</p>
      ) : null}
      {state === "error" ? (
        <p className="rounded-control bg-danger-100 p-4 text-sm font-semibold text-danger-600">
          Your message did not send. Your details are still here, so you can try again
          {fallbackEmail ? `, or write to ${fallbackEmail}` : ""}.
        </p>
      ) : null}
    </div>
  );
}
