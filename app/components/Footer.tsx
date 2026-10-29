import { Mail, ArrowRight, ArrowUpRight } from "lucide-react";
import CopyEmailButton from "./CopyEmailButton";
import SectionHeading from "./SectionHeading";
import { site } from "../site";

export default function Footer() {
  const links = [
    { label: "github", href: site.github },
    { label: "linkedin", href: site.linkedin },
    { label: "résumé", href: site.resume },
  ].filter((l) => l.href);

  return (
    <footer id="contact" className="pt-4 space-y-6">
      <SectionHeading index="04" title="Contact" />

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">Let&apos;s build something great together.</h3>
        <p className="text-sm text-muted leading-relaxed">
          For freelance inquiries, full-stack collabs, or general questions, feel free to reach out directly via email.
        </p>
      </div>

      <div className="flex gap-2">
        <a
          href={`mailto:${site.email}`}
          className="flex-1 min-w-0 flex items-center justify-between p-4 rounded-xl bg-surface border border-line hover:border-neutral-600 transition group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Mail className="w-4 h-4 shrink-0 text-muted" />
            <span className="text-xs font-mono text-neutral-200 truncate">{site.email}</span>
          </div>
          <ArrowRight className="w-4 h-4 shrink-0 text-muted group-hover:translate-x-1 group-hover:text-accent transition" />
        </a>
        <CopyEmailButton email={site.email} />
      </div>

      <div className="flex flex-wrap gap-6 text-xs font-mono text-muted">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition group"
          >
            <span>{l.label}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        ))}
      </div>

      <p className="text-sm text-muted leading-relaxed">
        <span className="text-neutral-300">Off the clock:</span> recreational volleyball, tuning my Yamaha Aerox, PC games on a controller, and cooking Filipino street food.
      </p>

      <div className="flex items-center justify-between pt-6 border-t border-line text-xs text-muted font-mono">
        <span>© 2026 Louie Jae Maravillosa</span>
        <span>South Cotabato, PH</span>
      </div>
    </footer>
  );
}
