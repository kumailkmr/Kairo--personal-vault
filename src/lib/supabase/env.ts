import { z } from "zod";

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

export const isMockMode = !isSupabaseConfigured;

export const supabaseEnv = {
  url: isMockMode ? "https://placeholder-project-id.supabase.co" : envValues.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: isMockMode ? "placeholder-anon-key" : envValues.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: isMockMode ? "placeholder-service-role" : envValues.SUPABASE_SERVICE_ROLE_KEY,
};
