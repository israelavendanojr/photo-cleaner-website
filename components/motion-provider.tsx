"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Motion honours the OS "reduce motion" setting everywhere below this. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
