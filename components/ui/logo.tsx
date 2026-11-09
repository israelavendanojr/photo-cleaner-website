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
      <g transform="translate(0.6 -1.2) rotate(20 15 15) translate(1.5 1.5) scale(0.9)">
        <rect x="13.8" y="1.5" width="2.4" height="13" rx="1.2" className="fill-ink" />
        <rect x="10.8" y="13.5" width="8.4" height="3.2" rx="1.2" className="fill-accent" />
        <path
          d="M11 17h8l3.6 9.6a1.4 1.4 0 0 1-1.3 1.9H8.7a1.4 1.4 0 0 1-1.3-1.9Z"
          className="fill-ink"
        />
        <path
          d="M13 20.5 12 28.5M15 20.5v8M17 20.5l1 8"
          className="stroke-canvas"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>
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
