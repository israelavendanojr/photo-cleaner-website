import { useId } from "react";

/*
 * Flat illustrated "photos" in the same style as the exported mockup images.
 * Colors here are illustration content, not UI tokens.
 */

export function DuskArt() {
  const id = useId();
  return (
    <svg viewBox="0 0 750 1125" preserveAspectRatio="xMidYMid slice" className="size-full">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5E5470" />
          <stop offset="0.55" stopColor="#B9858A" />
          <stop offset="1" stopColor="#EDB892" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#F7D3A6" />
          <stop offset="1" stopColor="#F7D3A6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="750" height="1125" fill={`url(#${id}-sky)`} />
      <circle cx="250" cy="700" r="170" fill={`url(#${id}-sun)`} />
      <path d="M0 720 L160 600 L300 690 L460 560 L620 670 L750 610 V1125 H0Z" fill="#6B4E5C" />
      <path d="M0 830 L200 720 L380 800 L560 700 L750 790 V1125 H0Z" fill="#4A3644" />
      <path d="M0 960 Q375 880 750 960 V1125 H0Z" fill="#33252F" />
    </svg>
  );
}

export function MeadowArt() {
  const id = useId();
  return (
    <svg viewBox="0 0 750 1125" preserveAspectRatio="xMidYMid slice" className="size-full">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DCE6DA" />
          <stop offset="1" stopColor="#F4EEDC" />
        </linearGradient>
      </defs>
      <rect width="750" height="1125" fill={`url(#${id}-sky)`} />
      <circle cx="560" cy="300" r="70" fill="#F8E3B8" />
      <path d="M0 700 Q200 600 420 680 T750 650 V1125 H0Z" fill="#AFC29A" />
      <path d="M0 820 Q260 730 520 800 T750 790 V1125 H0Z" fill="#8FA77B" />
      <path d="M0 950 Q375 880 750 940 V1125 H0Z" fill="#6E8A5E" />
    </svg>
  );
}
