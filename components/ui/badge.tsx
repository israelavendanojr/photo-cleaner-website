import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

export const badgeVariants = cva("inline-flex items-center gap-2", {
  variants: {
    variant: {
      /** Small accent dot + muted label, e.g. "Coming soon to iPhone". */
      status: "text-caption text-ink-muted",
      /** Filled pill, e.g. the success message. */
      success:
        "h-control rounded-pill bg-accent-soft pr-6.5 pl-2 text-control font-semibold text-accent-ink",
    },
  },
  defaultVariants: { variant: "status" },
});

export type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {variant !== "success" && (
        <span aria-hidden="true" className="size-dot shrink-0 rounded-pill bg-accent" />
      )}
      {children}
    </span>
  );
}
