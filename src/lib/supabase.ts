import { supabaseBrowserClient } from "./supabase/client";
import { isMockMode as envIsMockMode } from "./supabase/env";
import { 
  MOCK_CLIENTS, 
  MOCK_PROJECTS, 
  MOCK_MEETINGS, 
  MOCK_NOTIFICATIONS,
  MOCK_GOALS,
  MOCK_REVENUE_METRICS
} from "@/mock";

// Export the singleton browser-side client for client components
export const supabase = supabaseBrowserClient;

// Determine if the client is operating in fallback/mock sandbox mode
export const isMockMode = envIsMockMode;

if (isMockMode) {
  console.warn(
    "⚠️ Kairo OS: Supabase environment variables are missing. Operating in high-fidelity mock fallback mode."
  );
}

// In-Memory state replicates PostgreSQL behavior when running in mock fallback mode
export const localDb = {
  clients: [...MOCK_CLIENTS],
  projects: [...MOCK_PROJECTS],
  meetings: [...MOCK_MEETINGS],
  notifications: [...MOCK_NOTIFICATIONS],
  goals: [...MOCK_GOALS],
  metrics: [...MOCK_REVENUE_METRICS],
  activityLogs: [
    { id: "log-1", client_id: "c-1", user_id: "c76fb973-ec63-41c4-b816-56be794c483d", action: "Client created", details: { company: "Aetherius Capital" }, created_at: new Date().toISOString() }
  ] as Array<{ id: string; client_id: string; user_id?: string; action: string; details: Record<string, any>; created_at: string }>,
  documents: [
    { id: "doc-1", client_id: "c-1", file_name: "retainer_proposal.pdf", file_path: "vault/retainer_proposal.pdf", file_hash: "a4c28", doc_type: "proposal", status: "SIGNED", created_at: new Date().toISOString() }
  ]
};
