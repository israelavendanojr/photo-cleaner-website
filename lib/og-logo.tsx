import { brand } from "@/lib/brand";

/** The logo mark from components/ui/logo.tsx, with raw colors for next/og. */
export function OgLogoMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30">
      <rect
        x="9"
        y="3"
        width="17"
        height="22"
        rx="5.5"
        fill={brand.line}
        transform="rotate(8 17.5 14)"
      />
      <rect x="4" y="5" width="17" height="22" rx="5.5" fill={brand.ink} />
    </svg>
  );
}
