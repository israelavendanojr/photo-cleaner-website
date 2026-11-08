import type { ComponentProps, ElementType } from "react";

type VisuallyHiddenProps<T extends ElementType> = { as?: T } & ComponentProps<T>;

/** Hidden visually, still read by screen readers. */
export function VisuallyHidden<T extends ElementType = "span">({
  as,
  ...props
}: VisuallyHiddenProps<T>) {
  const Component = as ?? "span";
  return <Component className="sr-only" {...props} />;
}
