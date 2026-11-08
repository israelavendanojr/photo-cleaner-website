"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, type Variants } from "motion/react";
import * as m from "motion/react-m";

import { UndoIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { easeIn, easeOutSoft, springs } from "@/lib/motion";

import { ActionBar, TabBar } from "./chrome";
import { formatMB } from "./format";
import { DeleteStamp, PhotoFace } from "./photo-card";
import { mockPhotos, STARTING_MB, type MockPhoto } from "./photos";
import { useSwipeLoop } from "./use-swipe-loop";

const photoAt = (index: number) => mockPhotos[index % mockPhotos.length] as MockPhoto;

/** Total MB queued after `count` swipes. */
function clearedAfter(count: number) {
  let total = STARTING_MB;
  for (let i = 0; i < count; i++) total += photoAt(i).sizeMB;
  return total;
}

const COUNTER_MS = 1100;

const cardVariants = {
  enter: { x: 0, y: 28, scale: 0.9, rotate: 0, opacity: 0, zIndex: 0 },
  back: {
    x: 0,
    y: 12,
    scale: 0.95,
    rotate: 0,
    opacity: 1,
    zIndex: 1,
    transition: { ...springs.settle, opacity: { duration: 0.6, ease: easeOutSoft } },
  },
  rest: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 2, transition: springs.settle },
  lean: {
    x: -26,
    y: 0,
    scale: 1,
    rotate: -6,
    opacity: 1,
    zIndex: 2,
    transition: { duration: 1.1, ease: easeOutSoft },
  },
  swipe: {
    x: -500,
    y: 36,
    rotate: -20,
    zIndex: 3,
    transition: { duration: 0.65, ease: easeIn },
  },
} satisfies Variants;

export function PhoneMockup({ className }: { className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { phase, cycle } = useSwipeLoop(ref);

  const front = photoAt(cycle);
  const back = photoAt(cycle + 1);
  const leaning = phase === "lean";
  // The card the "+x MB" badge reports: the one leaning, then the one just swiped away.
  const deletingIndex = leaning ? cycle : cycle - 1;
  const deleting = photoAt(Math.max(deletingIndex, 0));

  return (
    <figure
      ref={ref}
      role="img"
      aria-label="Bristle on iPhone: photos are swiped toward Delete one at a time while the space to clear adds up."
      className={cn("origin-top max-[440px]:-mb-24.25 max-[440px]:scale-88", className)}
    >
      <div
        aria-hidden="true"
        className="relative h-202 w-96 rounded-device bg-device p-3 shadow-device"
      >
        <div className="relative h-196 w-90 overflow-hidden rounded-screen bg-canvas">
          {/* Dynamic Island */}
          <div className="absolute top-2.75 left-1/2 z-10 h-7.5 w-26 -translate-x-1/2 rounded-island bg-black" />

          {/* Top bar */}
          <div className="absolute top-15 left-5 flex size-11 items-center justify-center rounded-pill border-control border-line text-mockup-muted">
            <UndoIcon size={18} strokeWidth={2} />
          </div>
          <AnimatePresence initial={false}>
            {phase !== "rest" && (
              <m.div
                key={deletingIndex}
                initial={{ opacity: 0, scale: 0.8, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: springs.pop }}
                exit={{ opacity: 0, y: -4, transition: { duration: 0.3, ease: easeOutSoft } }}
                className="absolute top-8.5 right-5 origin-right rounded-pill bg-accent-soft px-2.5 py-0.75 text-micro font-semibold text-accent-ink"
              >
                +{formatMB(deleting.sizeMB)}
              </m.div>
            )}
          </AnimatePresence>
          <div className="absolute top-14.5 right-5 flex flex-col items-end gap-0.5">
            <Counter value={clearedAfter(cycle)} />
            <span className="text-micro text-ink-muted">to clear</span>
          </div>

          {/* Card stack */}
          <div className="absolute top-31 left-3.5 h-111 w-83">
            <AnimatePresence initial={false}>
              <m.div
                key={cycle + 1}
                variants={cardVariants}
                initial="enter"
                animate="back"
                exit="swipe"
                className="absolute inset-0 overflow-hidden rounded-photo shadow-photo will-change-transform"
              >
                <PhotoFace photo={back} />
                <Stamp photo={back} visible={false} />
              </m.div>
              <m.div
                key={cycle}
                variants={cardVariants}
                initial="enter"
                animate={leaning ? "lean" : "rest"}
                exit="swipe"
                className="absolute inset-0 overflow-hidden rounded-photo shadow-photo will-change-transform"
              >
                <PhotoFace photo={front} preload={cycle === 0} />
                <Stamp photo={front} visible={leaning} />
              </m.div>
            </AnimatePresence>
          </div>

          <ActionBar />
          <TabBar />

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 h-1.25 w-32 -translate-x-1/2 rounded-bar bg-ink" />
        </div>
      </div>
    </figure>
  );
}

/** Delete stamp that fades in as the card leans. Stays visible while the card swipes away. */
function Stamp({ photo, visible }: { photo: MockPhoto; visible: boolean }) {
  return (
    <m.div
      className="absolute inset-0"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, delay: visible ? 0.35 : 0, ease: easeOutSoft }}
    >
      <DeleteStamp sizeMB={photo.sizeMB} />
    </m.div>
  );
}

/** "184 MB" that counts up smoothly when the value changes. */
function Counter({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const shownRef = useRef(value);

  // A tiny rAF tween keeps the full Motion animation engine out of the bundle.
  useEffect(() => {
    const from = shownRef.current;
    if (from === value) return;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min((now - start) / COUNTER_MS, 1);
      shownRef.current = from + (value - from) * (1 - (1 - t) ** 3);
      setShown(shownRef.current);
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span className="font-serif text-stat text-accent tabular-nums">{formatMB(shown, 0)}</span>
  );
}
