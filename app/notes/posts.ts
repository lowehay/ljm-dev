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
