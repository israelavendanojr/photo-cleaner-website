import type { ReactNode } from "react";

import { Prose } from "@/components/ui/prose";
import type { ContentMeta } from "@/lib/content";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** Shared shell for MDX-driven pages (/privacy, later /support). */
export function ContentPage({ meta, children }: { meta: ContentMeta; children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-page flex-1 px-gutter pt-hero-top pb-hero-bottom">
      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <h1 className="font-serif text-prose-h1 font-medium">{meta.title}</h1>
          <p className="text-caption text-ink-muted">
            Last updated{" "}
            <time dateTime={meta.updated}>{dateFormat.format(new Date(meta.updated))}</time>
          </p>
        </header>
        <Prose>{children}</Prose>
      </article>
    </main>
  );
}
