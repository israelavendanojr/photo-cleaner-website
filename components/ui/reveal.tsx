import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";
import { STAGGER_MS } from "@/lib/motion";

const variants = {
  rise: "motion-safe:animate-rise",
  settle: "motion-safe:animate-settle",
  "rise-scale": "motion-safe:animate-rise-scale",
} as const;

type RevealProps = ComponentProps<"div"> & {
  /** Position in the entrance sequence; each step adds STAGGER_MS of delay. */
  order: number;
  /** `settle` moves without fading, for the LCP element. */
  variant?: keyof typeof variants;
};

/**
 * Page-load entrance. Pure CSS so content paints before hydration;
 * skipped entirely under prefers-reduced-motion.
 */
export function Reveal({ order, variant = "rise", className, style, ...props }: RevealProps) {
  return (
    <div
      className={cn(variants[variant], className)}
      style={{ animationDelay: `${order * STAGGER_MS}ms`, ...style }}
      {...props}
    />
  );
}
