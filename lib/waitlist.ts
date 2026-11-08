/**
 * The only bridge between the UI and the waitlist backend.
 *
 * Today this is a STUB: it waits ~800ms and reports success. When the backend
 * exists, replace the body of `joinWaitlist` with a real request (e.g.
 * `fetch("/api/waitlist", …)`) and map its responses onto `JoinResult`.
 * The form only depends on this signature, so no UI code needs to change.
 */

export type JoinErrorCode = "invalid_email" | "rate_limited" | "network" | "unknown";

export type JoinResult =
  | { ok: true; status: "joined" | "already_joined" }
  | { ok: false; error: JoinErrorCode; message: string };

export type JoinOptions = {
  /** Value of the hidden honeypot field. Humans leave it empty; the backend will reject non-empty values. */
  honeypot?: string;
};

const STUB_LATENCY_MS = 800;

export async function joinWaitlist(email: string, options: JoinOptions = {}): Promise<JoinResult> {
  // TODO(backend): POST { email, honeypot: options.honeypot } to the waitlist API.
  void email;
  void options;
  await new Promise((resolve) => setTimeout(resolve, STUB_LATENCY_MS));
  return { ok: true, status: "joined" };
}
