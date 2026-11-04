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
            { label: "case study", href: p.caseStudy, external: false },
            { label: "live demo", href: p.live, external: true },
            { label: "source", href: p.repo, external: true },
          ].filter((l) => l.href);

          return (
            <Spotlight key={p.title} className="py-5 lg:first:pt-0">
              <span className="text-xs font-mono text-muted">{p.category}</span>
              <h3 className="text-base font-semibold text-fg">{p.title}</h3>

              <p className="text-sm text-muted mt-2 leading-relaxed">{p.desc}</p>

              <p className="text-xs font-mono text-muted mt-3">{p.tech.join(" · ")}</p>

              {links.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {links.map((l, i) => (
                    <a
                      key={l.label}
                      href={l.href}
                      {...(l.external && { target: "_blank", rel: "noopener noreferrer" })}
                      // The first link (the case study when there is one) is the main action
                      className={`inline-flex items-center gap-1 h-7 px-3 rounded-full text-xs font-mono transition group ${
                        i === 0
                          ? "bg-fg text-canvas hover:opacity-85"
                          : "border border-line text-muted hover:border-line-strong hover:text-fg"
                      }`}
                    >
                      <span>{l.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ))}
                </div>
              )}
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
