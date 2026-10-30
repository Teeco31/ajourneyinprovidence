"use client";

import { useId } from "react";
import type { FormState } from "./use-form-submit";

type FieldProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "number";
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  textarea?: boolean;
  hint?: string;
  defaultValue?: string | number;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  title?: string;
};

/** Label above the input, hint under it. Browser validation reports problems using the title or the built-in message. */
export function Field({ label, name, type = "text", required = false, optional = false, hint, textarea = false, ...rest }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const common = { id, name, required, "aria-describedby": hint ? hintId : undefined, className: "field" };
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-ink-900">
        {label}
        {optional ? <span className="font-normal text-ink-500"> (optional)</span> : null}
      </label>
      {textarea ? (
        <textarea {...common} rows={5} minLength={rest.minLength} maxLength={rest.maxLength} defaultValue={rest.defaultValue} />
      ) : (
        <input {...common} type={type} {...rest} />
      )}
      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
}: {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-ink-900">
        {label}
      </label>
      <select id={id} name={name} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="field">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
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

export function FormStatus({
  state,
  successText,
  fallbackEmail,
  errorMessage,
}: {
  state: FormState;
  successText: string;
  fallbackEmail: string;
  errorMessage?: string;
}) {
  return (
    <div aria-live="polite" role="status">
      {state === "sent" ? (
        <p className="rounded-control bg-success-100 p-4 text-sm font-semibold text-success-600">{successText}</p>
      ) : null}
      {state === "error" ? (
        <p className="rounded-control bg-danger-100 p-4 text-sm font-semibold text-danger-600">
          {errorMessage ? `Error: ${errorMessage}. ` : "Your message did not send. "}
          Your details are still here, so you can try again
          {fallbackEmail ? `, or write to ${fallbackEmail}` : ""}.
        </p>
      ) : null}
    </div>
  );
}

/**
 * Rules shared by both forms, so they accept the same shapes of input.
 * Browsers compile `pattern` in strict mode, where ( and ) inside [ ] must be escaped, or the rule is silently ignored.
 */
export const rules = {
  name: { maxLength: 100, pattern: ".*\\S.*", title: "Enter your full name" },
  email: { maxLength: 254 },
  phone: { maxLength: 20, pattern: "[0-9+\\(\\)\\s\\-]{7,20}", title: "Use digits, spaces, + or -. For example +234 800 000 0000" },
  organisation: { maxLength: 120 },
  message: { minLength: 10, maxLength: 2000 },
} as const;
