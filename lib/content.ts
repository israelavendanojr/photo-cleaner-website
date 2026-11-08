import type { Metadata } from "next";

import { site } from "@/lib/site";

/**
 * Every MDX file in content/ exports `meta` alongside its default content.
 * See types/content.d.ts for the module typing.
 */
export type ContentMeta = {
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD) the copy was last revised. */
  updated: string;
};

// A page-level `openGraph` replaces the root one, dropping the root's
// opengraph-image; point back to it explicitly.
const sharedImage = { url: "/opengraph-image", width: 1200, height: 630, alt: site.tagline };

export function contentMetadata(meta: ContentMeta, path: `/${string}`): Metadata {
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_US",
      title: `${meta.title} — ${site.name}`,
      description: meta.description,
      url: path,
      images: [sharedImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} — ${site.name}`,
      description: meta.description,
      images: [sharedImage],
    },
  };
}
