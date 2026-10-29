import SectionHeading from "./SectionHeading";

export default function TechStack() {
  const stackCategories = [
    {
      category: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite", "Bootstrap"],
    },
    {
      category: "Backend",
      skills: ["Python", "Django", "Django REST Framework", "PHP", "Laravel", "CodeIgniter"],
    },
    {
      category: "Database",
      skills: ["PostgreSQL", "SQLite"],
    },
    {
      category: "DevOps & Tools",
      skills: ["Linux (Ubuntu)", "Nginx", "Git", "Claude Code", "Cursor"],
    },
  ];

  return (
    <section id="stack" className="space-y-2 pt-4">
      <SectionHeading index="03" title="Tech Stack" />

      <div className="divide-y divide-line">
        {stackCategories.map((cat) => (
          <div key={cat.category} className="py-4 grid sm:grid-cols-[9rem_1fr] gap-3 sm:gap-6">
            <h3 className="text-xs font-mono text-muted uppercase tracking-wide pt-1.5">{cat.category}</h3>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-md text-xs font-mono text-neutral-300 border border-line hover:border-neutral-600 transition"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
