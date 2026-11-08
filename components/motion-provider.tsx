"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Loads only Motion's DOM animation features (no layout/drag) and honours the
 * OS "reduce motion" setting everywhere below. Use `m.*` from "motion/react-m",
 * not `motion.*`, inside this tree (`strict` enforces it).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
