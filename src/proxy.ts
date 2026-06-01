import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateKairoSession } from "@/lib/supabase/middleware";
// ═══════════════════════════════════════════════════════════════
// ROUTE PROTECTION CONFIGURATION
// ═══════════════════════════════════════════════════════════════

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
  "/communications",
  "/admin",
];

const AUTH_GATEWAY = "/auth";

// ═══════════════════════════════════════════════════════════════
// EDGE-BASED IN-MEMORY RATE LIMITER
// ═══════════════════════════════════════════════════════════════
// Suitable for Vercel Edge Runtime. Each cold start resets the map.
// For persistent rate limiting at scale, upgrade to Upstash Redis.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configs: [max requests, window in seconds]
const RATE_LIMITS: Record<string, [number, number]> = {
  "/auth": [5, 60],           // 5 auth attempts per minute
  "/onboard": [3, 60],        // 3 onboarding submissions per minute
  "/api": [30, 60],           // 30 API calls per minute
};

function getClientIdentifier(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

function checkRateLimit(
  identifier: string,
  path: string
): { allowed: boolean; remaining: number; resetIn: number } {
  // Find matching rate limit config
  const configKey = Object.keys(RATE_LIMITS).find((key) =>
    path.startsWith(key)
  );
  if (!configKey) return { allowed: true, remaining: -1, resetIn: 0 };

  const [maxRequests, windowSeconds] = RATE_LIMITS[configKey];
  const key = `${identifier}:${configKey}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now >= entry.resetAt) {
    // New window
    rateLimitStore.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowSeconds };
  }

  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    const resetIn = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, resetIn };
  }

  // Increment counter
  entry.count++;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetIn: Math.ceil((entry.resetAt - now) / 1000),
  };
}

// Periodic cleanup of expired entries (every 100 requests)
let requestCounter = 0;
function cleanupExpiredEntries() {
  requestCounter++;
  if (requestCounter % 100 !== 0) return;
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// PROXY HANDLER
// ═══════════════════════════════════════════════════════════════

/**
 * Next.js Edge Proxy for Workspace Session Protection, Rate Limiting,
 * and Security Header Enforcement.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Rate Limiting ───────────────────────────────────────────
  cleanupExpiredEntries();
  const clientId = getClientIdentifier(request);
  const rateCheck = checkRateLimit(clientId, pathname);

  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please wait before retrying.",
        retryAfter: rateCheck.resetIn,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateCheck.resetIn),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rateCheck.resetIn),
        },
      }
    );
  }

  // ─── Session Verification ──────────────────────────────────
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const { response, user } = await updateKairoSession(request);

  const isAuthenticated = !!user;

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(AUTH_GATEWAY, request.url);
    loginUrl.searchParams.set("destination", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login portal
  if (pathname === AUTH_GATEWAY && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ─── Security Headers ─────────────────────────────────────
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://*.supabase.co",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co ws: wss:",
      "font-src 'self'",
      "frame-ancestors 'none'",
    ].join("; ")
  );

  // Rate limit headers on successful responses
  if (rateCheck.remaining >= 0) {
    response.headers.set("X-RateLimit-Remaining", String(rateCheck.remaining));
    response.headers.set("X-RateLimit-Reset", String(rateCheck.resetIn));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder resources (images, grids)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|grid.svg).*)",
  ],
};
