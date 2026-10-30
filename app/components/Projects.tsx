import { ArrowUpRight } from "lucide-react";
import Section from "./Section";
import { projects } from "../data";
import Spotlight from "./effects/Spotlight";
import ContributionGraph from "./ContributionGraph";
import { getCombinedContributions } from "../github";
import { site } from "../site";

const GITHUB_USER = site.github.split("/").pop() ?? "";

export default async function Projects() {
  const contributions = await getCombinedContributions();

  return (
    <Section id="projects" index="02" title="Featured Projects">
      <div className="divide-y divide-line">
        {projects.map((p) => {
          const links = [
            { label: "live demo", href: p.live },
            { label: "source", href: p.repo },
          ].filter((l) => l.href);

          return (
            <Spotlight key={p.title} className="py-5 lg:first:pt-0">
              <span className="text-xs font-mono text-muted">{p.category}</span>
              <h3 className="text-base font-semibold text-fg">{p.title}</h3>

              <p className="text-sm text-muted mt-2 leading-relaxed">{p.desc}</p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                <p className="text-xs font-mono text-muted">{p.tech.join(" · ")}</p>

                {links.length > 0 && (
                  <div className="flex gap-4 ml-auto pl-2 text-xs font-mono text-muted">
                    {links.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 py-1 hover:text-fg transition group"
                      >
                        <span>{l.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </Spotlight>
          );
        })}
      </div>

      {contributions && (
        <div className="pt-6 mt-1 border-t border-line">
          <ContributionGraph days={contributions} username={GITHUB_USER} />
        </div>
      )}
    </Section>
  );
}
