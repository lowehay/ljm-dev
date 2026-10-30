import {
  siBootstrap,
  siClaude,
  siCodeigniter,
  siCursor,
  siDjango,
  siFramer,
  siGit,
  siLaravel,
  siNextdotjs,
  siNginx,
  siPhp,
  siPostgresql,
  siPython,
  siReact,
  siRender,
  siSqlite,
  siTailwindcss,
  siTypescript,
  siUbuntu,
  siVercel,
  siVite,
} from "simple-icons";

// Official brand logos (Simple Icons, CC0) keyed by the skill names in data.ts.
// Each is a single 24x24 SVG path, so it can be drawn in the theme's text color.
// Skills without a product logo ("LLM APIs", "Prompt Engineering") fall back to a generic icon.
export const STACK_ICONS: Record<string, { path: string }> = {
  React: siReact,
  "Next.js": siNextdotjs,
  TypeScript: siTypescript,
  "Tailwind CSS": siTailwindcss,
  // Framer Motion is made by Framer, which shares its logo
  "Framer Motion": siFramer,
  Vite: siVite,
  Bootstrap: siBootstrap,
  Python: siPython,
  Django: siDjango,
  // Django REST Framework has no logo of its own; it's built on Django
  "Django REST Framework": siDjango,
  PHP: siPhp,
  Laravel: siLaravel,
  CodeIgniter: siCodeigniter,
  PostgreSQL: siPostgresql,
  SQLite: siSqlite,
  Git: siGit,
  Vercel: siVercel,
  Render: siRender,
  "Linux (Ubuntu)": siUbuntu,
  Nginx: siNginx,
  "Claude Code": siClaude,
  Cursor: siCursor,
};
