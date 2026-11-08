import type { ReactNode } from "react";

import { ArrowUpIcon, CheckIcon, FeedIcon, LibraryIcon, TrashIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/** Delete / Later / Keep buttons under the card stack. */
export function ActionBar() {
  return (
    <div className="absolute inset-x-0 top-146 flex items-start justify-center gap-7">
      <ActionButton label="Delete" className="size-17 bg-accent-soft text-accent">
        <TrashIcon size={26} />
      </ActionButton>
      <ActionButton
        label="Later"
        raised
        className="size-13 border-control border-line bg-surface text-ink"
      >
        <ArrowUpIcon size={20} strokeWidth={1.9} />
      </ActionButton>
      <ActionButton label="Keep" className="size-17 border-control border-line bg-surface text-ink">
        <CheckIcon size={26} strokeWidth={1.9} />
      </ActionButton>
    </div>
  );
}

function ActionButton({
  label,
  className,
  raised = false,
  children,
}: {
  label: string;
  /** Size and colors of the circle. */
  className: string;
  /** Smaller center button sits slightly lower, as in the app. */
  raised?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-1.5", raised && "mt-2")}>
      <div className={cn("flex items-center justify-center rounded-pill", className)}>
        {children}
      </div>
      <span className="text-micro text-mockup-muted">{label}</span>
    </div>
  );
}

/** Feed / Library pill tab bar. */
export function TabBar() {
  return (
    <div className="absolute bottom-6.5 left-1/2 flex -translate-x-1/2 gap-1 rounded-pill border border-line bg-surface p-1.5 shadow-card">
      <div className="flex h-12 items-center gap-2 rounded-pill bg-ink px-5 text-body font-semibold text-white">
        <FeedIcon size={20} />
        Feed
      </div>
      <div className="flex h-12 items-center gap-2 rounded-pill px-5 text-body font-semibold text-mockup-muted">
        <LibraryIcon size={20} />
        Library
      </div>
    </div>
  );
}
