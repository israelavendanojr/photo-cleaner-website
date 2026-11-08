import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

export const inputVariants = cva(
  "w-full min-w-0 border-control bg-surface text-ink shadow-input transition-[border-color,box-shadow] duration-200 ease-out-soft placeholder:text-ink-muted hover:border-ink-muted/40 focus:border-ink focus:ring-4 focus:ring-ink/8 focus-visible:outline-none aria-invalid:border-accent",
  {
    variants: {
      size: {
        lg: "h-control rounded-pill border-line px-6 text-control",
      },
    },
    defaultVariants: { size: "lg" },
  },
);

export type InputProps = Omit<ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>;

export function Input({ className, size, ...props }: InputProps) {
  return <input className={cn(inputVariants({ size }), className)} {...props} />;
}
