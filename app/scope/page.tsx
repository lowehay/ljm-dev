import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { site } from "../site";
import Scoper from "./Scoper";

export const metadata: Metadata = {
  title: `Scope your project — ${site.name}`,
  description: "Pick what you want to build and what it needs, get a rough timeline, and send it to me in one click.",
  alternates: { canonical: "/scope" },
};

// Sending through the form needs RESEND_API_KEY (see app/actions/contact.ts); without it the scoper offers email instead
const canSend = Boolean(process.env.RESEND_API_KEY);

export default function ScopePage() {
  return (
    <main className="max-w-5xl w-full mx-auto px-6 py-12 space-y-10 text-fg-soft">
      <Link href="/" className="inline-flex items-center gap-1.5 py-1 text-xs font-mono text-muted hover:text-fg transition group">
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>home</span>
      </Link>

      <header className="space-y-3 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">Scope your project</h1>
        <p className="text-base leading-relaxed">
          Tell me what you want to build and get a rough timeline in a few clicks. When it looks right, send it to me and
          I&apos;ll reply with next steps.
        </p>
      </header>

      <Scoper canSend={canSend} />
    </main>
  );
}
