import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Single-page portfolio: the home page carries every section as an anchor.
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date("2026-10-11"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
