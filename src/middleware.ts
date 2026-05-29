import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
 * Next.js Edge Middleware for Workspace Session Protection.
 * Resolves cookie verification and routes unauthorized guests back to the Ingress gate.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Check if the requested route requires operator/client authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  // 2. Fetch the session JSON web token from cookies (Set upon login)
  const sessionCookie = request.cookies.get("kairo_jwt_session");
  const isAuthenticated = !!sessionCookie;

  // 3. Security Redirection Gateways
  if (isProtectedRoute && !isAuthenticated) {
    // Save intended destination so user can be redirected back after successful auth
    const loginUrl = new URL(AUTH_GATEWAY, request.url);
    loginUrl.searchParams.set("destination", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. If logged in, block accessing the /auth screen again
  if (pathname === AUTH_GATEWAY && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 5. Hydrate standard security headers to block clickjacking and cross-site scripting (XSS)
  const response = NextResponse.next();
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
