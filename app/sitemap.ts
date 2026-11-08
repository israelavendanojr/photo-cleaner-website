import type { MetadataRoute } from "next";

import { meta as privacy } from "@/content/privacy.mdx";
import { meta as support } from "@/content/support.mdx";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    // Content pages: add new MDX routes here.
    { url: `${site.url}/privacy`, lastModified: privacy.updated, changeFrequency: "monthly" },
    { url: `${site.url}/support`, lastModified: support.updated, changeFrequency: "monthly" },
  ];
}
