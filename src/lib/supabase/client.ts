import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "./env";

/**
 * Creates a client-side Supabase client for use in browser components.
 */
export function createKairoBrowserClient() {
  return createBrowserClient(supabaseEnv.url, supabaseEnv.anonKey);
}

// Singleton browser client instance for ease of use
export const supabaseBrowserClient = createKairoBrowserClient();
