import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "../data";

// The featured project at the top of Projects: a short intro, then three screens of the real app, each with one line.

const kaban = projects.find((p) => p.caseStudy === "/projects/kaban")!;

const screens = [
  {
    src: "/kaban/home.webp",
    title: "Safe to spend",
    text: "What you can use each day until payday, after bills.",
    alt: "Kaban's Home screen: ₱3,298 safe to spend per day, 7 days to the 30th, with ₱4,049 held for bills",
  },
  {
    src: "/kaban/reports.webp",
    title: "Reports",
    text: "Income and spending by month or pay period.",
    alt: "Kaban's Reports screen: ₱18,000 income, ₱8,365 spent, and a daily spending chart",
  },
  {
    src: "/kaban/goals.webp",
    title: "Goals",
    text: "Savings goals that fill up as you add to them.",
    alt: "Kaban's Goals screen: an emergency fund at 41% and a laptop fund at 21%",
  },
];

export default function KabanShowcase() {
  return (
    <div id="kaban" className="space-y-10 pb-12 mb-2 border-b border-line">
      <header className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-muted">Featured · {kaban.category}</span>
        <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-fg">Kaban</h3>
        <p className="text-lg leading-snug text-fg-soft max-w-lg">
          A money app for the Philippines that tells you how much you can safely spend today.
        </p>
        <p className="text-sm text-muted">Works offline · Installs like an app · Reads receipts</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={kaban.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-fg text-canvas text-sm font-medium hover:opacity-85 transition"
          >
            Open Kaban
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <Link
            href={kaban.caseStudy!}
            className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full border border-line text-sm text-fg-soft hover:border-line-strong hover:text-fg transition"
          >
            How I built it
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <ul className="grid grid-cols-3 gap-3 sm:gap-6">
        {screens.map((s, i) => (
          <li key={s.src} className="space-y-3">
            <div className="rounded-[1.4rem] sm:rounded-[2rem] border border-line-strong bg-black p-1 sm:p-1.5">
              <div className="relative aspect-[720/1465] overflow-hidden rounded-[1.2rem] sm:rounded-[1.65rem]">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1024px) 210px, 33vw"
                  className="object-cover object-top"
                  priority={i === 0}
                />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-semibold text-fg">{s.title}</h4>
              <p className="text-xs sm:text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
