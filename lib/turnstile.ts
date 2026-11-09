import "server-only";

import { serverEnv } from "./env";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 5000;

export type TurnstileOutcome = "pass" | "fail" | "unavailable";

/**
 * Checks a Turnstile token with Cloudflare. "unavailable" means Cloudflare
 * couldn't give an answer (network error, timeout, 5xx), not that the token is bad.
 */
export async function verifyTurnstile(token: string, ip: string | null): Promise<TurnstileOutcome> {
  if (!token) return "fail";

  const body = new URLSearchParams({ secret: serverEnv().TURNSTILE_SECRET_KEY, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return "unavailable";

    const result = (await response.json()) as { success?: boolean; "error-codes"?: string[] };
    if (result.success === true) return "pass";
    if (result["error-codes"]?.includes("internal-error")) return "unavailable";
    return "fail";
  } catch {
    return "unavailable";
  }
}
