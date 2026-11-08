import type { Transition } from "motion/react";

/** Apple-like ease-out; mirrors --ease-out-soft in globals.css. */
export const easeOutSoft = [0.22, 1, 0.36, 1] as const;
/** Accelerating ease for elements leaving the screen. */
export const easeIn = [0.4, 0, 1, 1] as const;

/** Delay between items in the page-load entrance (ms). */
export const STAGGER_MS = 80;

export const springs = {
  /** Cards settling into place. */
  settle: { type: "spring", stiffness: 170, damping: 24, mass: 1 },
  /** Small UI pops (badges, check marks). */
  pop: { type: "spring", stiffness: 420, damping: 26 },
} satisfies Record<string, Transition>;

export const fade: Transition = { duration: 0.35, ease: easeOutSoft };
