import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { site } from "../site";
import { hobbies } from "../data";
import { formatDate } from "../notes/posts";
import { now } from "./now";
import GitHubActivity from "./GitHubActivity";

export const metadata: Metadata = {
  title: `Now — ${site.name}`,
  description: "What I'm working on, writing, and focusing on at the moment.",
  alternates: { canonical: "/now" },
};

// A "now page" (nownownow.com): a short, dated snapshot of what I'm up to, updated every month or so
export default function NowPage() {
  return (
    <main className="max-w-2xl w-full mx-auto px-6 py-12 space-y-10 text-fg-soft">
      <Link href="/" className="inline-flex items-center gap-1.5 py-1 text-xs font-mono text-muted hover:text-fg transition group">
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>home</span>
      </Link>

      <header className="space-y-3">
        <p className="text-xs font-mono text-muted">
          Updated <time dateTime={now.updated}>{formatDate(now.updated)}</time> · {now.location}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">What I&apos;m doing now</h1>
        <p className="text-base leading-relaxed">A snapshot of what has my attention this month.</p>
      </header>

      <dl className="divide-y divide-line border-y border-line">
        {now.items.map((item) => (
          <div key={item.label} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
            <dt className="text-xs font-mono text-muted pt-0.5">{item.label}</dt>
            <dd className="text-sm sm:text-[15px] leading-relaxed">{item.text}</dd>
          </div>
        ))}
        <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
          <dt className="text-xs font-mono text-muted pt-0.5">Off the clock</dt>
          <dd className="text-sm sm:text-[15px] leading-relaxed">{hobbies.charAt(0).toUpperCase() + hobbies.slice(1)}</dd>
        </div>
      </dl>

      <GitHubActivity />

      <footer className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted">
        <span>Have a project in mind?</span>
        <div className="flex gap-5">
          <Link href="/scope" className="flex items-center gap-1 py-1 text-fg hover:opacity-80 transition group">
            <span>scope it</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link href="/#contact" className="flex items-center gap-1 py-1 hover:text-fg transition group">
            <span>get in touch</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </footer>
    </main>
  );
}
