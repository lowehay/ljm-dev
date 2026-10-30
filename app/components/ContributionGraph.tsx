"use client";

import { useEffect, useRef, useState } from "react";
import type { ContributionDay } from "../github";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Monochrome intensity per GitHub level: empty days stay faint, busy days go full foreground
const LEVEL_CLASS = [
  "bg-fg/[0.12]",
  "bg-fg/30",
  "bg-fg/50",
  "bg-fg/75",
  "bg-fg",
];

function describe(day: ContributionDay) {
  const [y, m, d] = day.date.split("-").map(Number);
  const when = `${MONTHS[m - 1]} ${d}, ${y}`;
  if (day.count === 0) return `No contributions on ${when}`;
  return `${day.count} contribution${day.count === 1 ? "" : "s"} on ${when}`;
}

export default function ContributionGraph({ days, username }: { days: ContributionDay[]; username: string }) {
  const [active, setActive] = useState<ContributionDay | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // On narrow screens, open on the most recent months
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  }, []);

  const total = days.reduce((sum, d) => sum + d.count, 0);
  const weeks = Math.max(...days.map((d) => d.week)) + 1;

  // Label a column when a new month starts, dropping any label too close to the next one to fit
  const monthStarts: { week: number; label: string }[] = [];
  let lastMonth = -1;
  for (const day of days) {
    const month = Number(day.date.slice(5, 7)) - 1;
    if (month !== lastMonth) {
      monthStarts.push({ week: day.week, label: MONTHS[month] });
      lastMonth = month;
    }
  }
  const monthLabels = monthStarts.filter((m, i) => !monthStarts[i + 1] || monthStarts[i + 1].week - m.week >= 3);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-xs font-mono text-muted">GitHub activity</span>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-muted hover:text-fg transition"
        >
          @{username}
        </a>
      </div>

      {/* Scrolls sideways on narrow screens instead of shrinking the squares to dots */}
      <div ref={scrollerRef} className="overflow-x-auto rounded-lg border border-line bg-surface p-3">
        <div
          className="grid min-w-[560px] gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
          onPointerLeave={() => setActive(null)}
        >
          {monthLabels.map((m) => (
            <span
              key={`${m.label}-${m.week}`}
              className="text-[10px] font-mono text-muted leading-none pb-1 whitespace-nowrap"
              style={{ gridColumn: m.week + 1, gridRow: 1 }}
            >
              {m.label}
            </span>
          ))}
          {days.map((day) => (
            <div
              key={day.date}
              role="img"
              aria-label={describe(day)}
              onPointerEnter={() => setActive(day)}
              className={`aspect-square rounded-[2px] transition-transform hover:scale-125 ${LEVEL_CLASS[day.level] ?? LEVEL_CLASS[0]} ${
                active?.date === day.date ? "ring-1 ring-fg" : ""
              }`}
              style={{ gridColumn: day.week + 1, gridRow: day.weekday + 2 }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted">
        {/* Hovering a square swaps the yearly total for that day's count */}
        <span aria-live="polite">
          {active ? describe(active) : `${total.toLocaleString("en-US")} contributions in the last year, across my personal and work accounts`}
        </span>
        <span className="flex items-center gap-1.5">
          Less
          {LEVEL_CLASS.map((c) => (
            <span key={c} className={`w-2.5 h-2.5 rounded-[2px] ${c}`} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}
