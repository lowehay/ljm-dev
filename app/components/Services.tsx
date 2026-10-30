import Section from "./Section";
import { services } from "../data";
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

      <p className="pt-2 text-sm text-muted">
        Need something not listed?{" "}
        <a href="#contact" className="text-fg underline underline-offset-4 decoration-line-strong hover:decoration-fg transition">
          Tell me about it
        </a>
        .
      </p>
    </Section>
  );
}
