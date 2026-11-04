import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Section from "./Section";
import PostList from "../notes/PostList";

// The latest notes on the homepage, linking to /notes for the rest
export default function Notes() {
  return (
    <Section id="notes" index="05" title="Notes" className="space-y-4">
      <p className="text-sm text-muted leading-relaxed">
        Short write-ups of real problems I ran into while building, and how I solved them.
      </p>
      <PostList limit={3} />
      <Link href="/notes" className="inline-flex items-center gap-1.5 py-1 text-xs font-mono text-muted hover:text-fg transition group">
        <span>all notes</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </Section>
  );
}
