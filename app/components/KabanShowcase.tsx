"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "../data";

// The featured product, shown like a product page: the real app on a phone, changing as the
// story scrolls (wide screens) or swiped through (phones), then the app's main idea to try.

const kaban = projects.find((p) => p.caseStudy === "/projects/kaban")!;

const STEPS = [
  {
    shot: "/kaban/home.webp",
    title: "Know what you can spend today.",
    text: "Kaban opens on one number: how much is safe to spend each day until payday, with the bills due before then already set aside.",
    alt: "Kaban's Home screen showing ₱3,298 safe to spend per day, 7 days to the 30th, with ₱4,049 held for bills",
  },
  {
    shot: "/kaban/entry.webp",
    title: "Log it before you forget it.",
    text: "Amount first, on a number pad. Type 120+85 and it adds up. Your usual categories are one tap away, and it shows what's left per day after this.",
    alt: "Kaban's New entry sheet with 120+85 typed, totaling ₱205, and category chips below",
  },
  {
    shot: "/kaban/home2.webp",
    title: "Bills, before they surprise you.",
    text: "See the next two weeks of bills and paydays at a glance, get a reminder even with the app closed, and pay with one tap.",
    alt: "Kaban's recent activity grouped by day, and a two-week strip of upcoming bills and payday",
  },
  {
    shot: "/kaban/reports.webp",
    title: "See where the month went.",
    text: "Income, spending and what you kept, compared with the same days last month, by category and by pay period.",
    alt: "Kaban's Reports screen for November with income, spent, net and a daily spending chart",
  },
  {
    shot: "/kaban/goals.webp",
    title: "Save for what's next.",
    text: "Goals with a plan to reach them, and a share of every payday can go to one automatically.",
    alt: "Kaban's Goals screen with an emergency fund at 41% and a laptop fund at 21%",
  },
];

function Phone({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="rounded-[2.4rem] border border-line-strong bg-black p-2">
      <div className="overflow-hidden rounded-[1.9rem] aspect-[720/1465] relative bg-black">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 300px, 240px" className="object-cover object-top" priority={priority} />
      </div>
    </div>
  );
}

/** The phone beside the story: shows the screen for the step in the middle of the window. */
function ScrollStory() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      // A thin band across the middle of the window: the step crossing it is the one shown
      { rootMargin: "-45% 0px -45% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const step = STEPS[active];
  return (
    <div className="hidden lg:grid grid-cols-[1fr_300px] gap-16">
      <div>
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-step={i}
            className="min-h-[70vh] flex flex-col justify-center"
          >
            <h3 className={`text-3xl font-semibold tracking-tight transition-colors duration-300 ${i === active ? "text-fg" : "text-line-strong"}`}>
              {s.title}
            </h3>
            <p className={`mt-3 max-w-md text-base leading-relaxed transition-colors duration-300 ${i === active ? "text-fg-soft" : "text-line-strong"}`}>
              {s.text}
            </p>
          </div>
        ))}
      </div>
      <div className="sticky top-[calc(50vh-305px)] self-start h-[610px]">
        <div className="relative">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={step.shot}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Phone src={step.shot} alt={step.alt} />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-4 text-center text-xs font-mono text-muted tabular-nums">
          {active + 1} / {STEPS.length}
        </p>
      </div>
    </div>
  );
}

/** Phones: the screens side by side, swiped through, each with its line underneath. */
function Gallery() {
  return (
    <div className="lg:hidden -mx-6 px-6 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 no-scrollbar" aria-label="Kaban screens">
      {STEPS.map((s, i) => (
        <figure key={s.title} className="snap-center shrink-0 w-[240px]">
          <Phone src={s.shot} alt={s.alt} priority={i === 0} />
          <figcaption className="mt-4 space-y-1.5">
            <span className="block text-base font-semibold text-fg tracking-tight">{s.title}</span>
            <span className="block text-sm leading-relaxed text-muted">{s.text}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

const peso = (n: number) => `₱${Math.round(n).toLocaleString("en-PH")}`;

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  format: (n: number) => string;
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-mono text-fg tabular-nums">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-fg)] h-6 cursor-pointer"
      />
    </label>
  );
}

/** Kaban's main idea, to try: money now, less the bills due before payday, over the days left. */
function TryTheMath() {
  const [money, setMoney] = useState(12000);
  const [bills, setBills] = useState(3500);
  const [days, setDays] = useState(7);
  const free = Math.max(0, money - bills);
  const perDay = free / days;
  const short = bills > money;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 sm:p-8 grid gap-8 md:grid-cols-2 md:items-center">
      <div className="space-y-5">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-fg tracking-tight">Try the math</h3>
          <p className="text-sm text-muted leading-relaxed">The same idea Kaban runs on, with your own numbers.</p>
        </div>
        <Slider label="Money you have now" value={money} min={1000} max={50000} step={500} onChange={setMoney} format={peso} />
        <Slider label="Bills due before payday" value={bills} min={0} max={20000} step={100} onChange={setBills} format={peso} />
        <Slider label="Days until payday" value={days} min={1} max={15} step={1} onChange={setDays} format={(n) => `${n} ${n === 1 ? "day" : "days"}`} />
      </div>

      <div className="md:border-l md:border-line md:pl-8 space-y-4" aria-live="polite">
        <p className="text-sm text-muted">Safe to spend</p>
        <p className="text-5xl sm:text-6xl font-semibold tracking-tight text-fg tabular-nums">
          {peso(perDay)}
          <span className="text-lg font-normal text-muted"> / day</span>
        </p>
        {/* The days to payday, as in the app: today first, payday last */}
        <div className="flex gap-1" aria-hidden>
          {Array.from({ length: days }, (_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i === 0 ? "bg-fg" : "bg-line-strong"}`} />
          ))}
        </div>
        <p className="text-sm text-muted leading-relaxed">
          {short
            ? `Bills are ${peso(bills - money)} more than you have. Kaban would show this before payday, not after.`
            : `${peso(money)} less ${peso(bills)} held for bills, over ${days} ${days === 1 ? "day" : "days"}.`}
        </p>
      </div>
    </div>
  );
}

export default function KabanShowcase() {
  return (
    <section id="kaban" aria-labelledby="kaban-title" className="pt-4 lg:pt-6 lg:border-t lg:border-line space-y-12 lg:space-y-6">
      <header className="space-y-5 text-center max-w-2xl mx-auto lg:pt-10">
        <span className="text-xs font-mono uppercase tracking-wider text-muted">Featured product · {kaban.category}</span>
        <h2 id="kaban-title" className="text-5xl sm:text-7xl font-bold tracking-tight text-fg">
          Kaban
        </h2>
        <p className="text-xl sm:text-2xl leading-snug text-fg-soft">
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

      <ScrollStory />
      <Gallery />
      <TryTheMath />
    </section>
  );
}
