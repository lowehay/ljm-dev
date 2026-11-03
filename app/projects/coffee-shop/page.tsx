import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { site } from "../../site";
import { projects } from "../../data";

const project = projects.find((p) => p.caseStudy === "/projects/coffee-shop")!;

export const metadata: Metadata = {
  title: `${project.title} case study — ${site.name}`,
  description:
    "How I built a café management system where drinks are made from recipes, so selling one deducts its ingredients from inventory safely.",
  alternates: { canonical: "/projects/coffee-shop" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-mono uppercase tracking-wider text-muted border-b border-line pb-2">{title}</h2>
      {children}
    </section>
  );
}

function Decision({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-base font-semibold text-fg tracking-tight">{title}</h3>
      <div className="text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function CoffeeShopCaseStudy() {
  const links = [
    { label: "live demo", href: project.live },
    { label: "source", href: project.repo },
  ].filter((l) => l.href);

  const facts = [
    { label: "Role", value: "Solo: design, API, frontend, deployment" },
    { label: "Year", value: "2025" },
    { label: "Stack", value: "React, Django REST, PostgreSQL" },
    { label: "Hosting", value: "Vercel + Render" },
  ];

  return (
    <main className="max-w-2xl w-full mx-auto px-6 py-12 space-y-10 text-fg-soft">
      <Link href="/#projects" className="inline-flex items-center gap-1.5 py-1 text-xs font-mono text-muted hover:text-fg transition group">
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>back to projects</span>
      </Link>

      <header className="space-y-4">
        <span className="text-xs font-mono text-muted">Case study · {project.category}</span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">{project.title}</h1>
        <p className="text-base leading-relaxed">
          A system for running a café, covering orders, recipes, ingredient inventory, and sales reporting, built so the
          stock count always reflects what&apos;s actually on the shelf.
        </p>

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

      <Section title="The problem">
        <p className="text-sm leading-relaxed">
          A café sells drinks, but what it actually stocks is ingredients: beans by the kilo, milk by the liter, syrup by the
          bottle. Counting finished drinks can&apos;t tell the owner they&apos;re about to run out of milk, and a busy counter
          means several orders can change stock at the same moment. Stock that drifts from reality leads to selling drinks
          the café can&apos;t make.
        </p>
      </Section>

      <Section title="What I built">
        <ul className="text-sm leading-relaxed space-y-1.5 list-disc pl-5 marker:text-line-strong">
          <li>Orders that move through pending, processing, completed, and cancelled, with a history of every status change</li>
          <li>Products with recipes: each drink lists its ingredients, the amount it uses, and the unit</li>
          <li>Ingredient inventory with reorder points and low-stock flags</li>
          <li>Customer accounts, with guest orders also supported</li>
          <li>A sales dashboard with revenue by hour, day, and month, order status counts, and best-selling products</li>
        </ul>
      </Section>

      <Section title="Key decisions">
        <div className="space-y-6">
          <Decision title="Stock comes from recipes, not a number someone types in">
            <p>
              For drinks made from ingredients, there is no stock field to keep updated by hand. Availability is calculated:
              for each ingredient in the recipe, how many drinks could the current stock make, and the lowest of those is
              how many can be sold. Recipes and inventory can use different units, so amounts are converted between grams,
              kilograms, milliliters, liters, teaspoons, and tablespoons before comparing.
            </p>
          </Decision>

          <Decision title="Ingredients are deducted when an order is completed, not when it's placed">
            <p>
              Orders get edited and cancelled, so taking stock at checkout would mean constantly putting it back. Instead, the
              stock is checked when items are added, and deducted only when the order is marked completed.
            </p>
            <p>
              That step runs in a single database transaction. It first checks every item and reports all shortages at once,
              then updates stock with database-side arithmetic, so two orders finishing at the same moment can&apos;t
              overwrite each other&apos;s changes. Orders also can&apos;t be cancelled once they&apos;re being prepared.
            </p>
          </Decision>

          <Decision title="Prices are saved with each order">
            <p>
              Each order item stores the price at the time of sale, so changing a menu price later never rewrites past orders
              or the revenue reports built from them.
            </p>
          </Decision>

          <Decision title="Login tokens live in cookies JavaScript can't read">
            <p>
              Authentication uses JWTs stored in HttpOnly cookies rather than browser storage, which keeps them out of reach of
              injected scripts. Access tokens expire after five minutes and refresh tokens after fourteen days. Because the
              frontend and API are on different domains, the cookies are Secure and cross-site, and the API only accepts
              credentialed requests from the frontend&apos;s own origin.
            </p>
          </Decision>

          <Decision title="Reports are aggregated by the database">
            <p>
              The dashboard groups sales by hour, day, or month inside PostgreSQL instead of loading every order into Python,
              so the charts stay quick as order history grows.
            </p>
          </Decision>
        </div>
      </Section>

      <Section title="How it's deployed">
        <p className="text-sm leading-relaxed">
          The React frontend (Vite, Tailwind, Recharts, TanStack Table) is on Vercel. The Django REST API runs on Render with
          Gunicorn and a managed PostgreSQL database, WhiteNoise serves its static files, and product images are stored on
          Cloudinary.
        </p>
      </Section>

      <Section title="What I'd do next">
        <ul className="text-sm leading-relaxed space-y-1.5 list-disc pl-5 marker:text-line-strong">
          <li>
            Add automated tests around the stock flow, since completing and cancelling orders is the part that must never be
            wrong
          </li>
          <li>
            Store unit conversions per ingredient and reject recipes whose units can&apos;t be converted, instead of the current
            fixed table
          </li>
          <li>Seed the live demo with sample data and a limited demo login so visitors can try it right away</li>
        </ul>
      </Section>

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
