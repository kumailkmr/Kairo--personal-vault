import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "./env";

/**
 * Highly privileged server-only client using the service role key.
 * Enforces server-only execution statically via import 'server-only'.
 * Overrides PostgreSQL Row-Level Security (RLS) for system triggers, seeders, and administrative operations.
 */
export function createKairoAdminClient() {
  if (!supabaseEnv.serviceRoleKey || supabaseEnv.serviceRoleKey === "placeholder-service-role") {
    console.warn("⚠️ Kairo OS: Operating in mock mode. Service role client instantiated with placeholders.");
  }

  return createClient(supabaseEnv.url, supabaseEnv.serviceRoleKey || "placeholder-service-role", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
