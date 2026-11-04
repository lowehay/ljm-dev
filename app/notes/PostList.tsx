import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate, posts } from "./posts";

// The list of notes, used on /notes and in the homepage's Notes section
export default function PostList({ limit }: { limit?: number }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {posts.slice(0, limit).map((post) => (
        <li key={post.slug}>
          <Link href={`/notes/${post.slug}`} className="group block py-5 space-y-1.5">
            <p className="text-xs font-mono text-muted">
              <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readMinutes} min read
            </p>
            <h2 className="flex items-start gap-1.5 text-base font-semibold text-fg tracking-tight">
              <span className="group-hover:underline underline-offset-4 decoration-line-strong">{post.title}</span>
              <ArrowUpRight className="w-4 h-4 mt-0.5 shrink-0 text-muted group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </h2>
            <p className="text-sm text-muted leading-relaxed">{post.summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
