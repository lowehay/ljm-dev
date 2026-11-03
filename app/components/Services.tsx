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

      <p className="pt-4 text-sm text-muted">
        Need something not listed?{" "}
        <a href="#contact" className="text-fg underline underline-offset-4 decoration-line-strong hover:decoration-fg transition">
          Tell me about it
        </a>
        .
      </p>
    </Section>
  );
}
