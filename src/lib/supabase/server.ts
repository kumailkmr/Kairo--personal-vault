import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

/**
 * Creates a server-side Supabase client for Server Components, Server Actions, and Route Handlers.
 */
export async function createKairoServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Fail gracefully. In Next.js, cookies cannot be set inside Server Components
          // during render, only inside Server Actions or Route Handlers.
        }
      },
    },
  });
}
