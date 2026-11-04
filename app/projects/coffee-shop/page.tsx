import type { Metadata } from "next";
import { site } from "../../site";
import { projects } from "../../data";
import { CaseStudyPage, Decision, Section } from "../CaseStudy";
import CoffeeDemo from "./CoffeeDemo";

const project = projects.find((p) => p.caseStudy === "/projects/coffee-shop")!;

export const metadata: Metadata = {
  title: `${project.title} case study — ${site.name}`,
  description:
    "How I built a café management system where drinks are made from recipes, so selling one deducts its ingredients from inventory safely.",
  alternates: { canonical: "/projects/coffee-shop" },
};

export default function CoffeeShopCaseStudy() {
  return (
    <CaseStudyPage
      project={project}
      intro={
        <>
          A system for running a café, covering orders, recipes, ingredient inventory, and sales reporting, built so the
          stock count always reflects what&apos;s actually on the shelf.
        </>
      }
      facts={[
        { label: "Role", value: "Solo: design, API, frontend, deployment" },
        { label: "Year", value: "2025" },
        { label: "Stack", value: "React, Django REST, PostgreSQL" },
        { label: "Hosting", value: "Vercel + Render" },
      ]}
    >
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

      <Section title="Try it">
        <p className="text-sm leading-relaxed">
          A small version of the inventory logic running right here in your browser. Drinks can only be added while
          there&apos;s stock for them, and ingredients are taken only when the order is completed.
        </p>
        <CoffeeDemo />
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
    </CaseStudyPage>
  );
}
