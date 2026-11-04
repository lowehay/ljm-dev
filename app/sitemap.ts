import type { MetadataRoute } from "next";
import { site } from "./site";
import { projects } from "./data";
import { posts } from "./notes/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/resume`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects
      .filter((p) => p.caseStudy)
      .map((p) => ({
        url: `${site.url}${p.caseStudy}`,
        changeFrequency: "yearly" as const,
        priority: 0.7,
      })),
    { url: `${site.url}/notes`, changeFrequency: "monthly", priority: 0.6 },
    ...posts.map((p) => ({
      url: `${site.url}/notes/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
