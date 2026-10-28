"use client";

import React from "react";

export default function TechStack() {
  const stackCategories = [
    {
      category: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "Bootstrap"],
    },
    {
      category: "Backend & Database",
      skills: ["Python", "Django", "Django REST Framework", "PHP", "Laravel", "PostgreSQL", "SQLite"],
    },
    {
      category: "AI & Workflow Tools",
      skills: ["Claude Code", "Cursor", "Linux (Ubuntu)", "Nginx", "Git", "Termius SSH"],
    },
  ];

  return (
    <section id="stack" className="space-y-6 pt-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          03 — Tech Stack
        </h2>
      </div>

      <div className="space-y-4">
        {stackCategories.map((cat, i) => (
          <div key={i} className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 space-y-3">
            <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-wide">{cat.category}</h3>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-neutral-800/80 text-neutral-300 border border-neutral-700/60"
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