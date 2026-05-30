import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseEnv } from "./env";

/**
 * Executes a Supabase Auth session refresh handshake at the Edge Proxy layer.
 * Persists updated tokens automatically inside request/response headers.
 */
export async function updateKairoSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseClient = createServerClient(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Calling getUser() triggers cookie verification/token refresh if expired
  const { data: { user } } = await supabaseClient.auth.getUser();

  return { response, user, supabaseClient };
}
