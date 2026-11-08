import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-pill font-semibold whitespace-nowrap transition-[background-color,transform,opacity] duration-200 ease-out-soft select-none disabled:cursor-default",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-white hover:bg-black active:scale-98 disabled:hover:bg-ink disabled:active:scale-100",
      },
      size: {
        lg: "h-control px-7 text-control",
      },
    },
    defaultVariants: { variant: "primary", size: "lg" },
  },
);

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
