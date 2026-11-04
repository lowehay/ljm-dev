import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { site } from "../../site";
import { formatDate, getPost, posts } from "../posts";
import { bodies } from "../bodies";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} — ${site.name}`,
    description: post.summary,
    alternates: { canonical: `/notes/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.summary, publishedTime: post.date },
  };
}

// The frame (back link, footer) doesn't depend on which note it is, so it renders instantly on navigation;
// the note itself reads the URL, so it sits in a Suspense boundary (prerendered for every known slug)
export default function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main className="max-w-2xl w-full mx-auto px-6 py-12 space-y-10 text-fg-soft">
      <Link href="/notes" className="inline-flex items-center gap-1.5 py-1 text-xs font-mono text-muted hover:text-fg transition group">
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>all notes</span>
      </Link>

      <Suspense fallback={<NoteSkeleton />}>
        <Note params={params} />
      </Suspense>

      <footer className="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted">
        <span>Have a problem like this in your project?</span>
        <Link href="/#contact" className="flex items-center gap-1 py-1 text-fg hover:opacity-80 transition group">
          <span>get in touch</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </footer>
    </main>
  );
}

function NoteSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-hidden="true">
      <div className="h-3 w-40 rounded bg-surface" />
      <div className="h-9 w-4/5 rounded bg-surface" />
      <div className="h-4 w-full rounded bg-surface" />
      <div className="h-4 w-2/3 rounded bg-surface" />
    </div>
  );
}

async function Note({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const Body = bodies[slug];
  if (!post || !Body) notFound();

  const others = posts.filter((p) => p.slug !== slug);

  return (
    <>
      <header className="space-y-4">
        <p className="text-xs font-mono text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readMinutes} min read
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">{post.title}</h1>
        <p className="text-base leading-relaxed">{post.summary}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 rounded-full border border-line text-[11px] font-mono text-muted">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <article className="space-y-4 border-t border-line pt-6">
        <Body />
      </article>

      {others.length > 0 && (
        <section className="space-y-3 pt-6 border-t border-line">
          <h2 className="text-xs font-mono uppercase tracking-wider text-muted">More notes</h2>
          {others.map((p) => (
            <Link key={p.slug} href={`/notes/${p.slug}`} className="group flex items-start gap-1.5 text-sm text-fg">
              <span className="group-hover:underline underline-offset-4 decoration-line-strong">{p.title}</span>
              <ArrowUpRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted" />
            </Link>
          ))}
        </section>
      )}

    </>
  );
}
