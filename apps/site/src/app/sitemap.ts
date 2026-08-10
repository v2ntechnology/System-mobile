import type { MetadataRoute } from "next";

import { listPostSlugs } from "@/features/blog/api";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/recursos", "/planos", "/blog", "/sobre", "/contato"];
  const posts = listPostSlugs().map((slug) => `/blog/${slug}`);

  return [...pages, ...posts].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith("/blog/") ? "yearly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
