import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/** Long-form text column. Element styles come from mdx-components.tsx. */
export function Prose({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex max-w-prose flex-col gap-5 text-prose text-ink", className)}
      {...props}
    />
  );
}
