"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { projects } from "../data";

// The featured product, shown like a product page: the real app on a phone with a tab per
// feature, then the app's main idea to try with your own numbers.

const kaban = projects.find((p) => p.caseStudy === "/projects/kaban")!;

const STEPS = [
  {
    tab: "Safe to spend",
    shot: "/kaban/home.webp",
    title: "Know what you can spend today.",
    text: "Kaban opens on one number: how much is safe to spend each day until payday, with the bills due before then already set aside.",
    alt: "Kaban's Home screen showing ₱3,298 safe to spend per day, 7 days to the 30th, with ₱4,049 held for bills",
  },
  {
    tab: "Logging",
    shot: "/kaban/entry.webp",
    title: "Log it before you forget it.",
    text: "Amount first, on a number pad. Type 120+85 and it adds up, your usual categories are one tap away, and it shows what's left per day after this.",
    alt: "Kaban's New entry sheet with 120+85 typed, totaling ₱205, and category chips below",
  },
  {
    tab: "Accounts",
    shot: "/kaban/accounts.webp",
    title: "Every wallet in one place.",
    text: "Banks, e-wallets and cash side by side, with transfers that don't count as spending and the balance after every entry.",
    alt: "Kaban's Accounts screen listing GCash, BDO and Cash with their balances and net worth",
  },
  {
    tab: "Bills",
    shot: "/kaban/home2.webp",
    title: "Bills, before they surprise you.",
    text: "The next two weeks of bills and paydays at a glance, a reminder even with the app closed, and Pay in one tap.",
    alt: "Kaban's recent activity grouped by day, and a two-week strip of upcoming bills and payday",
  },
  {
    tab: "Reports",
    shot: "/kaban/reports.webp",
    title: "See where the month went.",
    text: "Income, spending and what you kept, compared with the same days last month, by category and by pay period.",
    alt: "Kaban's Reports screen for November with income, spent, net and a daily spending chart",
  },
  {
    tab: "Goals",
    shot: "/kaban/goals.webp",
    title: "Save for what's next.",
    text: "Goals with a plan to reach them, and a share of every payday can go to one automatically.",
    alt: "Kaban's Goals screen with an emergency fund at 41% and a laptop fund at 21%",
  },
];

const SLIDE_MS = 6000;

function Phone({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="rounded-[2.6rem] border border-line-strong bg-black p-2.5">
      <div className="overflow-hidden rounded-[2.05rem] aspect-[720/1465] relative bg-black">
        <Image src={src} alt={alt} fill sizes="(min-width: 640px) 300px, 260px" className="object-cover object-top" priority={priority} draggable={false} />
      </div>
    </div>
  );
}

/**
 * The highlights: one phone, a caption, and a tab per feature. It moves on by itself (the active
 * tab fills up as it plays) and stops for good once the visitor takes over; it waits while hovered,
 * while off screen, or while the tab is hidden. Swipe the phone or use the arrow keys too.
 */
