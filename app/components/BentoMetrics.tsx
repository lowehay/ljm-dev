import { Briefcase, Rocket, Layers } from "lucide-react";

export default function BentoMetrics() {
  const metrics = [
    {
      icon: Briefcase,
      label: "Experience",
      value: "3+ Years",
      desc: "Shipping to production since 2023",
    },
    {
      icon: Rocket,
      label: "Approach",
      value: "End-to-End",
      desc: "From idea to deployed product",
    },
    {
      icon: Layers,
      label: "Core Stack",
      value: "Django + React",
      desc: "From the API to the interface",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 border-y border-line divide-y sm:divide-y-0 sm:divide-x divide-line">
      {metrics.map(({ icon: Icon, label, value, desc }) => (
        <div key={label} className="py-5 sm:px-5 sm:first:pl-0 sm:last:pr-0">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="w-3.5 h-3.5 text-muted" />
            <span className="text-xs font-mono uppercase tracking-wider text-muted">{label}</span>
          </div>
          <div className="text-lg font-semibold text-white tracking-tight">{value}</div>
          <div className="text-sm text-muted mt-0.5">{desc}</div>
        </div>
      ))}
    </section>
  );
}
