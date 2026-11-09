"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useAnimate } from "motion/react-mini";

import { Button } from "@/components/ui/button";
import { SpinnerIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { clientEnv } from "@/lib/env-client";
import { easeOutSoft, fade } from "@/lib/motion";
import { validateEmail } from "@/lib/validation";
import { joinWaitlist } from "@/lib/waitlist";

import { SuccessPill } from "./success-pill";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; email: string; alreadyJoined: boolean }
  | { status: "error"; message: string };

const HINT = "One email when it's ready. Nothing else.";

/** If Turnstile hasn't produced a token by then (blocked, slow, erroring), let people submit anyway. */
const CAPTCHA_GRACE_MS = 8000;

function msSince(timestamp: number) {
  return Date.now() - timestamp;
}

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

  // Bot protection: time since mount, plus a single-use Turnstile token.
  const mountedAt = useRef(0);
  const turnstileRef = useRef<TurnstileInstance>(undefined);
  const tokenRef = useRef<string | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [widgetFailed, setWidgetFailed] = useState(false);
  const [graceElapsed, setGraceElapsed] = useState(false);
  const [graceEpoch, setGraceEpoch] = useState(0);
  const [challengeVisible, setChallengeVisible] = useState(false);
  const captchaReady = hasToken || widgetFailed || graceElapsed;
  const captchaReadyRef = useRef(captchaReady);
  const resolveCaptchaReady = useRef<(() => void) | null>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setGraceElapsed(true), CAPTCHA_GRACE_MS);
    return () => clearTimeout(timer);
  }, [graceEpoch]);

  useEffect(() => {
    captchaReadyRef.current = captchaReady;
    if (captchaReady) {
      resolveCaptchaReady.current?.();
      resolveCaptchaReady.current = null;
    }
  }, [captchaReady]);

  function setToken(token: string | null) {
    tokenRef.current = token;
    setHasToken(token !== null);
  }

  /** Clicks that land before the widget is ready wait (with the spinner) instead of being dropped. */
  function waitForCaptcha() {
    if (captchaReadyRef.current) return Promise.resolve();
    return new Promise<void>((resolve) => {
      resolveCaptchaReady.current = resolve;
    });
  }

  /** Tokens are single use: get a fresh one after every attempt. */
  function resetCaptcha() {
    setToken(null);
    setWidgetFailed(false);
    setGraceElapsed(false);
    setGraceEpoch((epoch) => epoch + 1);
    turnstileRef.current?.reset();
  }

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
    await waitForCaptcha();
    const result = await joinWaitlist(validation.email, {
      honeypot: honeypotRef.current?.value ?? "",
      elapsedMs: msSince(mountedAt.current),
      turnstileToken: tokenRef.current ?? "",
    });
    resetCaptcha();
    if (result.ok) {
      setReservedHeight(formRef.current?.offsetHeight);
      setState({
        status: "success",
        email: validation.email,
        alreadyJoined: result.status === "already_joined",
      });
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
        {state.status === "success" &&
          (state.alreadyJoined ? "You're already on the list." : "You're on the list.")}
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
            <SuccessPill
              label={state.alreadyJoined ? "You're already on the list." : "You're on the list."}
            />
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...fade, delay: 0.25 }}
              className="ml-6 text-caption text-ink-muted"
            >
              {state.alreadyJoined ? (
                <>We're happy to see you again. We&apos;ll reach out at launch.</>
              ) : (
                <>We&apos;ll write to {state.email} once Bristle is ready.</>
              )}
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

              <Button
                type="submit"
                aria-disabled={submitting || !captchaReady || undefined}
                className="relative"
              >
                <span className={cn(submitting && "invisible")}>Join the waitlist</span>
                {submitting && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <SpinnerIcon className="motion-safe:animate-spin" />
                  </span>
                )}
              </Button>
            </div>

            {/*
            Turnstile (Managed mode). Takes no space unless Cloudflare asks for
            a click, then the checkbox slides open below the row.
          */}
            <m.div
              initial={false}
              animate={
                challengeVisible ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
              }
              transition={{ duration: 0.3, ease: easeOutSoft }}
              className="overflow-hidden"
            >
              <Turnstile
                ref={turnstileRef}
                siteKey={clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                options={{
                  theme: "light",
                  appearance: "interaction-only",
                  size: "flexible",
                  refreshExpired: "auto",
                }}
                onSuccess={(token) => setToken(token)}
                onExpire={() => setToken(null)}
                onError={() => setWidgetFailed(true)}
                onUnsupported={() => setWidgetFailed(true)}
                onBeforeInteractive={() => setChallengeVisible(true)}
                onAfterInteractive={() => setChallengeVisible(false)}
                className="mt-hint"
              />
            </m.div>

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
