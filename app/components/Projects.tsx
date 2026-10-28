"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "LMS Platform",
      category: "Enterprise Software",
      desc: "Multi-tenant learning portal featuring course management, gradebooks, and role-based access control.",
      tech: ["React", "Django REST", "PostgreSQL", "Tailwind"],
      link: "#",
    },
    {
      title: "POS & Inventory System",
      category: "Full-Stack Application",
      desc: "Real-time point of sale system managing sales transactions, stock updates, and daily operational reports.",
      tech: ["React", "Python", "SQLite", "Tailwind"],
      link: "#",
    },
    {
      title: "High-Converting Landing Pages",
      category: "Freelance & Client Work",
      desc: "Responsive, ultra-fast landing pages optimized for performance, SEO, and lead conversion.",
      tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
      link: "#",
    },
  ];

  return (
    <section id="projects" className="space-y-6 pt-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          01 — Featured Projects
        </h2>
      </div>

      <div className="space-y-4">
        {projects.map((p, i) => (
          <a
            key={i}
            href={p.link}
            className="block p-5 rounded-xl bg-neutral-900/40 border border-neutral-800/60 hover:border-neutral-700 hover:bg-neutral-900/80 transition group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-neutral-500">{p.category}</span>
                <h3 className="text-base font-semibold text-white group-hover:text-neutral-200 flex items-center gap-1.5 transition">
                  {p.title}
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-neutral-400" />
                </h3>
              </div>
            </div>

            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{p.desc}</p>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {p.tech.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800/60 text-neutral-400 border border-neutral-800"
                >
                  {t}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}