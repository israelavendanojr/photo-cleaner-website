"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useAnimate } from "motion/react-mini";

import { Button } from "@/components/ui/button";
import { SpinnerIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { easeOutSoft, fade } from "@/lib/motion";
import { validateEmail } from "@/lib/validation";
import { joinWaitlist } from "@/lib/waitlist";

import { SuccessPill } from "./success-pill";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; email: string }
  | { status: "error"; message: string };

const HINT = "One email when it's ready. Nothing else.";

function focusOnMount(node: HTMLElement | null) {
  node?.focus({ preventScroll: true });
}

export function WaitlistForm({ className }: { className?: string }) {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [email, setEmail] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [rowRef, animateRow] = useAnimate<HTMLDivElement>();
  const reducedMotion = useReducedMotion();
  // Height of the form when it is swapped out, so the page below never jumps.
  const [reservedHeight, setReservedHeight] = useState<number>();
  const ids = { input: useId(), message: useId(), honeypot: useId() };

  const submitting = state.status === "submitting";
  const error = state.status === "error" ? state.message : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const validation = validateEmail(email);
    if (!validation.ok) {
      setState({ status: "error", message: validation.message });
      nudge();
      return;
    }

    setState({ status: "submitting" });
    const result = await joinWaitlist(validation.email, {
      honeypot: honeypotRef.current?.value ?? "",
    });
    if (result.ok) {
      setReservedHeight(formRef.current?.offsetHeight);
      setState({ status: "success", email: validation.email });
    } else {
      setState({ status: "error", message: result.message });
      nudge();
    }
  }

  /** A small horizontal shake on error, like a rejected password on iOS. */
  function nudge() {
    if (reducedMotion || !rowRef.current) return;
    animateRow(rowRef.current, { x: [0, -7, 6, -4, 2, 0] }, { duration: 0.42, ease: "easeOut" });
  }

  function handleChange(value: string) {
    setEmail(value);
    // Re-validate live only once an error is showing, so typing clears it.
    if (state.status === "error") {
      const validation = validateEmail(value);
      if (validation.ok) setState({ status: "idle" });
    }
  }

  return (
    <div className={className} style={{ minHeight: reservedHeight }}>
      {/* Announces progress and success; errors are announced by the message slot below. */}
      <p role="status" className="sr-only">
        {submitting && "Joining the waitlist…"}
        {state.status === "success" && "You're on the list."}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {state.status === "success" ? (
          <m.div
            key="success"
            // The form (and the focused button) unmounts on success; keep keyboard focus here.
            ref={focusOnMount}
            tabIndex={-1}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOutSoft }}
            className="flex flex-col items-start gap-3 outline-none"
          >
            <SuccessPill />
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...fade, delay: 0.25 }}
              className="ml-6 text-caption text-ink-muted"
            >
              We&apos;ll write to {state.email} the day Bristle is ready.
            </m.p>
          </m.div>
        ) : (
          <m.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.25, ease: easeOutSoft } }}
            className="flex flex-col"
          >
            <div ref={rowRef} className="flex flex-wrap gap-2.5">
              <label htmlFor={ids.input} className="sr-only">
                Email address
              </label>
              <Input
                id={ids.input}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="you@example.com"
                aria-required="true"
                aria-invalid={error ? true : undefined}
                aria-describedby={ids.message}
                value={email}
                onChange={(event) => handleChange(event.target.value)}
                className="flex-1 basis-60"
              />

              {/* Honeypot: invisible to people and assistive tech; bots tend to fill it. */}
              <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
                <label htmlFor={ids.honeypot}>Company</label>
                <input
                  ref={honeypotRef}
                  id={ids.honeypot}
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue=""
                />
              </div>

              <Button type="submit" aria-disabled={submitting || undefined} className="relative">
                <span className={cn(submitting && "invisible")}>Join the waitlist</span>
                {submitting && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <SpinnerIcon className="motion-safe:animate-spin" />
                  </span>
                )}
              </Button>
            </div>

            {/*
            CAPTCHA: mount the bot-protection widget here (e.g. Turnstile in
            invisible/managed mode) and pass its token through joinWaitlist().
            It must not add visible height to the form.
          */}

            <p
              id={ids.message}
              aria-live="polite"
              className={cn(
                "mt-hint ml-6 text-caption",
                error ? "font-medium text-accent-ink" : "text-ink-muted",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <m.span
                  key={error ?? "hint"}
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={fade}
                  className="block"
                >
                  {error ?? HINT}
                </m.span>
              </AnimatePresence>
            </p>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}
