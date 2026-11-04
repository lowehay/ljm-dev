import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Project } from "../data";

// Shared layout pieces for the /projects/* case study pages

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-mono uppercase tracking-wider text-muted border-b border-line pb-2">{title}</h2>
      {children}
    </section>
  );
}

export function Decision({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-base font-semibold text-fg tracking-tight">{title}</h3>
      <div className="text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="text-sm leading-relaxed space-y-1.5 list-disc pl-5 marker:text-line-strong">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function CaseStudyPage({
  project,
  intro,
  facts,
  children,
}: {
  project: Project;
  intro: React.ReactNode;
  facts: { label: string; value: string }[];
  children: React.ReactNode;
}) {
  const links = [
    { label: "live demo", href: project.live },
    { label: "source", href: project.repo },
  ].filter((l) => l.href);

  return (
    <main className="max-w-2xl w-full mx-auto px-6 py-12 space-y-10 text-fg-soft">
      <Link href="/#projects" className="inline-flex items-center gap-1.5 py-1 text-xs font-mono text-muted hover:text-fg transition group">
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>back to projects</span>
      </Link>

      <header className="space-y-4">
        <span className="text-xs font-mono text-muted">Case study · {project.category}</span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">{project.title}</h1>
        <p className="text-base leading-relaxed">{intro}</p>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-line">
          {facts.map((f) => (
            <div key={f.label} className="pt-3">
              <dt className="text-xs font-mono text-muted">{f.label}</dt>
              <dd className="text-sm text-fg mt-0.5">{f.value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex gap-5 text-xs font-mono text-muted">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 py-1 hover:text-fg transition group"
            >
              <span>{l.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          ))}
        </div>
      </header>

      {children}

      <footer className="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted">
        <span>Want something like this for your business?</span>
        <Link href="/#contact" className="flex items-center gap-1 py-1 text-fg hover:opacity-80 transition group">
          <span>get in touch</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </footer>
    </main>
  );
}
