import { createKairoServerClient } from "@/lib/supabase/server";

export interface ServerUser {
  id: string;
  email: string;
  role: "OPERATOR" | "CLIENT" | "ADMIN";
  name: string;
}

/**
 * Validates Next.js Edge Auth cookies server-side.
 * Reverts to executive sandbox fallback (Kumail KMR) in local mock environment.
 */
export async function requireServerAuth(): Promise<ServerUser> {
  const supabase = await createKairoServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("UNAUTHORIZED: Session expired or invalid.");
  }

  // Fetch role relationally from user_profiles
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      id: user.id,
      email: user.email || "",
      role: "CLIENT",
      name: user.email || "Workspace User"
    };
  }

  return {
    id: user.id,
    email: user.email || "",
    role: (profile.role?.toUpperCase() || "CLIENT") as any,
    name: profile.full_name || user.email || "Workspace User"
  };
}

/**
 * Confirms strict OPERATOR level hierarchy.
 */
export async function requireOperatorAuth(): Promise<ServerUser> {
  const user = await requireServerAuth();
  if (user.role !== "OPERATOR" && user.role !== "ADMIN") {
    throw new Error("FORBIDDEN: Administrative access required.");
  }
  return user;
}
