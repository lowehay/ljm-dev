import { ArrowUpRight } from "lucide-react";
import CopyEmailButton from "./CopyEmailButton";
import EmailLink from "./EmailLink";
import Section from "./Section";
import LocalTime from "./LocalTime";
import ShinyText from "./effects/ShinyText";
import { site } from "../site";

export default function Footer() {
  const links = [
    { label: "github", href: site.github, external: true },
    { label: "linkedin", href: site.linkedin, external: true },
    { label: "résumé", href: site.resume, external: false },
  ].filter((l) => l.href);

  return (
    <Section id="contact" index="05" title="Contact" as="footer" className="space-y-6 pt-4 lg:pt-0">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-fg">
          <ShinyText>Let&apos;s build something great together.</ShinyText>
        </h3>
        <p className="text-sm text-muted leading-relaxed">
          For freelance inquiries, full-stack collabs, or general questions, feel free to reach out directly via email.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <EmailLink email={site.email} />
        <CopyEmailButton email={site.email} />
      </div>

      <div className="flex flex-wrap gap-6 text-xs font-mono text-muted">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            {...(l.external && { target: "_blank", rel: "noopener noreferrer" })}
            className="flex items-center gap-1 py-1 hover:text-fg transition group"
          >
            <span>{l.label}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        ))}
      </div>

      <p className="text-sm text-muted leading-relaxed">
        <span className="text-fg-soft">Off the clock:</span> squeezing every frame out of my gaming laptop, watching anime, and getting lost in YouTube house builds and room makeovers.
      </p>

      <div className="flex items-center justify-between pt-6 border-t border-line text-xs text-muted font-mono">
        <span>© 2026 Louie Jae Maravillosa</span>
        <LocalTime />
      </div>
    </Section>
  );
}
