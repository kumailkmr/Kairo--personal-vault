import "server-only";
import { supabase } from "@/lib/supabase";
import { createKairoServerClient } from "@/lib/supabase/server";

export interface DBDocumentData {
  client_id?: string;
  file_name: string;
  file_path: string;
  file_hash?: string;
  doc_type: "proposal" | "contract" | "sow" | "nda" | "template";
  status: string;
}

export const DocumentRepository = {
  async getDocuments() {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("documents")
      .select("*, clients(company_name)")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(item => ({
      id: item.id,
      clientId: item.client_id,
      clientName: (item.clients as any)?.company_name || "General Workspace",
      fileName: item.file_name,
      filePath: item.file_path,
      fileHash: item.file_hash,
      docType: item.doc_type,
      status: item.status,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  },

  async createDocument(data: DBDocumentData & { id?: string }) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("documents")
      .insert({
        client_id: data.client_id,
        file_name: data.file_name,
        file_path: data.file_path,
        file_hash: data.file_hash || "",
        doc_type: data.doc_type,
        status: data.status
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async updateDocumentStatus(id: string, status: string) {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("documents")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Agreements, proposals
  async getAgreements(clientId?: string) {
    const client = await createKairoServerClient();
    const baseQuery = client.from("agreements").select("*, clients(company_name)");
    const { data, error } = clientId ? await baseQuery.eq("client_id", clientId) : await baseQuery;

    if (error) throw new Error(error.message);
    return data;
  },

  async createAgreement(data: { client_id: string; title: string; status: string; expires_at?: string }) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("agreements")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async createProposal(data: { client_id: string; agreement_id?: string; title: string; budget_estimate: number; scope_details: string; status: string }) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("proposals")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  }
};
