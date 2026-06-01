import "server-only";
import { supabase } from "@/lib/supabase";
import { createKairoServerClient } from "@/lib/supabase/server";

export interface DBClientData {
  contact_name: string;
  company_name: string;
  email: string;
  phone?: string;
  retainer_status: "ACTIVE" | "REVIEW" | "PAUSED" | "TERMINATED" | "active" | "review" | "paused" | "terminated";
  monthly_retainer: number;
  owner_id: string;
}

export const CRMRepository = {
  async getClients() {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  },

  async getClientById(id: string) {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("clients")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },

  async createClient(data: DBClientData & { id?: string }) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("clients")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async updateClient(id: string, data: Partial<DBClientData>) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("clients")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async deleteClient(id: string) {
    const client = await createKairoServerClient();
    const { error } = await client
      .from("clients")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
    return true;
  },

  async getContacts(clientId: string) {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("client_contacts")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async createContact(data: { client_id: string; full_name: string; email: string; phone?: string; role?: string }) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("client_contacts")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async updateContact(id: string, data: Partial<{ full_name: string; email: string; phone?: string; role?: string }>) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("client_contacts")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async deleteContact(id: string) {
    const client = await createKairoServerClient();
    const { error } = await client
      .from("client_contacts")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
    return true;
  },

  // CRM-scoped Activity Logs
  async logActivity(clientId: string, action: string, details: Record<string, any>, userId: string) {
    const logEntry = {
      id: `act-${Math.random().toString(36).substr(2, 9)}`,
      client_id: clientId,
      user_id: userId,
      action,
      details,
      created_at: new Date().toISOString()
    };

    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("client_activity_logs")
      .insert(logEntry)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getActivityLogs(clientId: string) {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("client_activity_logs")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
};
