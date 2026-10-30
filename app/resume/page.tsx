import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrintButton from "./PrintButton";
import { site } from "../site";
import { company, education, projects, roles, stackCategories } from "../data";

export const metadata: Metadata = {
  title: `Résumé — ${site.name}`,
  description: `Résumé of ${site.name}, Full-Stack Developer.`,
  alternates: { canonical: "/resume" },
};

// Printed links should be readable as text, so show them without the protocol
const display = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-mono uppercase tracking-wider text-muted border-b border-line pb-2 break-after-avoid">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ResumePage() {
  const contacts = [
    { label: "South Cotabato, Philippines" },
    { label: site.email, href: `mailto:${site.email}` },
    { label: display(site.url), href: site.url },
    { label: display(site.github), href: site.github },
    ...(site.linkedin ? [{ label: display(site.linkedin), href: site.linkedin }] : []),
  ];

  return (
    <main className="max-w-2xl w-full mx-auto px-6 py-12 print:p-0 print:max-w-none space-y-10 text-fg-soft">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/" className="inline-flex items-center gap-1.5 py-1 text-xs font-mono text-muted hover:text-fg transition group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>back to site</span>
        </Link>
        <PrintButton />
      </div>

      <header className="space-y-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fg">{site.name}</h1>
          <p className="text-base text-fg-soft mt-1">Full-Stack Developer</p>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-muted">
          {contacts.map((c) => (
            <li key={c.label}>
              {c.href ? (
                <a href={c.href} className="hover:text-fg transition">{c.label}</a>
              ) : (
                c.label
              )}
            </li>
          ))}
        </ul>
        <p className="text-sm leading-relaxed">
          Full-stack developer building web applications end to end, from the database and API to the interface users see.
          Three years of shipping production software with Django, React, and Next.js, from development through deployment. Early adopter of generative AI, both as a development tool and in the products I build.
        </p>
      </header>

      <Section title="Experience">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <h3 className="text-base font-semibold text-fg">{company.name}</h3>
          <span className="text-xs font-mono text-muted">{company.period}</span>
        </div>
        <div className="space-y-4">
          {roles.map((r) => (
            <div key={r.role} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h4 className="text-sm font-semibold text-fg">{r.role}</h4>
                <span className="text-xs font-mono text-muted">{r.period}</span>
              </div>
              <p className="text-sm leading-relaxed mt-1">{r.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Projects">
        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.title} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-sm font-semibold text-fg">{p.title}</h3>
                <span className="text-xs font-mono text-muted">{p.tech.join(" · ")}</span>
              </div>
              <p className="text-sm leading-relaxed mt-1">{p.desc}</p>
              {(p.live || p.repo) && (
                <p className="text-xs font-mono text-muted mt-1 space-x-4">
                  {p.live && <a href={p.live} className="hover:text-fg transition">{display(p.live)}</a>}
                  {p.repo && <a href={p.repo} className="hover:text-fg transition">{display(p.repo)}</a>}
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Skills">
        <dl className="space-y-1.5 text-sm">
          {stackCategories.map((c) => (
            <div key={c.category} className="grid grid-cols-[8.5rem_1fr] gap-3">
              <dt className="text-muted">{c.category}</dt>
              <dd>{c.skills.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Education">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <div>
            <h3 className="text-sm font-semibold text-fg">{education.degree}</h3>
            <p className="text-sm">{education.school}</p>
          </div>
          <span className="text-xs font-mono text-muted">{education.year}</span>
        </div>
      </Section>
    </main>
  );
}
