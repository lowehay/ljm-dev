import SectionHeading from "./SectionHeading";

export default function Experience() {
  const roles = [
    {
      period: "July 2024 — Present",
      role: "Front-End & Full-Stack Developer",
      badge: "Regular",
      desc: "Leading front-end initiatives with React, Next.js, and TypeScript while managing full-stack features. In addition to core web development, I perform data analysis for internal decision-making and handle server deployments across cloud environments.",
    },
    {
      period: "Feb 2024 — July 2024",
      role: "Junior Web Developer",
      badge: "Contract",
      desc: "Developed and maintained full-stack web applications using React and Django. Collaborated on UI/UX enhancements and implemented responsive designs across multiple client and internal projects.",
    },
    {
      period: "Sept 2023 — Jan 2024",
      role: "Full Stack Developer Trainee",
      badge: "Internship",
      desc: "Completed comprehensive training in full-stack web development. Gained hands-on experience building dynamic components with React, handling PHP backends, and managing relational databases for real production projects.",
    },
  ];

  return (
    <section id="experience" className="space-y-6 pt-4">
      <SectionHeading index="02" title="Experience" />

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white tracking-tight">Classify Inc.</h3>
        <p className="text-sm text-muted">
          Sept 2023 — Present · Trainee to full-stack developer in 10 months
        </p>
      </div>

      <div className="space-y-6">
        {roles.map((exp, i) => (
          <div key={exp.role} className="relative pl-6 border-l border-line space-y-1.5">
            {/* The current role gets the accent; past roles stay neutral */}
            <div
              className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border border-canvas ${
                i === 0 ? "bg-accent" : "bg-neutral-700"
              }`}
            />
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted">{exp.period}</span>
              <span className="px-1.5 py-0.5 rounded text-[11px] font-mono text-muted border border-line">
                {exp.badge}
              </span>
            </div>
            <h4 className="text-base font-semibold text-white tracking-tight">{exp.role}</h4>
            <p className="text-sm text-muted leading-relaxed">{exp.desc}</p>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-line">
        <span className="text-xs font-mono text-muted">Education</span>
        <h3 className="text-base font-semibold text-white tracking-tight">
          Degree in Information Technology
        </h3>
        <p className="text-sm text-muted">STI College Koronadal · Graduated 2024</p>
      </div>
    </section>
  );
}
