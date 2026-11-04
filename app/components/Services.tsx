import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Section from "./Section";
import { services, workSteps } from "../data";
import Spotlight from "./effects/Spotlight";

export default function Services() {
  return (
    <Section id="services" index="01" title="Services" className="space-y-2">
      <div className="divide-y divide-line">
        {services.map((s) => (
          <Spotlight key={s.title} className="py-5 lg:first:pt-0">
            <h3 className="text-base font-semibold text-fg">{s.title}</h3>
            <p className="text-sm text-muted mt-1 leading-relaxed">{s.desc}</p>
          </Spotlight>
        ))}
      </div>

      <div className="pt-4 space-y-4">
        <span className="text-xs font-mono text-muted">How I work</span>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {workSteps.map((p, i) => (
            <li key={p.step} className="space-y-1 border-t border-line pt-3">
              <span className="text-xs font-mono text-muted">0{i + 1}</span>
              <h3 className="text-sm font-semibold text-fg">{p.step}</h3>
              <p className="text-sm text-muted leading-relaxed">{p.desc}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="pt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link
          href="/scope"
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-fg text-canvas text-sm font-medium hover:opacity-85 transition group"
        >
          Scope your project
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <p className="text-sm text-muted">
          Need something not listed?{" "}
          <a href="#contact" className="text-fg underline underline-offset-4 decoration-line-strong hover:decoration-fg transition">
            Tell me about it
          </a>
          .
        </p>
      </div>
    </Section>
  );
}
