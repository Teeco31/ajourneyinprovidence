"use client";

import { useState } from "react";

export type FormState = "idle" | "sending" | "sent" | "error";

/** Posts a form to a Formspree endpoint via AJAX. Keeps what the user typed if sending fails. */
export function useFormSubmit(endpoint: string) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setState("sending");
    setErrorMessage("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (!res.ok) {
        let msg = "";
        try {
          const data = (await res.json()) as { errors?: { field?: string; message?: string }[]; error?: string };
          if (data?.errors && Array.isArray(data.errors)) {
            msg = data.errors.map((err) => (err.field ? `${err.field}: ${err.message}` : err.message)).join(", ");
          } else if (data?.error) {
            msg = data.error;
          }
        } catch {
          // Non-JSON response
        }
        setErrorMessage(msg);
        throw new Error(msg || String(res.status));
      }

      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return { state, errorMessage, submit };
}
