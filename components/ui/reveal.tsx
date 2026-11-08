import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";
import { STAGGER_MS } from "@/lib/motion";

type RevealProps = ComponentProps<"div"> & {
  /** Position in the entrance sequence; each step adds STAGGER_MS of delay. */
  order: number;
  variant?: "rise" | "rise-scale";
};

/**
 * Page-load entrance. Pure CSS so content paints before hydration;
 * skipped entirely under prefers-reduced-motion.
 */
export function Reveal({ order, variant = "rise", className, style, ...props }: RevealProps) {
  return (
    <div
      className={cn(
        variant === "rise" ? "motion-safe:animate-rise" : "motion-safe:animate-rise-scale",
        className,
      )}
      style={{ animationDelay: `${order * STAGGER_MS}ms`, ...style }}
      {...props}
    />
  );
}
