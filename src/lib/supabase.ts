// Future Supabase integration placeholder.
// To connect to database:
// 1. Create a Supabase project at https://supabase.com
// 2. Install @supabase/supabase-js
// 3. Set standard NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables.

import { Client, Project, Meeting } from "@/types";

export interface SupabaseClientStub {
  getClients: () => Promise<Client[]>;
  getProjects: () => Promise<Project[]>;
  getMeetings: () => Promise<Meeting[]>;
  isMock: boolean;
}

export const supabase: SupabaseClientStub = {
  getClients: async () => [],
  getProjects: async () => [],
  getMeetings: async () => [],
  isMock: true,
};
