import { z } from "zod";

// ═══════════════════════════════════════════════════════════════
// KAIRO OS — ENVIRONMENT CONFIGURATION & VALIDATION
// ═══════════════════════════════════════════════════════════════

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().or(z.string().min(0)),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(0),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(0).optional(),
});

// Parse the active environment variables safely
const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
});

if (!parsed.success) {
  console.error("❌ Invalid environment variables configuration:", parsed.error.format());
}

const envValues = parsed.success
  ? parsed.data
  : {
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
      SUPABASE_SERVICE_ROLE_KEY: "",
    };

// Determine if we are operating in mock mode
export const isSupabaseConfigured =
  !!envValues.NEXT_PUBLIC_SUPABASE_URL &&
  !envValues.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
  !!envValues.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !envValues.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("placeholder");

export const supabaseEnv = {
  url: envValues.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: envValues.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: envValues.SUPABASE_SERVICE_ROLE_KEY,
};

// ─── Application Environment ──────────────────────────────────
export const appEnv = {
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  environment: (process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || "development") as
    | "development"
    | "preview"
    | "production",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV !== "production",
};

// ─── Production Startup Validation ────────────────────────────

if (appEnv.isProduction && !envValues.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "🚨 PRODUCTION WARNING: SUPABASE_SERVICE_ROLE_KEY is not configured. " +
    "Admin operations and database seeding will not function."
  );
}
