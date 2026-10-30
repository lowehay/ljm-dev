import Section from "./Section";
import { company, education, roles } from "../data";

export default function Experience() {
  return (
    <Section id="experience" index="03" title="Experience" className="space-y-6 pt-4 lg:pt-0">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-fg tracking-tight">{company.name}</h3>
        <p className="text-sm text-muted">
          {company.period} · {company.summary}
        </p>
      </div>

      <div className="space-y-6">
        {roles.map((exp, i) => (
          <div key={exp.role} className="relative pl-6 border-l border-line space-y-1.5">
            {/* The current role gets the accent; past roles stay neutral */}
            <div
              className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border border-canvas ${
                i === 0 ? "bg-accent" : "bg-line-strong"
              }`}
            />
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted">{exp.period}</span>
              <span className="px-1.5 py-0.5 rounded text-[11px] font-mono text-muted border border-line">
                {exp.badge}
              </span>
            </div>
            <h4 className="text-base font-semibold text-fg tracking-tight">{exp.role}</h4>
            <p className="text-sm text-muted leading-relaxed">{exp.desc}</p>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-line">
        <span className="text-xs font-mono text-muted">Education</span>
        <h3 className="text-base font-semibold text-fg tracking-tight">
          {education.degree}
        </h3>
        <p className="text-sm text-muted">{education.school} · Graduated {education.year}</p>
      </div>
    </Section>
  );
}
