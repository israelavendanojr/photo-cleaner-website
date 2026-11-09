import { timingSafeEqual } from "node:crypto";
import { connection } from "next/server";

import { serverEnv } from "@/lib/env";
import { supabaseServer } from "@/lib/supabase-server";

const NO_STORE = { "Cache-Control": "no-store" };

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: NO_STORE });
}

function isAuthorized(header: string | null, secret: string): boolean {
  if (!header) return false;
  const actual = Buffer.from(header);
  const expected = Buffer.from(`Bearer ${secret}`);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/**
 * Daily Vercel Cron ping (see vercel.json) so the free Supabase project isn't
 * paused for inactivity. Vercel sends `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(request: Request) {
  // Always run at request time; never prerender or cache.
  await connection();

  try {
    if (!isAuthorized(request.headers.get("authorization"), serverEnv().CRON_SECRET)) {
      return json({ error: "unauthorized" }, 401);
    }

    const { error } = await supabaseServer().from("waitlist").select("id").limit(1);
    if (error) {
      console.error("[keepalive] Query failed", { code: error.code, message: error.message });
      return json({ error: "unknown" }, 500);
    }
    return json({ ok: true });
  } catch (error) {
    console.error("[keepalive] Unexpected error", error instanceof Error ? error.message : error);
    return json({ error: "unknown" }, 500);
  }
}
