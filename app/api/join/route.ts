import { z } from "zod";

import { maskEmail } from "@/lib/log";
import { supabaseServer } from "@/lib/supabase-server";
import { verifyTurnstile } from "@/lib/turnstile";
import { normalizeEmail } from "@/lib/validation";
import { MIN_SUBMIT_MS } from "@/lib/waitlist";

const bodySchema = z.object({
  email: z.string().max(1024),
  honeypot: z.string().max(256).default(""),
  elapsedMs: z.number().finite(),
  turnstileToken: z.string().max(4096).default(""),
});

const NO_STORE = { "Cache-Control": "no-store" };

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: NO_STORE });
}

// Identical for new emails, duplicates and silently dropped bots, so the
// response never reveals who is on the list.
const success = () => json({ ok: true });

function clientIp(request: Request): string | null {
  const { headers } = request;
  return (
    headers.get("cf-connecting-ip") ??
    headers.get("x-real-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null
  );
}

export async function POST(request: Request) {
  try {
    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return json({ error: "invalid_request" }, 400);
    const { email, honeypot, elapsedMs, turnstileToken } = parsed.data;

    if (honeypot !== "" || elapsedMs < MIN_SUBMIT_MS) return success();

    const verification = await verifyTurnstile(turnstileToken, clientIp(request));
    if (verification === "fail") return json({ error: "verification_failed" }, 403);
    if (verification === "unavailable") {
      // Fail open: a waitlist signup is low risk, and the honeypot and timing checks still apply.
      console.warn("[join] Turnstile unavailable; allowing signup without verification");
    }

    const normalized = normalizeEmail(email);
    if (!normalized.ok) return json({ error: "invalid_email" }, 400);

    const { error } = await supabaseServer().from("waitlist").insert({ email: normalized.email });
    if (error) {
      if (error.code === "23505") return success(); // Already on the list.
      if (error.code === "23514") return json({ error: "invalid_email" }, 400); // Table check constraint.
      console.error("[join] Insert failed", {
        code: error.code,
        message: error.message,
        email: maskEmail(normalized.email),
      });
      return json({ error: "unknown" }, 500);
    }

    return success();
  } catch (error) {
    console.error("[join] Unexpected error", error instanceof Error ? error.message : error);
    return json({ error: "unknown" }, 500);
  }
}
