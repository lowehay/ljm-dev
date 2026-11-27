// Content shared by the homepage and the résumé page, so the two never drift apart

export type Project = {
  title: string;
  category: string;
  desc: string;
  tech: string[];
  // Optional links; a project without either renders as a plain row
  live?: string;
  repo?: string;
  // Path of a case study page in this site
  caseStudy?: string;
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

// How a project with me runs, shown under Services
export const workSteps = [
  { step: "Understand", desc: "We talk through what you need, who it's for, and what done looks like." },
  { step: "Build", desc: "I work in small steps and share progress early, so you can steer as it takes shape." },
  { step: "Launch", desc: "Your app goes live on fast hosting with your own domain." },
  { step: "Support", desc: "I stay around after launch for fixes and the next round of improvements." },
];

export const projects: Project[] = [
  {
    title: "Kaban",
    category: "Personal Finance App",
    desc: "Phone-first money app for the Philippines that answers one question up front: how much can I safely spend each day until payday? It tracks accounts, bills, savings goals and paydays in pesos, installs like a native app, keeps working offline, and reads receipts with AI.",
    tech: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "Gemini", "Playwright"],
    live: "https://kaban-ph.vercel.app",
    caseStudy: "/projects/kaban",
  },
  {
    title: "Coffee Shop Management System",
    category: "Full-Stack Application",
    desc: "Café management system covering orders, products, customers, and ingredient inventory. Selling a drink deducts its recipe's ingredients from stock automatically, with low-stock tracking and a sales dashboard.",
    tech: ["React", "Django REST", "PostgreSQL", "JWT", "Cloudinary"],
    live: "https://coffee-shop-self-sigma.vercel.app",
    repo: "https://github.com/lowehay/Coffee_Shop",
    caseStudy: "/projects/coffee-shop",
  },
  {
    title: "Aura Brew",
    category: "Creative Frontend",
    desc: "Website for a concept Philippine specialty café. A 3D coffee bean travels with you through the page, and visitors can take a brew-matching quiz, browse the menu and beans, run a 3D brew timer, and find the café on a map.",
    tech: ["Next.js", "Three.js", "React Three Fiber", "Framer Motion"],
    live: "https://aura-brew-topaz.vercel.app/",
    repo: "https://github.com/lowehay/aura-brew",
    caseStudy: "/projects/aura-brew",
  },
  {
    title: "School Records Management System",
    category: "School Administration",
    desc: "Records management system for schools that centralizes student and academic records behind role-based access. I built and led the front end, on a design system I built from scratch in plain CSS and JavaScript. Together with the LMS, it serves 5,000+ users.",
    tech: ["Django", "HTML", "CSS", "JavaScript"],
  },
  {
    title: "LMS Platform",
    category: "Education Platform",
    desc: "Multi-tenant learning portal featuring course management, gradebooks, and role-based access control. I built and led the front end, on a design system I built from scratch in plain CSS and JavaScript. Together with the records system, it serves 5,000+ users.",
    tech: ["Django", "HTML", "CSS", "JavaScript"],
  },
];

export const company = {
  name: "Classify Inc.",
  period: "Sept 2023 — Present",
  summary: "Trainee to full-stack developer in 10 months",
};

// Each role as short bullets, matching the résumé PDF
export const roles = [
  {
    period: "July 2024 — Present",
    role: "Front-End & Full-Stack Developer",
    badge: "Full-time",
    bullets: [
      "Lead the front end of the company's school platforms, a learning management system and a student records system that together serve 5,000+ users.",
      "Built the platforms' design system from scratch in plain CSS and JavaScript.",
      "Lead front-end initiatives with React, Next.js, and TypeScript while building full-stack features.",
      "Perform data analysis for internal decisions and handle server deployments across cloud environments.",
    ],
  },
  {
    period: "Feb 2024 — July 2024",
    role: "Junior Web Developer",
    badge: "Contract",
    bullets: [
      "Developed and maintained full-stack web applications with React and Django.",
      "Improved UI/UX and implemented responsive designs across client and internal projects.",
    ],
  },
  {
    period: "Sept 2023 — Jan 2024",
    role: "Full Stack Developer Trainee",
    badge: "Internship",
    bullets: [
      "Completed full-stack training on real production projects.",
      "Built React components, PHP backends, and relational databases.",
    ],
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
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js", "Vite", "Bootstrap"],
  },
  {
    category: "Backend",
    skills: ["Python", "Django", "Django REST Framework", "Supabase", "PHP", "Laravel", "CodeIgniter"],
  },
  {
    category: "Database",
    skills: ["PostgreSQL", "SQLite"],
  },
  {
    category: "DevOps & Tools",
    skills: ["Git", "GitHub Actions", "Playwright", "Vercel", "Render", "Linux (Ubuntu)", "Nginx"],
  },
  {
    category: "AI",
    skills: ["LLM APIs", "Prompt Engineering", "Claude Code", "Cursor"],
  },
];

// The "Off the clock" line in the footer; the AI chat can mention it too
export const hobbies =
  "squeezing every frame out of my gaming laptop, watching anime, and getting lost in YouTube house builds and room makeovers.";

// Client FAQ, shown before the Contact section and given to the AI chat. These are my working terms; keep them current.
export const faqs = [
  {
    q: "How do we get started?",
    a: "Send me a message or use the project scoper. We'll have a short call about what you need, then I'll send a written scope with the timeline and a fixed price. Work starts once you approve it. From you, I need your goals, any content or branding you already have, and someone who can answer questions along the way.",
  },
  {
    q: "How do you charge?",
    a: "A fixed price for the whole project, agreed before we start, so there are no surprise bills. 50% is paid upfront to begin, and the rest on delivery or across milestones.",
  },
  {
    q: "How long will my project take?",
    a: "It depends on what it needs. The project scoper gives you a rough timeline in a few clicks, and I confirm the real one in the written scope.",
  },
  {
    q: "What happens after launch?",
    a: "Every project includes 30 days of free fixes after launch: if something I built doesn't work as agreed, I fix it at no cost. After that, I offer paid maintenance for updates and new features.",
  },
  {
    q: "How will we communicate?",
    a: "Whatever suits you: email for updates and decisions, video calls on Google Meet or Zoom for the kickoff and check-ins, and Messenger, Viber, Slack, or Discord for quick questions. You'll see progress early and often.",
  },
  {
    q: "Do you work with clients outside the Philippines?",
    a: "Yes. I work remotely with clients in any time zone and overlap a few hours for calls. I'm based in the Philippines (UTC+8).",
  },
  {
    q: "How fast do you reply?",
    a: "Within 24 hours. Messages through the contact form, the project scoper, or the chat all come straight to my inbox.",
  },
];
