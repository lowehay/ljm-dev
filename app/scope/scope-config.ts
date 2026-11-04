// Project scoper settings. Every timeline is a range in weeks: [fastest, slowest].
// These are rough first estimates shown to visitors; edit them to match how you actually work.
// The scoper adds up the project type, each extra feature, and the design work.

export type Range = [number, number];

export const projectTypes = [
  {
    key: "website",
    name: "Website or landing page",
    desc: "A fast, polished site that presents your business or product.",
    weeks: [1, 2] as Range,
  },
  {
    key: "webapp",
    name: "Web application",
    desc: "A custom app with accounts, data, and workflows.",
    weeks: [4, 8] as Range,
  },
  {
    key: "dashboard",
    name: "Dashboard or admin system",
    desc: "Manage records, users, and reports in one place.",
    weeks: [3, 6] as Range,
  },
  {
    key: "ai",
    name: "AI feature for an existing app",
    desc: "A chat assistant, smart search, or automation added to what you have.",
    weeks: [1, 3] as Range,
  },
];

export const features = [
  { key: "auth", name: "User accounts & login", weeks: [1, 1] as Range, includedIn: [] as string[] },
  { key: "roles", name: "Roles & permissions", weeks: [0.5, 1] as Range, includedIn: [] },
  { key: "payments", name: "Online payments", weeks: [1, 2] as Range, includedIn: [] },
  { key: "admin", name: "Admin panel", weeks: [1, 2] as Range, includedIn: ["dashboard"] },
  { key: "reports", name: "Reports & charts", weeks: [1, 1] as Range, includedIn: ["dashboard"] },
  { key: "ai", name: "AI assistant or automation", weeks: [1, 2] as Range, includedIn: ["ai"] },
  { key: "cms", name: "Content you can edit yourself", weeks: [0.5, 1] as Range, includedIn: [] },
  { key: "integrations", name: "Connect to other services (APIs)", weeks: [1, 2] as Range, includedIn: [] },
];

export const designOptions = [
  { key: "ready", name: "I have designs ready", weeks: [0, 0] as Range },
  { key: "rough", name: "I have a rough idea or examples", weeks: [0.5, 1] as Range },
  { key: "none", name: "Design it for me", weeks: [1, 2] as Range },
];

// `weeks` is how soon the visitor needs it; the scoper flags deadlines shorter than the estimate
export const deadlines = [
  { key: "flexible", name: "Flexible", weeks: null },
  { key: "3mo", name: "Within 3 months", weeks: 13 },
  { key: "1mo", name: "Within a month", weeks: 4 },
  { key: "asap", name: "As soon as possible", weeks: 2 },
];
