import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { serverEnv } from "./env";

let client: SupabaseClient | undefined;

/** Supabase client authenticated with the secret key. Server only; no user sessions. */
export function supabaseServer(): SupabaseClient {
  if (client) return client;
  const env = serverEnv();
  client = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}