function Highlights() {
  const [active, setActive] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dir, setDir] = useState(1);
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const list = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keep the active tab in view in the row (it scrolls sideways on narrow phones)
  useEffect(() => {
    const t = tabs.current[active];
    const row = t?.parentElement;
    if (t && row) row.scrollTo({ left: t.offsetLeft - (row.clientWidth - t.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  }, [active, reduce]);

  const go = (i: number, byHand = true) => {
    const next = (i + STEPS.length) % STEPS.length;
    // From the step asked for before wrapping around, so last → first still slides forward
    setDir(i >= active ? 1 : -1);
    setActive(next);
    if (byHand) setStopped(true);
  };
  const playing = !stopped && !reduce;
  const running = playing && !hover && visible;
  const step = STEPS[active];

  return (
    <div
      ref={root}
      className="flex flex-col items-center gap-8 lg:grid lg:grid-cols-[1fr_300px] lg:gap-20 lg:max-w-4xl lg:mx-auto lg:w-full" onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHover(false)}>
      <div className="relative w-[260px] sm:w-[300px] lg:order-2" id="kaban-screen" role="tabpanel" aria-label={step.tab}>
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={step.shot}
            custom={dir}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50 || info.velocity.x < -400) go(active + 1);
              else if (info.offset.x > 50 || info.velocity.x > 400) go(active - 1);
            }}
            className="cursor-grab active:cursor-grabbing touch-pan-y"
          >
            <Phone src={step.shot} alt={step.alt} priority={active === 0} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="lg:hidden min-h-[7.5rem] sm:min-h-[6.5rem] max-w-md text-center px-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: reduce ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-fg">{step.title}</h3>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted">{step.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="lg:hidden flex items-center gap-2 max-w-full">
        <div
          role="tablist"
          aria-label="Kaban features"
          className="no-scrollbar flex gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1"
          onKeyDown={(e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            e.preventDefault();
            const raw = active + (e.key === "ArrowRight" ? 1 : -1);
            go(raw);
            tabs.current[(raw + STEPS.length) % STEPS.length]?.focus();
          }}
        >
          {STEPS.map((s, i) => (
            <button
              key={s.tab}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls="kaban-screen"
              tabIndex={i === active ? 0 : -1}
              onClick={() => go(i)}
              className={`relative shrink-0 overflow-hidden rounded-full h-9 px-4 text-sm whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/40 ${
                i === active ? "bg-canvas text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {/* The timer: the active tab fills while it plays, then the next one starts */}
              {i === active && playing && (
                <span
                  key={active}
                  aria-hidden
                  className="kaban-progress absolute inset-y-0 left-0 bg-line"
                  style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: running ? "running" : "paused" }}
                  onAnimationEnd={() => go(active + 1, false)}
                />
              )}
              <span className="relative">{s.tab}</span>
            </button>
          ))}
        </div>
        {!reduce && <PlayPause stopped={stopped} onToggle={() => setStopped(!stopped)} />}
      </div>

      {/* Wide screens: the features as a list beside the phone; the open one shows its line */}
      <div className="hidden lg:block lg:order-1">
        <div
          role="tablist"
          aria-label="Kaban features"
          aria-orientation="vertical"
          className="border-l border-line"
          onKeyDown={(e) => {
            if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
            e.preventDefault();
            const raw = active + (e.key === "ArrowDown" ? 1 : -1);
            go(raw);
            list.current[(raw + STEPS.length) % STEPS.length]?.focus();
          }}
        >
          {STEPS.map((s, i) => {
            const on = i === active;
            return (
              <div key={s.tab} className="relative">
                {/* The timer: a line down the side of the open feature */}
                {on && (
                  <span aria-hidden className="absolute -left-px top-0 bottom-0 w-px bg-line-strong">
                    {playing ? (
                      <span
                        key={active}
                        className="kaban-progress-y absolute inset-x-0 top-0 bg-fg"
                        style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: running ? "running" : "paused" }}
                        onAnimationEnd={() => go(active + 1, false)}
                      />
                    ) : (
                      <span className="absolute inset-0 bg-fg" />
                    )}
                  </span>
                )}
                <button
                  ref={(el) => {
                    list.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="kaban-screen"
                  tabIndex={on ? 0 : -1}
                  onClick={() => go(i)}
                  className={`block w-full text-left pl-6 pr-2 py-3 text-xl font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/40 rounded-sm ${
                    on ? "text-fg" : "text-line-strong hover:text-muted"
                  }`}
                >
                  {s.title}
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden pl-6 pr-2 text-base leading-relaxed text-muted"
                    >
                      <span className="block pb-4">{s.text}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        {!reduce && (
          <div className="mt-6 pl-6">
            <PlayPause stopped={stopped} onToggle={() => setStopped(!stopped)} />
          </div>
        )}
      </div>
    </div>
  );
}

function PlayPause({ stopped, onToggle }: { stopped: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={stopped ? "Play the tour" : "Pause the tour"}
      className="shrink-0 grid place-items-center size-11 rounded-full border border-line bg-surface text-fg-soft hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/40"
    >
      {stopped ? <Play className="size-4" /> : <Pause className="size-4" />}
    </button>
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

      <Highlights />
      <TryTheMath />
    </section>
  );
}
