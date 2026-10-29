import { ArrowUpRight, ArrowRight } from "lucide-react";
import AvatarReveal from "./AvatarReveal";
import { site } from "../site";

export default function Hero() {
  const links = [
    { label: "github", href: site.github, external: true },
    { label: "linkedin", href: site.linkedin, external: true },
    { label: "résumé", href: site.resume, external: true },
    { label: "email", href: `mailto:${site.email}`, external: false },
  ].filter((l) => l.href);

  return (
    <section className="pt-2 pb-0">
      <div className="flex flex-col md:flex-row items-center md:items-center gap-8 sm:gap-12">
        {/* Left Side: Pixel avatar with spotlight lens, tilt, and tap-to-dissolve */}
        <div className="w-56 sm:w-64 shrink-0 flex justify-center">
          <AvatarReveal />
        </div>

        {/* Right Side: Headline, Balanced Bio & Links */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Louie Jae Maravillosa
            </h1>

            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Full-Stack Developer from South Cotabato, Philippines. I build web applications end to end, from the database and API to the interface your users see.
            </p>

            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Bring me the idea, whatever it is, and I&apos;ll pick the right tools from my stack and take it all the way to a deployed, production-ready product.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 pt-2 text-xs font-mono text-muted">
            <a
              href="#contact"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent text-canvas font-medium hover:bg-neutral-300 transition group"
            >
              <span>Hire me</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Minimalist Text Links */}
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.external && { target: "_blank", rel: "noopener noreferrer" })}
                className="flex items-center gap-1 hover:text-white transition group"
              >
                <span>{l.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
