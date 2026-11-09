import { brand } from "@/lib/brand";

/** The logo mark from components/ui/logo.tsx, with raw colors for next/og. */
export function OgLogoMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30">
      <g transform="translate(0.4 -0.8) rotate(20 15 15) translate(1.2 1.2) scale(0.92)">
        <rect x="13.3" y="1" width="3.4" height="13" rx="1.7" fill={brand.ink} />
        <rect x="9.5" y="13" width="11" height="4.2" rx="1.6" fill={brand.accent} />
        <path
          d="M10 18.2h10l3.9 9a1.4 1.4 0 0 1-1.3 1.9H7.4a1.4 1.4 0 0 1-1.3-1.9Z"
          fill={brand.ink}
        />
        <path
          d="M12.2 24.6 11.6 30M15 24.4V30M17.8 24.6l.6 5.4"
          stroke={brand.canvas}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
