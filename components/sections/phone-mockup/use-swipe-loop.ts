"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * One cycle of the mockup:
 *   rest   → front card sits still
 *   lean   → card tilts toward Delete, stamp fades in
 *   settle → card swipes away, counter ticks up, next card settles
 */
export type SwipePhase = "rest" | "lean" | "settle";

const PHASE_MS: Record<SwipePhase, number> = {
  rest: 1300,
  lean: 1700,
  settle: 1500,
};

const NEXT: Record<SwipePhase, SwipePhase> = { rest: "lean", lean: "settle", settle: "rest" };

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function usePageVisible() {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => false,
  );
}

/**
 * Drives the card loop. Starts on the "lean" frame (matches the static design
 * and the server render) and only advances while the phone is on screen, the
 * tab is visible and the user hasn't asked for reduced motion.
 */
export function useSwipeLoop(ref: RefObject<HTMLElement | null>) {
  const [phase, setPhase] = useState<SwipePhase>("lean");
  const [cycle, setCycle] = useState(0);

  const inView = useInView(ref, { amount: 0.35 });
  const visible = usePageVisible();
  const reducedMotion = useReducedMotion();
  const running = inView && visible && reducedMotion === false;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      const next = NEXT[phase];
      if (next === "settle") setCycle((c) => c + 1);
      setPhase(next);
    }, PHASE_MS[phase]);
    return () => window.clearTimeout(timer);
  }, [phase, running]);

  return { phase, cycle };
}
