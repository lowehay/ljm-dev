import Link from "next/link";
import { Plus } from "lucide-react";
import Section from "./Section";
import { faqs } from "../data";

// "project scoper" in an answer becomes a link to it
function withScoperLink(text: string) {
  const parts = text.split("project scoper");
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <Link key={i} href="/scope" className="text-fg underline underline-offset-4 decoration-line-strong hover:decoration-fg transition">
            project scoper
          </Link>,
          part,
        ]
  );
}

// Client questions, answered before they have to ask. Native <details>, so it works without JavaScript.
export default function Faq() {
  return (
    <Section id="faq" index="06" title="FAQ" className="space-y-2">
      <div className="divide-y divide-line border-b border-line lg:border-t-0">
        {faqs.map((f) => (
          <details key={f.q} className="group py-1 lg:first:-mt-3">
            <summary className="flex items-center justify-between gap-4 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-base font-semibold text-fg hover:opacity-80 transition">
              {f.q}
              <Plus className="w-4 h-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45" />
            </summary>
            <p className="pb-4 pr-8 text-sm text-muted leading-relaxed">{withScoperLink(f.a)}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
