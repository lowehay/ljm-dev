// Notes (short write-ups of problems I solved). Metadata only, so the index, sitemap, command palette and
// social images can import it without pulling in the post bodies, which live in ./bodies.tsx.
export type Post = {
  slug: string;
  title: string;
  summary: string;
  date: string; // YYYY-MM-DD
  readMinutes: number;
  tags: string[];
};

export const posts: Post[] = [
  {
    slug: "smooth-scroll-stops-halfway",
    title: "Why my navbar link stopped scrolling halfway",
    summary:
      "Clicking one link on my 3D café site scrolled partway and gave up. The cause was a pinned section that changed size mid-scroll, plus a stale offset stacking on top.",
    date: "2026-11-05",
    readMinutes: 4,
    tags: ["CSS", "Scrolling", "Frontend"],
  },
  {
    slug: "shrinking-a-3d-model",
    title: "Shrinking a 3D model from 11.5 MB to 871 KB",
    summary:
      "My coffee bean was an 11.5 MB OBJ file. Converting and compressing it was the easy part; keeping it looking like a real bean took more care.",
    date: "2026-11-05",
    readMinutes: 4,
    tags: ["Three.js", "Performance", "3D"],
  },
  {
    slug: "webgl-without-a-gpu",
    title: "Making a WebGL site fast on computers without a GPU",
    summary:
      "My portfolio froze in PageSpeed because its animated background was being drawn on the CPU. How I found out, the fix that didn't work, and the one that did.",
    date: "2026-11-04",
    readMinutes: 4,
    tags: ["Performance", "WebGL", "Lighthouse"],
  },
  {
    slug: "seamless-audio-loop",
    title: "Looping background music on the web without the gap",
    summary:
      "Why an MP3 never loops cleanly with <audio loop>, and the small padding trick that made my site's music loop seamless.",
    date: "2026-11-04",
    readMinutes: 4,
    tags: ["Web Audio", "MP3", "Frontend"],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const formatDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
