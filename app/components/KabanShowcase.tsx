"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "../data";

// The featured project at the top of Projects, shown like a product launch: three phones with the real app, a grid of
// what it does (close-ups of the real screens).

const kaban = projects.find((p) => p.caseStudy === "/projects/kaban")!;

function Phone({ src, alt, sizes, priority = false }: { src: string; alt: string; sizes: string; priority?: boolean }) {
  return (
    <div className="rounded-[1.6rem] sm:rounded-[2.6rem] border border-line-strong bg-black p-1 sm:p-2">
      <div className="overflow-hidden rounded-[1.35rem] sm:rounded-[2.1rem] aspect-[720/1465] relative bg-black">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-top" priority={priority} />
      </div>
    </div>
  );
}

/** Three phones, the middle one in front. The two at the sides slide out from behind it once. */
function Phones() {
  const reduce = useReducedMotion();
  const side = (from: number) => ({
    initial: reduce ? false : { x: from, opacity: 0 },
    whileInView: { x: 0, opacity: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] as const },
  });
  return (
    <div className="flex justify-center items-center pt-4">
      <motion.div {...side(60)} className="w-[33%] max-w-[250px] -mr-[6%] sm:-mr-10 shrink-0">
        <Phone src="/kaban/reports.webp" alt="Kaban's Reports screen: ₱18,000 income, ₱8,365 spent, and a daily spending chart" sizes="250px" />
      </motion.div>
      <div className="relative z-10 w-[45%] max-w-[310px] shrink-0">
        <Phone
          src="/kaban/home.webp"
          alt="Kaban's Home screen: ₱3,298 safe to spend per day, 7 days to the 30th, with ₱4,049 held for bills"
          sizes="310px"
          priority
        />
      </div>
      <motion.div {...side(-60)} className="w-[33%] max-w-[250px] -ml-[6%] sm:-ml-10 shrink-0">
        <Phone src="/kaban/goals.webp" alt="Kaban's Goals screen: an emergency fund at 41% and a laptop fund at 21%" sizes="250px" />
      </motion.div>
    </div>
  );
}

/** One tile of the grid: a heading, a line, and optionally a close-up of the real screen. */
function Tile({
  title,
  text,
  shot,
  className = "",
}: {
  title: string;
  text: string;
  shot?: { src: string; alt: string; w: number; h: number };
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-line bg-surface p-6 sm:p-7 flex flex-col gap-5 ${className}`}>
      <div className="space-y-1.5">
        <h4 className="text-xl sm:text-2xl font-semibold tracking-tight text-fg">{title}</h4>
        <p className="text-sm sm:text-base leading-relaxed text-muted max-w-md">{text}</p>
      </div>
      {shot && (
        <div className="mt-auto w-full max-w-sm self-center overflow-hidden rounded-2xl border border-line bg-[#0c0c0e]">
          <Image src={shot.src} alt={shot.alt} width={shot.w} height={shot.h} sizes="(min-width: 640px) 50vw, 100vw" className="w-full h-auto" />
        </div>
      )}
    </div>
  );
}

/** A tile with one big figure or phrase instead of a picture. */
function Fact({ big, text, className = "" }: { big: string; text: string; className?: string }) {
  return (
    <div className={`rounded-3xl border border-line bg-surface p-6 sm:p-7 flex flex-col justify-between gap-6 ${className}`}>
      <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-fg">{big}</p>
      <p className="text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}

/** Two columns, to fit the project column: close-ups first, then four short facts. */
function Bento() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Tile
          className="sm:col-span-2"
          title="Safe to spend, every day."
          text="Money in every account, less the bills due before payday, over the days left. The strip shows the pay period: days gone, today, bills and payday."
          shot={{ src: "/kaban/card-safe.webp", alt: "Kaban's safe to spend card: ₱3,298 a day, 7 days to the 30th, ₱4,049 for bills", w: 900, h: 381 }}
        />
        <Tile
          title="Log it in seconds."
          text="Amount first, on a keypad. 120+85 adds up as you type, and you see what's left per day before you save."
          shot={{ src: "/kaban/card-entry.webp", alt: "Kaban's amount keypad with 120+85 typed, totaling ₱205", w: 900, h: 714 }}
        />
        <Tile
          title="Bills and paydays, two weeks ahead."
          text="What's due before the next payday is set aside on its own. A reminder comes even with the app closed."
          shot={{ src: "/kaban/card-bills.webp", alt: "Kaban's bills: the next two weeks with Internet due on the 26th, Electricity on the 28th, and payday on the 30th", w: 900, h: 746 }}
        />
        <Tile
          className="sm:col-span-2"
          title="Every wallet in one place."
          text="Banks, e-wallets and cash side by side. Moving money between them is a transfer, so it never counts as spending."
          shot={{ src: "/kaban/card-accounts.webp", alt: "Kaban's accounts: GCash, BDO and Cash with their balances", w: 900, h: 524 }}
        />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Fact big="Works offline" text="Entries made without a signal wait on the phone and sync when it's back, never saved twice." />
        <Fact big="Installs like an app" text="Add it to the home screen. It opens fast, locks with a PIN or Face ID, and sends bill reminders." />
        <Fact big="Reads receipts" text="Snap a receipt and AI fills in the amount and category for you to check. The photo is never stored." />
        <Fact big="~175 tests" text="The money logic is tested in the database, and the app on a phone-sized screen, on every change." />
      </div>
    </div>
  );
}

export default function KabanShowcase() {
  return (
    <div id="kaban" className="space-y-10 pb-10 mb-2 border-b border-line">
      <header className="space-y-5 text-center max-w-xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-wider text-muted">Featured product · {kaban.category}</span>
        <h3 className="text-5xl sm:text-6xl font-bold tracking-tight text-fg">
          Kaban
        </h3>
        <p className="text-lg sm:text-xl leading-snug text-fg-soft">
          A money app for the Philippines that tells you how much you can safely spend today.
        </p>
        <p className="text-sm text-muted">Designed and built solo · Next.js, Supabase, PostgreSQL · works offline</p>
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <a
            href={kaban.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-fg text-canvas text-sm font-medium hover:opacity-85 transition group"
          >
            Open Kaban
            <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <Link
            href={kaban.caseStudy!}
            className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full border border-line text-sm text-fg-soft hover:border-line-strong hover:text-fg transition group"
          >
            How I built it
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </header>

      <Phones />
      <Bento />
    </div>
  );
}
