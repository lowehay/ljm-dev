// Single source of truth for links and metadata. Empty values hide their UI.

const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const site = {
  name: "Louie Jae Maravillosa",
  // Brand wordmark shown in the navbar logo and the big interactive wordmark
  brand: "Lforlowe.dev",
  title: "Louie Jae Maravillosa — Full-Stack Developer",
  description:
    "Full-stack developer from South Cotabato, Philippines, building web applications and AI-powered features end to end with Django, React, and Next.js.",
  // Set NEXT_PUBLIC_SITE_URL to your custom domain; Vercel's production URL is the fallback
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (productionHost ? `https://${productionHost}` : "http://localhost:3000"),
  email: "louiejaemaravillosa24@gmail.com",
  github: "https://github.com/lowehay",
  linkedin: "", // e.g. "https://www.linkedin.com/in/your-handle"
  resume: "/resume", // printable page generated from app/data.ts
  // Background music: put the file in public/music/ and set this, e.g. "/music/background.mp3"; empty hides the button
  music: "/music/lofi-loop.wav",
};
