import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="max-w-sm w-full space-y-6">
        <p className="text-xs font-mono uppercase tracking-wider text-muted">
          <span className="text-accent">404</span> — Not found
        </p>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-fg">
            This page doesn&apos;t exist.
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            The link may be broken, or the page may have moved. Everything worth seeing is on the homepage.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent text-canvas text-xs font-mono font-medium hover:opacity-80 transition group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back home</span>
        </Link>
      </div>
    </main>
  );
}
