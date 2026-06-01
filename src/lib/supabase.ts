import { supabaseBrowserClient } from "./supabase/client";

// Export the singleton browser-side client for client components
export const supabase = supabaseBrowserClient;
