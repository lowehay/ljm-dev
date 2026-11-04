"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Send } from "lucide-react";
import ContactForm from "../components/ContactForm";
import { site } from "../site";
import { deadlines, designOptions, features, projectTypes, type Range } from "./scope-config";

const add = (a: Range, b: Range): Range => [a[0] + b[0], a[1] + b[1]];
const formatWeeks = ([lo, hi]: Range) => {
  const [a, b] = [Math.ceil(lo), Math.ceil(hi)];
  return a === b ? `${a} week${a === 1 ? "" : "s"}` : `${a}–${b} weeks`;
};

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="flex items-baseline gap-3">
        <span className="text-xs font-mono text-muted">0{n}</span>
        <span className="text-base font-semibold text-fg tracking-tight">{title}</span>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

// A selectable card or chip; `selected` draws the filled state
function Option({
  selected,
  onClick,
  disabled,
  role,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  role: "radio" | "checkbox";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={`relative text-left rounded-xl border transition disabled:opacity-40 ${
        selected ? "border-fg bg-surface text-fg" : "border-line text-fg-soft hover:border-line-strong hover:text-fg"
      } ${className}`}
    >
      {children}
    </button>
  );
}

// Interactive project scoper: pick what you're building and what it needs, get a rough timeline,
// and send the summary to Louie through the contact form, already filled in.
export default function Scoper({ canSend }: { canSend: boolean }) {
  const [typeKey, setTypeKey] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [designKey, setDesignKey] = useState("rough");
  const [deadlineKey, setDeadlineKey] = useState("flexible");
  const [sending, setSending] = useState(false);

  const type = projectTypes.find((t) => t.key === typeKey);
  const design = designOptions.find((d) => d.key === designKey)!;
  const deadline = deadlines.find((d) => d.key === deadlineKey)!;
  // Features already part of the chosen project type don't add time
  const extras = features.filter((f) => picked.includes(f.key) && !(typeKey && f.includedIn.includes(typeKey)));

  const estimate = type ? extras.reduce((sum, f) => add(sum, f.weeks), add(type.weeks, design.weeks)) : null;
  const tight = estimate && deadline.weeks !== null && deadline.weeks < Math.ceil(estimate[0]);

  const toggle = (key: string) => setPicked((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));

  const summary = type
    ? [
        "Hi Louie, here's my project from your scoper:",
        "",
        `• Building: ${type.name}`,
        `• Needs: ${extras.length ? extras.map((f) => f.name).join(", ") : "nothing extra"}`,
        `• Design: ${design.name}`,
        `• Timing: ${deadline.name}`,
        `• Your rough estimate: ${formatWeeks(estimate!)}`,
        "",
        "A bit more about it: ",
      ].join("\n")
    : "";

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_18rem] lg:gap-12">
      <div className="space-y-9">
        <Step n={1} title="What are you building?">
          <div role="radiogroup" aria-label="Project type" className="grid gap-3 sm:grid-cols-2">
            {projectTypes.map((t) => (
              <Option key={t.key} role="radio" selected={typeKey === t.key} onClick={() => setTypeKey(t.key)} className="p-4">
                <span className="block text-sm font-semibold">{t.name}</span>
                <span className="block mt-1 text-xs text-muted leading-relaxed">{t.desc}</span>
                <span className="block mt-2 text-[11px] font-mono text-muted">from {formatWeeks(t.weeks)}</span>
                {typeKey === t.key && <Check className="absolute top-3 right-3 w-4 h-4" />}
              </Option>
            ))}
          </div>
        </Step>

        <Step n={2} title="What does it need?" hint="pick any">
          <div className="flex flex-wrap gap-2">
            {features.map((f) => {
              const included = Boolean(typeKey && f.includedIn.includes(typeKey));
              const on = picked.includes(f.key) || included;
              return (
                <Option
                  key={f.key}
                  role="checkbox"
                  selected={on}
                  disabled={included}
                  onClick={() => toggle(f.key)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full"
                >
                  {on && <Check className="w-3.5 h-3.5" />}
                  {f.name}
                  {included && <span className="text-[11px] font-mono text-muted">included</span>}
                </Option>
              );
            })}
          </div>
        </Step>

        <Step n={3} title="Do you have a design?">
          <div role="radiogroup" aria-label="Design" className="flex flex-wrap gap-2">
            {designOptions.map((d) => (
              <Option
                key={d.key}
                role="radio"
                selected={designKey === d.key}
                onClick={() => setDesignKey(d.key)}
                className="px-3 py-1.5 text-sm rounded-full"
              >
                {d.name}
              </Option>
            ))}
          </div>
        </Step>

        <Step n={4} title="When do you need it?">
          <div role="radiogroup" aria-label="Deadline" className="flex flex-wrap gap-2">
            {deadlines.map((d) => (
              <Option
                key={d.key}
                role="radio"
                selected={deadlineKey === d.key}
                onClick={() => setDeadlineKey(d.key)}
                className="px-3 py-1.5 text-sm rounded-full"
              >
                {d.name}
              </Option>
            ))}
          </div>
        </Step>
      </div>

      {/* Estimate: sticky beside the steps on wide screens, after them on phones */}
      <aside className="lg:sticky lg:top-24 lg:self-start" aria-live="polite">
        <div className="rounded-2xl border border-line bg-surface/70 p-5 space-y-4">
          <p className="text-xs font-mono text-muted">Rough timeline</p>
          {estimate ? (
            <>
              <p className="text-3xl font-bold tracking-tight text-fg">{formatWeeks(estimate)}</p>
              <ul className="space-y-1.5 text-xs text-muted">
                <li className="flex justify-between gap-3">
                  <span>{type!.name}</span>
                  <span className="font-mono shrink-0">{formatWeeks(type!.weeks)}</span>
                </li>
                {extras.map((f) => (
                  <li key={f.key} className="flex justify-between gap-3">
                    <span>+ {f.name}</span>
                    <span className="font-mono shrink-0">{formatWeeks(f.weeks)}</span>
                  </li>
                ))}
                {design.weeks[1] > 0 && (
                  <li className="flex justify-between gap-3">
                    <span>+ Design</span>
                    <span className="font-mono shrink-0">{formatWeeks(design.weeks)}</span>
                  </li>
                )}
              </ul>
              {tight && (
                <p className="text-xs text-fg-soft leading-relaxed border-t border-line pt-3">
                  That&apos;s shorter than the estimate. A smaller first version that grows after launch usually fits, so
                  let&apos;s talk about what matters most.
                </p>
              )}
              <p className="text-[11px] text-muted leading-relaxed border-t border-line pt-3">
                A first estimate, not a quote. I&apos;ll confirm the timeline and price after a short chat about your project.
                {` I reply ${site.replyWithin}.`}
              </p>
              {canSend ? (
                <button
                  type="button"
                  onClick={() => setSending(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-fg text-canvas text-sm font-medium hover:opacity-85 transition"
                >
                  <Send className="w-4 h-4" />
                  Send this to Louie
                </button>
              ) : (
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent("Project scope")}&body=${encodeURIComponent(summary)}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-fg text-canvas text-sm font-medium hover:opacity-85 transition"
                >
                  <Send className="w-4 h-4" />
                  Email this to Louie
                </a>
              )}
            </>
          ) : (
            <p className="text-sm text-muted leading-relaxed">Pick what you&apos;re building to see a rough timeline.</p>
          )}
        </div>
      </aside>

      <AnimatePresence>
        {sending && type && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onAnimationStart={() =>
              document.getElementById("scope-send")?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            id="scope-send"
            className="lg:col-span-2 space-y-3 border-t border-line pt-8 scroll-mt-24"
          >
            <h2 className="text-base font-semibold text-fg tracking-tight">Send it over</h2>
            <p className="text-sm text-muted">Your choices are filled in below. Add anything else that helps, then send.</p>
            <ContactForm defaultMessage={summary} source="scoper" submitLabel="Send to Louie" />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
