/**
 * The only bridge between the UI and the waitlist backend.
 *
 * POSTs to /api/join (app/api/join/route.ts) and maps its responses onto
 * `JoinResult`. The form only depends on this signature.
 */

export type JoinErrorCode =
  "invalid_email" | "verification_failed" | "rate_limited" | "network" | "unknown";

export type JoinResult =
  | { ok: true; status: "joined" | "already_joined" }
  | { ok: false; error: JoinErrorCode; message: string };

export type JoinOptions = {
  /** Value of the hidden honeypot field. Humans leave it empty; the backend drops non-empty values. */
  honeypot?: string;
  /** Milliseconds between the form mounting and submit. Very fast submissions are dropped as bots. */
  elapsedMs?: number;
  /** Cloudflare Turnstile token. Single use, so get a fresh one for every attempt. */
  turnstileToken?: string;
};

/** The server silently drops submissions sent sooner than this after the form mounted. */
export const MIN_SUBMIT_MS = 2000;

const MESSAGES: Record<JoinErrorCode, string> = {
  invalid_email: "Enter a valid email, like you@example.com.",
  verification_failed: "We couldn't verify you're human. Please try again.",
  rate_limited: "Too many attempts. Please wait a moment and try again.",
  network: "Couldn't reach the server. Check your connection and try again.",
  unknown: "Something went wrong. Please try again.",
};

function failure(error: JoinErrorCode): JoinResult {
  return { ok: false, error, message: MESSAGES[error] };
}

export async function joinWaitlist(email: string, options: JoinOptions = {}): Promise<JoinResult> {
  // A person who autofills and clicks right away would trip the bot timer; hold them briefly instead.
  let elapsedMs = options.elapsedMs ?? 0;
  if (elapsedMs < MIN_SUBMIT_MS) {
    await new Promise((resolve) => setTimeout(resolve, MIN_SUBMIT_MS - elapsedMs));
    elapsedMs = MIN_SUBMIT_MS;
  }

  let response: Response;
  try {
    response = await fetch("/api/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        honeypot: options.honeypot ?? "",
        elapsedMs,
        turnstileToken: options.turnstileToken ?? "",
      }),
    });
  } catch {
    return failure("network");
  }

  if (response.ok) {
    const body = (await response.json().catch(() => null)) as { status?: string } | null;
    return { ok: true, status: body?.status === "already_joined" ? "already_joined" : "joined" };
  }

  const body = (await response.json().catch(() => null)) as { error?: string } | null;
  if (response.status === 400 && body?.error === "invalid_email") return failure("invalid_email");
  if (response.status === 403) return failure("verification_failed");
  if (response.status === 429) return failure("rate_limited");
  return failure("unknown");
}
