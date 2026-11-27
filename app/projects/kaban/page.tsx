import type { Metadata } from "next";
import { site } from "../../site";
import { projects } from "../../data";
import { CaseStudyPage, Decision, List, Section } from "../CaseStudy";

const project = projects.find((p) => p.caseStudy === "/projects/kaban")!;

export const metadata: Metadata = {
  title: `${project.title} case study — ${site.name}`,
  description:
    "How I built Kaban, a phone-first personal finance app for the Philippines that works out how much you can safely spend each day until payday, and keeps working offline.",
  alternates: { canonical: "/projects/kaban" },
};

export default function KabanCaseStudy() {
  return (
    <CaseStudyPage
      project={project}
      intro="Kaban (Filipino for a chest or treasury, as in kaban ng bayan) is a personal finance app for people paid in pesos, twice a month. Most budgeting apps show what you've already spent. Kaban opens on the number that matters before you spend: how much is safe to use each day until the next payday, after the bills due before then are set aside."
      facts={[
        { label: "Role", value: "Solo: design, frontend, database" },
        { label: "Year", value: "2026" },
        { label: "Stack", value: "Next.js, Supabase, Tailwind CSS" },
        { label: "Hosting", value: "Vercel" },
      ]}
    >
      <Section title="The goal">
        <p className="text-sm leading-relaxed">
          I wanted an app I&apos;d actually open every day. That meant logging an expense in a few taps, on a phone,
          even with a weak signal, and trusting that the balances were right. It also had to fit how pay works here:
          salaries on the 15th and 30th, paydays that move when they fall on a weekend, money spread across banks,
          e-wallets and cash, and bills that come due between paydays.
        </p>
      </Section>

      <Section title="What I built">
        <List
          items={[
            "Safe to spend per day: total money minus the bills due before the next payday, divided by the days left, with a strip showing the days of the pay period",
            "Accounts for banks, e-wallets and cash, in your own order, with transfers between them and the running balance after each entry",
            "Fast logging: amounts that add up as you type (120+85), your most-used categories as chips, recent entries in one tap, Save & add another, and one-tap favorites with Undo",
            "Recurring income with paydays that follow weekend rules, logged automatically or confirmed with Received when pay comes late",
            "Bills with due dates, loans and installments with progress, a calendar of paydays and bills, and push reminders even when the app is closed",
            "Savings goals, monthly or per-paycheck budgets, utang (money lent and borrowed), and reports that compare months and pay periods",
            "Receipt scanning and spending insights with Gemini, with a daily limit per user and no photos stored",
            "An installable app that opens offline, with a PIN or Face ID lock, CSV export and full backups",
          ]}
        />
      </Section>

      <Section title="Key decisions">
        <div className="space-y-6">
          <Decision title="Money only moves inside the database">
            <p>
              The app never writes a balance directly. Every expense, transfer, bill payment and edit goes through a
              Postgres function that records the entry and updates every balance it touches in one transaction, so
              they succeed or fail together. Editing an entry reverses its old effect before applying the new one, and
              row-level security means each user can only ever reach their own rows.
            </p>
          </Decision>

          <Decision title="Paydays as real dates, not a setting">
            <p>
              Safe to spend depends on knowing the next payday, so recurring income stores the days of the month it
              arrives and a rule for weekends: the Friday before, the Monday after, or either. Each payout records the
              payday it was for, and a unique index makes logging the same payday twice impossible, even from two
              phones at once. When pay is late, Home says so and counts to tomorrow instead of the payday after.
            </p>
          </Decision>

          <Decision title="Offline first, without double entries">
            <p>
              A service worker serves the app and its last known balances without a connection. Entries made offline
              wait in an outbox and sync when the phone is back online. Each one carries an ID made on the phone, so a
              retry after a dropped connection can never save it twice, and anything the server rejects stays listed
              with the reason.
            </p>
          </Decision>

          <Decision title="Built for one hand on a small phone">
            <p>
              Forms open as bottom sheets you swipe down to close, the amount field comes first with a number keypad,
              and holding the + button fans out quick actions. Colors only carry meaning: green for money in, red for
              over budget or overdue, and the brand gold for the main action. Everything is written in plain English,
              with Filipino where it helps.
            </p>
          </Decision>

          <Decision title="Tests on the money, then on the phone">
            <p>
              The database functions are tested against an in-memory Postgres, so a change to how balances move is
              checked before it ships. Playwright runs the app on a phone-sized screen against a local Supabase,
              covering flows like logging offline, paying a bill, and marking pay received. 180 automated tests
              run on every pull request.
            </p>
          </Decision>
        </div>
      </Section>
    </CaseStudyPage>
  );
}
