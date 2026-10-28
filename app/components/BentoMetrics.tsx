"use client";

import React from "react";
import { Code2, Zap, Server } from "lucide-react";

export default function BentoMetrics() {
  const metrics = [
    {
      icon: <Code2 className="w-4 h-4 text-neutral-400" />,
      label: "Full-Stack Tech",
      value: "React & Django",
      desc: "End-to-end web apps",
    },
    {
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      label: "AI Velocity",
      value: "Claude Code",
      desc: "Accelerated delivery",
    },
    {
      icon: <Server className="w-4 h-4 text-neutral-400" />,
      label: "Systems Built",
      value: "LMS & POS",
      desc: "Production scale",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-2">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-neutral-500">{m.label}</span>
            {m.icon}
          </div>
          <div className="text-sm font-semibold text-white tracking-tight">{m.value}</div>
          <div className="text-xs text-neutral-400 mt-0.5">{m.desc}</div>
        </div>
      ))}
    </section>
  );
}