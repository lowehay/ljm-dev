"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import StatusMark from "./StatusMark/StatusMark";
import { sendContactMessage, type ContactState } from "../actions/contact";
import { site } from "../site";

type Message = { role: "user" | "model"; text: string };

const INPUT_CLASS =
  "w-full min-w-0 rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-sm text-fg placeholder:text-muted/70 outline-none transition focus:border-line-strong";

// The contact form allows 5,000 characters; keep the newest part of a long chat and leave room for a note
function transcript(messages: Message[], limit = 4200) {
  const lines = messages.map((m) => `${m.role === "user" ? "Visitor" : "AI"}: ${m.text}`);
  let text = lines.join("\n\n");
  while (text.length > limit && lines.length > 1) {
    lines.shift();
    text = `(earlier messages left out)\n\n${lines.join("\n\n")}`;
  }
  return text.slice(-limit);
}

const initialState: ContactState = { status: "idle", message: "" };

// Shown in the chat once it has answered something: the visitor leaves their email and the whole
// conversation goes to Louie through the contact form, so an interested visitor doesn't have to retype it.
export default function ChatHandoff({ messages, canSend }: { messages: Message[]; canSend: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const conversation = transcript(messages);
  const formRef = useRef<HTMLFormElement>(null);

  // The form opens below the chat's visible area; bring it into view and put the cursor in the name field
  useEffect(() => {
    if (!open) return;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    formRef.current?.querySelector<HTMLInputElement>("input[name=name]")?.focus({ preventScroll: true });
  }, [open]);

  if (state.status === "sent") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-xs text-fg-soft">
        <StatusMark status="done" size={14} strokeWidth={1.75} doneColor="currentColor" />
        Sent. Louie will reply to you by email{`, ${site.replyWithin}`}.
      </div>
    );
  }

  if (!canSend) {
    // No email service set up: hand the conversation to the visitor's own mail app instead
    const body = `Hi Louie, I was chatting with the assistant on your site:\n\n${conversation.slice(-1500)}\n\n`;
    return (
      <a
        href={`mailto:${site.email}?subject=${encodeURIComponent("Question from your portfolio chat")}&body=${encodeURIComponent(body)}`}
        className="flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-xs text-fg-soft hover:border-line-strong hover:text-fg transition"
      >
        <Send className="w-3.5 h-3.5" />
        Email this conversation to Louie
      </a>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 rounded-xl border border-dashed border-line-strong px-3 py-2.5 text-left text-xs text-fg-soft hover:border-fg hover:text-fg transition"
      >
        <Send className="w-3.5 h-3.5 shrink-0" />
        <span>
          <span className="text-fg font-medium">Want a real answer from Louie?</span> Send him this conversation.
        </span>
      </button>
    );
  }

  const values = state.values;
  return (
    <form ref={formRef} action={formAction} className="space-y-2 rounded-xl border border-line p-3">
      <p className="text-xs text-fg-soft">
        Louie gets this conversation and replies to your email{`, ${site.replyWithin}`}.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <input name="name" required maxLength={100} autoComplete="name" placeholder="Name" aria-label="Your name" defaultValue={values?.name} className={INPUT_CLASS} />
        <input
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          placeholder="Email"
          aria-label="Your email"
          defaultValue={values?.email}
          className={INPUT_CLASS}
        />
      </div>
      <input name="note" maxLength={600} placeholder="Anything to add? (optional)" aria-label="Note for Louie" className={INPUT_CLASS} />
      {/* The message is the conversation plus the note, assembled when the form is submitted */}
      <input type="hidden" name="conversation" value={conversation} />
      <input type="hidden" name="source" value="chat" />
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fg text-canvas text-xs font-medium hover:opacity-85 transition disabled:opacity-50"
        >
          <StatusMark
            status={pending ? "running" : state.status === "error" ? "failed" : "pending"}
            size={13}
            strokeWidth={1.75}
            doneColor="currentColor"
            errorColor="currentColor"
          />
          {pending ? "Sending..." : "Send to Louie"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-muted hover:text-fg transition">
          Cancel
        </button>
      </div>
      {state.status === "error" && <p className="text-xs text-fg">{state.message}</p>}
    </form>
  );
}
