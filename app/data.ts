// Content shared by the homepage and the résumé page, so the two never drift apart

export type Project = {
  title: string;
  category: string;
  desc: string;
  tech: string[];
  // Optional links; a project without either renders as a plain row
  live?: string;
  repo?: string;
};

export const services = [
  {
    title: "Web Applications",
    desc: "Custom full-stack apps with React or Next.js on the front and Django on the back, from database design to the finished interface.",
  },
  {
    title: "AI Integration",
    desc: "Generative AI features built into your product, such as chat assistants, content generation, and smart automation powered by LLM APIs.",
  },
  {
    title: "Dashboards & Admin Systems",
    desc: "Management systems for inventory, records, orders, and reporting, with role-based access for every kind of user.",
  },
  {
    title: "Websites & Landing Pages",
    desc: "Fast, responsive sites for businesses and products, built to load quickly and be found on search engines.",
  },
  {
    title: "Deployment & Launch",
    desc: "Getting your app live on hosting that fits the project, such as Vercel or Render, with your own domain and support after launch.",
  },
];

export const projects: Project[] = [] = [
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
    category: "School Administration",
    desc: "Records management system for schools that centralizes student and academic records behind role-based access.",
    tech: ["React", "Django REST", "PostgreSQL", "Tailwind"],
  },
  {
    title: "LMS Platform",
    category: "Education Platform",
    desc: "Multi-tenant learning portal featuring course management, gradebooks, and role-based access control.",
    tech: ["React", "Django REST", "PostgreSQL", "Tailwind"],
  },
];

export const company = {
  name: "Classify Inc.",
  period: "Sept 2023 — Present",
  summary: "Trainee to full-stack developer in 10 months",
};

export const roles = [
  {
    period: "July 2024 — Present",
    role: "Front-End & Full-Stack Developer",
    badge: "Full-time",
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

export const education = {
  degree: "Degree in Information Technology",
  school: "STI College Koronadal",
  year: "2024",
};

export const stackCategories = [
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
    skills: ["Git", "Vercel", "Render", "Linux (Ubuntu)", "Nginx"],
  },
  {
    category: "AI",
    skills: ["LLM APIs", "Prompt Engineering", "Claude Code", "Cursor"],
  },
];
