"use client";

import { useState } from "react";

export type FormState = "idle" | "sending" | "sent" | "error";

/** Posts a form to a Formspree-style endpoint. Keeps what the user typed if sending fails. */
export function useFormSubmit(endpoint: string) {
  const [state, setState] = useState<FormState>("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setState("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return { state, submit };
}
