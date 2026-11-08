import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Stroke({ size = 24, strokeWidth = 1.8, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </Stroke>
  );
}

export function UndoIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </Stroke>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V4.5h6V7" />
      <path d="m6.5 7 1 12.5h9l1-12.5" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </Stroke>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Stroke>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </Stroke>
  );
}

export function LibraryIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="7" y="7" width="14" height="13" rx="2.5" />
      <path d="M3.5 16V5.5a2 2 0 0 1 2-2H17" />
      <path d="m9 17.5 3.2-3.6 2.3 2.4 1.6-1.6 2.9 2.8" />
    </Stroke>
  );
}

export function FeedIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect x="4" y="8" width="16" height="13" rx="3" fill="currentColor" />
      <path
        d="M6.5 5.2h11M8.5 2.6h7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SpinnerIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.4" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
