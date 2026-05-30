import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateKairoSession } from "@/lib/supabase/middleware";
import { isMockMode } from "@/lib/supabase/env";

// Standard list of protected executive route paths
const PROTECTED_ROUTES = [
  "/dashboard",
  "/analytics",
  "/meetings",
  "/clients",
  "/documents",
  "/ai-ops",
  "/settings",
  "/goals",
  "/personal",
  "/notifications",
  "/projects",
  "/revenue",
  "/communications"
];

const AUTH_GATEWAY = "/auth";

/**
 * Next.js Edge Proxy for Workspace Session Protection.
 * Coordinates real-time Supabase Auth session refresh and routes guests back to Ingress.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  // 1. Execute Supabase cookie refresh handshake
  const { response, user } = await updateKairoSession(request);

  // 2. Session verification (supports mock sandbox session fallbacks)
  const sessionCookie = request.cookies.get("kairo_jwt_session");
  const isAuthenticated = isMockMode ? !!sessionCookie : !!user;

  // 3. Security Redirection Gateways
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(AUTH_GATEWAY, request.url);
    loginUrl.searchParams.set("destination", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Block authenticated users from entering /auth login portal again
  if (pathname === AUTH_GATEWAY && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 5. Hydrate standard security headers to block clickjacking and cross-site scripting (XSS)
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws: wss:;"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder resources (images, grids)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|grid.svg).*)"
  ]
};
