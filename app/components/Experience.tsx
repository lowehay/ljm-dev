"use client";

import React from "react";

export default function Experience() {
  const experiences = [
    {
      period: "July 2024 — Present",
      role: "Front-End & Full-Stack Developer",
      company: "Classify Inc.",
      badge: "Regular",
      desc: "Leading front-end initiatives with React, Next.js, and TypeScript while managing full-stack features. In addition to core web development, I perform data analysis for internal decision-making and handle server deployments across cloud environments.",
    },
    {
      period: "Feb 2024 — July 2024",
      role: "Junior Web Developer",
      company: "Classify Inc.",
      badge: "Job Order",
      desc: "Developed and maintained full-stack web applications using React and Django. Collaborated on UI/UX enhancements and implemented responsive designs across multiple client and internal projects.",
    },
    {
      period: "Sept 2023 — Jan 2024",
      role: "Full Stack Developer Trainee",
      company: "Classify Inc.",
      badge: "OJT",
      desc: "Completed comprehensive training in full-stack web development. Gained hands-on experience building dynamic components with React, handling PHP backends, and managing relational databases for real production projects.",
    },
  ];

  return (
    <section id="experience" className="space-y-6 pt-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          02 — Experience
        </h2>
      </div>

      <div className="space-y-6">
        {experiences.map((exp, i) => (
          <div key={i} className="relative pl-6 border-l border-neutral-800 space-y-1.5">
            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-neutral-700 border border-[#0a0a0a]" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-500">{exp.period}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-800/80 text-neutral-400 border border-neutral-700/60">
                {exp.badge}
              </span>
            </div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              {exp.role} <span className="text-neutral-500 font-normal">/ {exp.company}</span>
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">{exp.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}