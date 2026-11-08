// MDX pages in content/ export a typed `meta` object next to their content.
declare module "@/content/*.mdx" {
  import type { MDXProps } from "mdx/types";
  import type { JSX } from "react";

  import type { ContentMeta } from "@/lib/content";

  export const meta: ContentMeta;
  export default function MDXContent(props: MDXProps): JSX.Element;
}
