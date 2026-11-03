import type { MetadataRoute } from "next";
import { site } from "./site";

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
    {
      url: `${site.url}/projects/coffee-shop`,
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];
}
