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

export type ActivitySummary = {
  total30: number; // contributions in the last 30 days, all accounts
  activeDays30: number;
  streak: number; // consecutive days with contributions, ending on the latest day (or the day before it)
  last30: number[]; // daily counts, oldest first, for a small bar chart
};

// Totals for the /now page, from the same combined calendar as the heat map (so private work counts, unnamed).
// "Today" is the calendar's last day, which keeps the result stable inside the cache.
export async function getActivitySummary(): Promise<ActivitySummary | null> {
  const days = await getCombinedContributions();
  if (!days?.length) return null;

  const last30 = days.slice(-30).map((d) => d.count);
  let streak = 0;
  // A day with nothing yet doesn't break the streak until it's over
  let i = days.length - 1;
  if (days[i].count === 0) i--;
  for (; i >= 0 && days[i].count > 0; i--) streak++;

  return {
    total30: last30.reduce((sum, n) => sum + n, 0),
    activeDays30: last30.filter((n) => n > 0).length,
    streak,
    last30,
  };
}

// The personal account is public on the site already; repositories from the work account are private and never listed
const PUBLIC_ACCOUNT = "lowehay";

export type RecentRepo = { name: string; url: string; language: string | null; pushedAt: string };

// Most recently pushed public repositories of the personal account (no forks, no profile README repo)
export async function getRecentRepos(limit = 3): Promise<RecentRepo[]> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(`https://api.github.com/users/${PUBLIC_ACCOUNT}/repos?sort=pushed&per_page=10`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return [];
    const repos: { name: string; html_url: string; language: string | null; pushed_at: string; fork: boolean }[] =
      await res.json();
    return repos
      .filter((r) => !r.fork && r.name.toLowerCase() !== PUBLIC_ACCOUNT.toLowerCase())
      .slice(0, limit)
      .map((r) => ({ name: r.name, url: r.html_url, language: r.language, pushedAt: r.pushed_at }));
  } catch {
    return [];
  }
}
