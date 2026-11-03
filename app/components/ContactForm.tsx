"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { sendContactMessage, type ContactState } from "../actions/contact";

const INPUT_CLASS =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted/70 outline-none transition focus:border-line-strong";

const initialState: ContactState = { status: "idle", message: "" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  // After an error, React resets the form to these defaults, so what the visitor typed comes back
  const values = state.values;

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-mono text-muted">Name</span>
          <input name="name" required maxLength={100} autoComplete="name" defaultValue={values?.name} className={INPUT_CLASS} />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-mono text-muted">Email</span>
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            defaultValue={values?.email}
            className={INPUT_CLASS}
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-mono text-muted">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={4}
          placeholder="What are you looking to build?"
          defaultValue={values?.message}
          className={`${INPUT_CLASS} resize-y`}
        />
      </label>

      {/* Spam trap: hidden from people and screen readers, but bots tend to fill it */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent text-canvas text-xs font-mono font-medium hover:opacity-80 transition disabled:opacity-50 group"
        >
          <span>{pending ? "Sending..." : "Send message"}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
        <p aria-live="polite" className={`text-xs font-mono ${state.status === "error" ? "text-fg" : "text-muted"}`}>
          {state.message}
        </p>
      </div>
    </form>
  );
}
