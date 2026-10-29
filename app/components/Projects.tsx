import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";

type Project = {
  title: string;
  category: string;
  desc: string;
  tech: string[];
  // Optional links; a project without either renders as a plain row
  live?: string;
  repo?: string;
};

export default function Projects() {
  const projects: Project[] = [
    {
      title: "Coffee Shop Management System",
      category: "Full-Stack Application",
      desc: "Café management system covering orders, products, customers, and ingredient inventory. Selling a drink deducts its recipe's ingredients from stock automatically, with low-stock tracking and a sales dashboard.",
      tech: ["React", "Django REST", "PostgreSQL", "JWT", "Cloudinary"],
      live: "https://coffee-shop-self-sigma.vercel.app",
      repo: "https://github.com/lowehay/Coffee_Shop",
    },
    {
      title: "Aura Brew",
      category: "Creative Frontend",
      desc: "Landing page for a concept specialty coffee roaster. A 3D coffee bean travels with you across sections on scroll, and a roast selector restyles it from light to dark.",
      tech: ["Next.js", "Three.js", "GSAP", "Framer Motion"],
      repo: "https://github.com/lowehay/aura-brew",
    },
    {
      title: "School Records Management System",
      category: "Enterprise Software",
      desc: "Records management system for schools that centralizes student and academic records behind role-based access.",
      tech: ["React", "Django REST", "PostgreSQL", "Tailwind"],
    },
    {
      title: "LMS Platform",
      category: "Enterprise Software",
      desc: "Multi-tenant learning portal featuring course management, gradebooks, and role-based access control.",
      tech: ["React", "Django REST", "PostgreSQL", "Tailwind"],
    },
  ];

  return (
    <section id="projects" className="space-y-2 pt-4">
      <SectionHeading index="01" title="Featured Projects" />

      <div className="divide-y divide-line">
        {projects.map((p) => {
          const links = [
            { label: "live demo", href: p.live },
            { label: "source", href: p.repo },
          ].filter((l) => l.href);

          return (
            <div key={p.title} className="py-5">
              <span className="text-xs font-mono text-muted">{p.category}</span>
              <h3 className="text-base font-semibold text-white">{p.title}</h3>

              <p className="text-sm text-muted mt-2 leading-relaxed">{p.desc}</p>

              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[11px] font-mono text-muted border border-line"
                  >
                    {t}
                  </span>
                ))}

                {links.length > 0 && (
                  <div className="flex gap-4 ml-auto pl-2 text-xs font-mono text-muted">
                    {links.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-white transition group"
                      >
                        <span>{l.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
