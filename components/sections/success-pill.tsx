"use client";

import * as m from "motion/react-m";

import { Badge } from "@/components/ui/badge";
import { easeOutSoft, springs } from "@/lib/motion";

export function SuccessPill() {
  return (
    <Badge variant="success" className="gap-2.5">
      <m.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...springs.pop, delay: 0.1 }}
        className="flex size-10 items-center justify-center rounded-pill bg-accent text-white"
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <m.path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.25, ease: easeOutSoft }}
          />
        </svg>
      </m.span>
      You&apos;re on the list.
    </Badge>
  );
}
