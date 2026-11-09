import { z } from "zod";

/**
 * Browser-safe environment. Kept apart from lib/env.ts (server-only) so client
 * components can import it. `NEXT_PUBLIC_*` values are inlined at build time,
 * which only works with literal `process.env.NAME` access.
 */
export const clientEnv = z.object({ NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1) }).parse(
  { NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY },
  {
    error: () => "Missing NEXT_PUBLIC_TURNSTILE_SITE_KEY. Set it in .env.local (see .env.example).",
  },
);
