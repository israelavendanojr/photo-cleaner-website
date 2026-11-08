import type { MDXComponents } from "mdx/types";
import Link from "next/link";

const components = {
  h2: (props) => <h2 className="mt-6 font-serif text-prose-h2 font-medium text-ink" {...props} />,
  h3: (props) => <h3 className="mt-2 text-title font-semibold text-ink" {...props} />,
  p: (props) => <p className="text-ink-muted" {...props} />,
  ul: (props) => (
    <ul className="flex list-disc flex-col gap-2 pl-5 text-ink-muted marker:text-line" {...props} />
  ),
  ol: (props) => <ol className="flex list-decimal flex-col gap-2 pl-5 text-ink-muted" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  a: ({ href = "", ...props }) => {
    const className = "text-ink underline underline-offset-4 decoration-line hover:text-accent";
    return href.startsWith("/") ? (
      <Link href={href} className={className} {...props} />
    ) : (
      <a href={href} className={className} {...props} />
    );
  },
  blockquote: (props) => (
    <blockquote
      className="rounded-card border-control border-dashed border-accent bg-accent-soft px-5 py-4 text-body text-accent-ink [&_p]:text-accent-ink"
      {...props}
    />
  ),
  hr: () => <hr className="border-line" />,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
