import "server-only";
import { supabase } from "@/lib/supabase";
import { createKairoServerClient } from "@/lib/supabase/server";

export interface DBCommunicationLogData {
  client_id: string;
  type: "EMAIL" | "WHATSAPP" | "CALL" | "email" | "whatsapp" | "call";
  direction: "INBOUND" | "OUTBOUND" | "inbound" | "outbound";
  subject: string;
  summary: string;
  metadata?: Record<string, any>;
}

export const CommunicationRepository = {
  async getCommunicationLogs(clientId?: string) {
    const client = await createKairoServerClient();
    const baseQuery = client.from("communication_logs").select("*, clients(company_name)");
    const { data, error } = clientId ? await baseQuery.eq("client_id", clientId) : await baseQuery;

    if (error) throw new Error(error.message);
    return data;
  },

  async createCommunicationLog(data: DBCommunicationLogData) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("communication_logs")
      .insert({
        client_id: data.client_id,
        type: data.type.toUpperCase(),
        direction: data.direction.toUpperCase(),
        subject: data.subject,
        summary: data.summary,
        metadata: data.metadata || {}
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  // Onboarding Requests
  async getOnboardingRequests() {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("onboarding_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async createOnboardingRequest(data: { company_name: string; contact_name: string; email: string; phone?: string; retainer_value: number; status?: string }) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("onboarding_requests")
      .insert({
        company_name: data.company_name,
        contact_name: data.contact_name,
        email: data.email,
        phone: data.phone,
        retainer_value: data.retainer_value,
        status: data.status || "PENDING"
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async updateOnboardingRequestStatus(id: string, status: string) {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("onboarding_requests")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};
