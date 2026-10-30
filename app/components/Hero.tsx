import { ArrowUpRight, ArrowRight } from "lucide-react";
import HeroCard from "./HeroCard";
import BlurText from "./BlurText/BlurText";
import RotatingText from "./effects/RotatingText";
import Magnet from "./effects/Magnet";
import { site } from "../site";

export default function Hero() {
  const links = [
    { label: "github", href: site.github, external: true },
    { label: "linkedin", href: site.linkedin, external: true },
    { label: "résumé", href: site.resume, external: false },
    { label: "email", href: `mailto:${site.email}`, external: false },
  ].filter((l) => l.href);

  return (
    <section id="home" className="pt-2 pb-0">
      <div className="flex flex-col md:flex-row items-center md:items-center gap-8 sm:gap-12">
        {/* Left Side: profile card with the pixel/photo avatar (hover lens, tap to dissolve) */}
        <div className="w-64 shrink-0">
          <HeroCard />
        </div>

        {/* Right Side: Headline, Balanced Bio & Links */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="space-y-3">
            <BlurText
              as="h1"
              text={site.name}
              animateBy="letters"
              effect="blur"
              direction="top"
              trigger="load"
              delay={40}
              stepDuration={0.4}
              blur={10}
              distance={24}
              // BlurText lays letters out with flexbox, so centering on phones uses justify-* instead of text-center
              className="justify-center md:justify-start text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] text-fg"
            />

            <p className="text-lg sm:text-xl font-medium text-fg-soft">
              I build{" "}
              <RotatingText
                className="text-fg"
                words={["web applications.", "dashboards & admin systems.", "AI-powered features.", "fast websites."]}
              />
            </p>

            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Full-Stack Developer from South Cotabato, Philippines, working end to end, from the database and API to the interface your users see.
            </p>

            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Bring me the idea, whatever it is, and I&apos;ll pick the right tools from my stack and take it all the way to a deployed, production-ready product. I&apos;ve embraced generative AI too, both to build faster and to add AI-powered features to the apps I ship.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 pt-2 text-xs font-mono text-muted">
            <Magnet>
              <a
                href="#contact"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent text-canvas font-medium hover:opacity-80 transition group"
              >
                <span>Hire me</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </Magnet>

            {/* Minimalist Text Links */}
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
        </div>
      </div>
    </section>
  );
}
