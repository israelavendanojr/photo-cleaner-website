import { brand } from "@/lib/brand";

/** The logo mark from components/ui/logo.tsx, with raw colors for next/og. */
export function OgLogoMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30">
      <g transform="translate(0.6 -1.2) rotate(20 15 15) translate(1.5 1.5) scale(0.9)">
        <rect x="13.8" y="1.5" width="2.4" height="13" rx="1.2" fill={brand.ink} />
        <rect x="10.8" y="13.5" width="8.4" height="3.2" rx="1.2" fill={brand.accent} />
        <path
          d="M11 17h8l3.6 9.6a1.4 1.4 0 0 1-1.3 1.9H8.7a1.4 1.4 0 0 1-1.3-1.9Z"
          fill={brand.ink}
        />
        <path
          d="M13 20.5 12 28.5M15 20.5v8M17 20.5l1 8"
          stroke={brand.canvas}
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
