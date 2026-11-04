"use client";

import { useActionState } from "react";
import StatusMark from "./StatusMark/StatusMark";
import { sendContactMessage, type ContactState } from "../actions/contact";
import { site } from "../site";

const INPUT_CLASS =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted/70 outline-none transition focus:border-line-strong";

const initialState: ContactState = { status: "idle", message: "" };

// `defaultMessage` pre-fills the message (the project scoper uses it); `source` labels the email's subject
export default function ContactForm({
  defaultMessage = "",
  source = "form",
  submitLabel = "Send message",
}: {
  defaultMessage?: string;
  source?: "form" | "scoper";
  submitLabel?: string;
}) {
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
          // A new pre-filled message (the scoper's choices changed) replaces the text; name and email stay
          key={defaultMessage}
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={defaultMessage ? 9 : 4}
          placeholder="What are you looking to build?"
          defaultValue={values?.message ?? defaultMessage}
          className={`${INPUT_CLASS} resize-y`}
        />
      </label>

      {/* Spam trap: hidden from people and screen readers, but bots tend to fill it */}
      <input type="hidden" name="source" value={source} />
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent text-canvas text-xs font-mono font-medium hover:opacity-80 transition disabled:opacity-50"
        >
          {/* Idle ring, then a spinning arc while sending, then a check (or a cross if it failed) */}
          <StatusMark
            status={pending ? "running" : state.status === "sent" ? "done" : state.status === "error" ? "failed" : "pending"}
            size={14}
            strokeWidth={1.75}
            doneColor="currentColor"
            errorColor="currentColor"
          />
          <span>{pending ? "Sending..." : state.status === "sent" ? "Sent" : submitLabel}</span>
        </button>
        <p aria-live="polite" className={`text-xs font-mono ${state.status === "error" ? "text-fg" : "text-muted"}`}>
          {/* Before anything is sent, the reply-time promise sits where the status will appear */}
          {state.message || `I reply ${site.replyWithin}.`}
        </p>
      </div>
    </form>
  );
}
