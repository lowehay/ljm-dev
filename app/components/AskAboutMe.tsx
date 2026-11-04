"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { site } from "../site";
import { OPEN_ASK_EVENT } from "./events";
import PromptBar from "./PromptBar/PromptBar";
import LatticeLoader from "./LatticeLoader/LatticeLoader";

type Message = { role: "user" | "model"; text: string };

const SUGGESTIONS = ["What does Louie build?", "Has he worked with AI?", "What's his tech stack?", "Is he available for work?"];

// The "/" menu in the prompt bar: ready-made questions that send straight away
const COMMANDS = [
  { key: "build", name: "/build", description: "What he builds", prompt: "What does Louie build?" },
  { key: "stack", name: "/stack", description: "Languages and tools", prompt: "What's his tech stack?" },
  { key: "ai", name: "/ai", description: "AI work", prompt: "Has he worked with AI?" },
  { key: "projects", name: "/projects", description: "Featured projects", prompt: "What are his best projects?" },
  { key: "hire", name: "/hire", description: "Availability and contact", prompt: "Is he available for work, and how do I reach him?" },
];


// Floating "Ask about me" chat. Answers come from Gemini via /api/ask, limited to the site's own content.
export default function AskAboutMe() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  // The button shows its label for a few seconds after load, then shrinks to an icon
  const [intro, setIntro] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);

  // Escape closes the chat wherever focus is (the prompt bar stops it first when one of its menus is open)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !e.defaultPrevented && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => setIntro(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_ASK_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ASK_EVENT, onOpen);
  }, []);

  // Keep the newest message in view
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  const ask = async (question: string) => {
    const text = question.trim().slice(0, 500);
    if (!text || pending) return;
    // Only the latest turns are sent, matching the server's limit
    const next: Message[] = [...messages, { role: "user" as const, text }].slice(-12);
    setMessages(next);
    setError("");
    setPending(true);
    controller.current = new AbortController();
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: controller.current.signal,
      });
      const data = await res.json();
      if (!res.ok || !data.reply) throw new Error(data.error ?? "Something went wrong.");
      setMessages([...next, { role: "model", text: data.reply }]);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // Stopped by the visitor: drop the unanswered question so the chat stays in turn order
        setMessages(messages);
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex flex-col print:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Ask about Louie"
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            style={{ transformOrigin: "bottom right" }}
            className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-96 flex flex-col max-h-[70vh] rounded-2xl border border-line bg-canvas/85 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-line">
              <div>
                <p className="text-sm font-semibold text-fg">Ask about me</p>
                <p className="text-[11px] font-mono text-muted">AI answers from this site · may be wrong</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="p-1.5 text-muted hover:text-fg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm" aria-live="polite">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-muted leading-relaxed">
                    Hi! Ask me anything about Louie&apos;s work, skills, or how to hire him.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => ask(s)}
                        className="px-2.5 py-1 rounded-full border border-line text-xs text-fg-soft hover:border-line-strong hover:text-fg transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
                  <p
                    className={`max-w-[85%] whitespace-pre-wrap leading-relaxed rounded-2xl px-3 py-2 ${
                      m.role === "user" ? "bg-fg text-canvas rounded-br-sm" : "bg-surface text-fg-soft rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              ))}

              {/* Runs while Gemini answers; on a failure it freezes into a cross with how long it took */}
              {(pending || error) && (
                <div className="space-y-2">
                  {/* flex, so the inline loader isn't placed on a text baseline with extra line height above it */}
                  <div className="flex items-center px-3 py-2.5 w-fit rounded-2xl rounded-bl-sm bg-surface text-muted">
                    <LatticeLoader
                      status={pending ? "working" : "error"}
                      label="Thinking"
                      errorLabel="Failed after"
                      pattern="orbit"
                      fontSize={13}
                      cellSize={5}
                      gap={2}
                      errorColor="var(--color-fg)"
                      idleOpacity={0.2}
                    />
                  </div>
                  {error && !pending && (
                    <p className="text-xs text-muted">
                      {error}{" "}
                      <a href={`mailto:${site.email}`} className="text-fg underline underline-offset-2">
                        Email Louie
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-line">
              <PromptBar
                autoFocus
                placeholder="Ask about Louie..."
                hint="/ for ideas"
                maxLength={500}
                sources={[]}
                commands={COMMANDS}
                models={[]}
                efforts={[]}
                busy={pending}
                onSend={(text) => ask(text)}
                onStop={() => controller.current?.abort()}
                background="var(--color-surface)"
                color="var(--color-fg)"
                menuBackground="var(--color-surface)"
                borderColor="var(--color-line)"
                width={1000}
                radius={14}
                maxRows={4}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => {
          setIntro(false);
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Ask about me"}
        data-expanded={intro && !open ? "" : undefined}
        className="group ml-auto flex items-center h-12 pl-3.5 pr-3.5 rounded-full bg-fg text-canvas shadow-lg shadow-black/25 ring-1 ring-fg/10 hover:scale-[1.04] active:scale-95 transition-transform duration-200"
      >
        {/* The label slides out on hover (and briefly on load); the button is a plain circle otherwise */}
        <span
          className={`grid overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300 ease-out ${
            open
              ? "grid-cols-[0fr] opacity-0"
              : "grid-cols-[0fr] opacity-0 group-hover:grid-cols-[1fr] group-hover:opacity-100 group-hover:mr-2 group-focus-visible:grid-cols-[1fr] group-focus-visible:opacity-100 group-focus-visible:mr-2 group-data-[expanded]:grid-cols-[1fr] group-data-[expanded]:opacity-100 group-data-[expanded]:mr-2"
          }`}
        >
          <span className="min-w-0">Ask about me</span>
        </span>
        <span className="relative w-5 h-5">
          <Sparkles
            className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
              open ? "opacity-0 rotate-90 scale-50" : "opacity-100 group-hover:rotate-12"
            }`}
          />
          <X
            className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
              open ? "opacity-100 rotate-0" : "opacity-0 -rotate-90 scale-50"
            }`}
          />
        </span>
      </button>
    </div>
  );
}
