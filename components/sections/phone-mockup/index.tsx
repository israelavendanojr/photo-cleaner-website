"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type Variants,
} from "motion/react";

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
              <motion.div
                key={deletingIndex}
                initial={{ opacity: 0, scale: 0.8, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0, transition: springs.pop }}
                exit={{ opacity: 0, y: -4, transition: { duration: 0.3, ease: easeOutSoft } }}
                className="absolute top-8.5 right-5 origin-right rounded-pill bg-accent-soft px-2.5 py-0.75 text-micro font-semibold text-accent"
              >
                +{formatMB(deleting.sizeMB)}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute top-14.5 right-5 flex flex-col items-end gap-0.5">
            <Counter value={clearedAfter(cycle)} />
            <span className="text-micro text-mockup-muted">to clear</span>
          </div>

          {/* Card stack */}
          <div className="absolute top-31 left-3.5 h-111 w-83">
            <AnimatePresence initial={false}>
              <motion.div
                key={cycle + 1}
                variants={cardVariants}
                initial="enter"
                animate="back"
                exit="swipe"
                className="absolute inset-0 overflow-hidden rounded-photo shadow-photo will-change-transform"
              >
                <PhotoFace photo={back} />
                <Stamp photo={back} visible={false} />
              </motion.div>
              <motion.div
                key={cycle}
                variants={cardVariants}
                initial="enter"
                animate={leaning ? "lean" : "rest"}
                exit="swipe"
                className="absolute inset-0 overflow-hidden rounded-photo shadow-photo will-change-transform"
              >
                <PhotoFace photo={front} preload={cycle === 0} />
                <Stamp photo={front} visible={leaning} />
              </motion.div>
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
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, delay: visible ? 0.35 : 0, ease: easeOutSoft }}
    >
      <DeleteStamp sizeMB={photo.sizeMB} />
    </motion.div>
  );
}

/** "184 MB" that counts up smoothly when the value changes. */
function Counter({ value }: { value: number }) {
  const count = useMotionValue(value);
  const text = useTransform(count, (v) => formatMB(v, 0));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.1, ease: easeOutSoft });
    return () => controls.stop();
  }, [count, value]);

  return (
    <motion.span className="font-serif text-stat text-accent tabular-nums">{text}</motion.span>
  );
}
