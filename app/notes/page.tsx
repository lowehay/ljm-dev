import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { site } from "../site";
import PostList from "./PostList";

export const metadata: Metadata = {
  title: `Notes — ${site.name}`,
  description: "Short write-ups of real problems I ran into while building, and how I solved them.",
  alternates: { canonical: "/notes" },
};

export default function NotesIndex() {
  return (
    <main className="max-w-2xl w-full mx-auto px-6 py-12 space-y-10 text-fg-soft">
      <Link href="/" className="inline-flex items-center gap-1.5 py-1 text-xs font-mono text-muted hover:text-fg transition group">
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>home</span>
      </Link>

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">Notes</h1>
        <p className="text-base leading-relaxed">
          Short write-ups of real problems I ran into while building, what I tried, and what actually worked.
        </p>
      </header>

      <PostList />
    </main>
  );
}
