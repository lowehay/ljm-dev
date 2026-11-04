import { ArrowUpRight } from "lucide-react";
import { getActivitySummary, getRecentRepos } from "../github";
import { projects } from "../data";
import { site } from "../site";

// Friendlier names for repositories that are on the site, e.g. "aura-brew" → "Aura Brew"
function repoLabel(url: string, name: string) {
  if (name === "ljm-dev") return "This portfolio";
  return projects.find((p) => p.repo?.toLowerCase() === url.toLowerCase())?.title ?? name;
}

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "Asia/Manila" });

// "On GitHub" on /now: activity totals from the combined heat map data (personal and work accounts; work repos are
// private, so they only show up in the numbers) and the personal account's recently pushed public repositories.
export default async function GitHubActivity() {
  const [summary, repos] = await Promise.all([getActivitySummary(), getRecentRepos()]);
  if (!summary && !repos.length) return null;

  const max = summary ? Math.max(1, ...summary.last30) : 1;

  return (
    <section className="space-y-5">
      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
        <h2 className="text-xs font-mono uppercase tracking-wider text-muted">On GitHub</h2>
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-mono text-muted hover:text-fg transition group"
        >
          profile
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {summary && (
        <div className="space-y-3">
          <dl className="grid grid-cols-3 gap-3">
            {[
              { label: "Contributions", value: summary.total30.toLocaleString("en-US") },
              { label: "Active days", value: `${summary.activeDays30} of 30` },
              // A short streak undersells a busy month, so it's swapped for the busiest day until it's worth showing
              summary.streak >= 3
                ? { label: "Current streak", value: `${summary.streak} days` }
                : { label: "Busiest day", value: String(max) },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-surface/60 px-3 py-2.5">
                <dt className="text-[11px] font-mono text-muted">{s.label}</dt>
                <dd className="mt-0.5 text-lg font-semibold text-fg tracking-tight">{s.value}</dd>
              </div>
            ))}
          </dl>

          {/* One bar per day, oldest on the left */}
          <div className="flex items-end gap-[3px] h-12" role="img" aria-label={`Daily contributions over the last 30 days, ${summary.total30} in total`}>
            {summary.last30.map((count, i) => (
              <span
                key={i}
                className={`flex-1 rounded-sm ${count ? "bg-fg/70" : "bg-line"}`}
                style={{ height: count ? `${Math.max(12, (count / max) * 100)}%` : "8%" }}
              />
            ))}
          </div>
          <p className="text-xs text-muted">Last 30 days, across my personal and work accounts. Work happens in private repositories, so it only shows up in these numbers.</p>
        </div>
      )}

      {repos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-mono text-muted">Recently pushed, public</p>
          <ul className="divide-y divide-line border-y border-line">
            {repos.map((r) => (
              <li key={r.name}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <span className="flex items-center gap-1.5 text-fg min-w-0">
                    <span className="truncate group-hover:underline underline-offset-4 decoration-line-strong">
                      {repoLabel(r.url, r.name)}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-muted" />
                  </span>
                  <span className="shrink-0 text-xs font-mono text-muted">
                    {r.language ? `${r.language} · ` : ""}
                    {shortDate(r.pushedAt)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
