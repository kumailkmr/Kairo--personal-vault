/**
 * ═══════════════════════════════════════════════════════════════
 * KAIRO OS — HEALTH CHECK ENDPOINT
 * ═══════════════════════════════════════════════════════════════
 * 
 * GET /api/health
 * 
 * Returns system health status for monitoring and uptime checks.
 * Used by Vercel, external monitors, and the Operations Dashboard.
 */

import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Read version at module load time
const APP_VERSION = process.env.npm_package_version || "0.1.0";

export async function GET() {
  const startTime = Date.now();

  let dbStatus: "healthy" | "degraded" | "unreachable" = "unreachable";
  let dbLatencyMs: number | null = null;

  if (false) {
    dbStatus = "healthy";
    dbLatencyMs = 0;
  } else {
    try {
      const { createKairoServerClient } = await import("@/lib/supabase/server");
      const client = await createKairoServerClient();
      const dbStart = Date.now();
      const { error } = await client.from("roles").select("name").limit(1);
      dbLatencyMs = Date.now() - dbStart;
      dbStatus = error ? "degraded" : "healthy";
    } catch {
      dbStatus = "unreachable";
    }
  }

  const health = {
    status: dbStatus === "healthy" ? "operational" : "degraded",
    version: APP_VERSION,
    environment: process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? Math.floor(process.uptime()) : null,
    checks: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        configured: isSupabaseConfigured,
        mode: "live",
      },
      runtime: {
        status: "healthy" as const,
        responseMs: Date.now() - startTime,
      },
    },
  };

  const statusCode = dbStatus === "healthy" ? 200 : 503;

  return NextResponse.json(health, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
