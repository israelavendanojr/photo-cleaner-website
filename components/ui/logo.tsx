import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect
        x="9"
        y="3"
        width="17"
        height="22"
        rx="5.5"
        className="fill-line"
        transform="rotate(8 17.5 14)"
      />
      <rect x="4" y="5" width="17" height="22" rx="5.5" className="fill-ink" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark />
      <span className="font-serif text-wordmark font-medium">Bristle</span>
    </span>
  );
}
