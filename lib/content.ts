import type { Metadata } from "next";

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

export function contentMetadata(meta: ContentMeta, path: `/${string}`): Metadata {
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
  };
}
