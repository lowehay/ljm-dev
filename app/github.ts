import { cacheLife } from "next/cache";

// Accounts added together in the heat map. Kept in this server-only module so the second name never reaches the browser.
const ACCOUNTS = ["lowehay", "LouieJae"];

export type ContributionDay = {
  date: string; // YYYY-MM-DD
  count: number;
  level: number; // 0–4, GitHub's own intensity bucket
  weekday: number; // 0 = Sunday
  week: number; // column index, oldest first
};

// Reads the public contributions calendar (the same one on the GitHub profile), so no API token is needed.
// Returns null if GitHub can't be reached.
async function getAccountContributions(username: string): Promise<ContributionDay[] | null> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(`https://github.com/users/${username}/contributions`);
    if (!res.ok) return null;
    const html = await res.text();

    // Each cell's tooltip holds the exact count, e.g. "67 contributions on November 10th."
    const counts = new Map<string, number>();
    for (const [, id, text] of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)/g)) {
      const n = text.match(/^(\d+) contribution/);
      counts.set(id, n ? Number(n[1]) : 0);
    }

    const days: ContributionDay[] = [];
    for (const [cell] of html.matchAll(/<td[^>]*class="ContributionCalendar-day"[^>]*>/g)) {
      const date = cell.match(/data-date="([^"]+)"/)?.[1];
      const id = cell.match(/id="(contribution-day-component-(\d+)-(\d+))"/);
      if (!date || !id) continue;
      days.push({
        date,
        count: counts.get(id[1]) ?? 0,
        level: Number(cell.match(/data-level="(\d)"/)?.[1] ?? 0),
        weekday: Number(id[2]),
        week: Number(id[3]),
      });
    }

    return days.length ? days.sort((a, b) => a.date.localeCompare(b.date)) : null;
  } catch {
    return null;
  }
}

// Adds several accounts' daily counts together. GitHub's levels are relative to one account, so they're
// recomputed from the combined counts: quartiles of the active days, which keeps one huge day from flattening the rest.
export async function getCombinedContributions(): Promise<ContributionDay[] | null> {
  const accounts = (await Promise.all(ACCOUNTS.map(getAccountContributions))).filter((a) => a !== null);
  if (!accounts.length) return null;

  const byDate = new Map<string, ContributionDay>();
  for (const day of accounts.flat()) {
    const existing = byDate.get(day.date);
    if (existing) existing.count += day.count;
    else byDate.set(day.date, { ...day });
  }

  const days = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  const active = days.map((d) => d.count).filter((c) => c > 0).sort((a, b) => a - b);
  const quartile = (q: number) => active[Math.floor((active.length - 1) * q)];
  for (const day of days) {
    if (day.count === 0) day.level = 0;
    else if (day.count <= quartile(0.25)) day.level = 1;
    else if (day.count <= quartile(0.5)) day.level = 2;
    else if (day.count <= quartile(0.75)) day.level = 3;
    else day.level = 4;
  }
  return days;
}
