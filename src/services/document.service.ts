import { supabase } from "@/lib/supabase";
// MOCK_TEMPLATES removed
type DocStatus = any;
type DocType = any;
type MockTemplate = any;
type MockDocument = any;
import { proposalSchema, contractSchema, documentSchema } from "@/schemas";
import { z } from "zod";
import { generateDocumentAction } from "@/actions/documents";

// ==========================================
// 1. REPOSITORY AUDITING LOGS UTILITY
// ==========================================
async function logDocumentActivity(clientId: string | null, action: string, details: Record<string, unknown>, userId = "c76fb973-ec63-41c4-b816-56be794c483d") {
  const logEntry = {
    id: `act-${Math.random().toString(36).substr(2, 9)}`,
    client_id: clientId || "global",
    user_id: userId,
    action,
    details,
    created_at: new Date().toISOString()
  };

  try {
      if (clientId) {
        await supabase.from("client_activity_logs").insert({
          client_id: clientId,
          user_id: userId,
          action,
          details
        });
      }
    } catch (err) {
      console.error("Failed to persist operational audit log to Supabase:", err);
    }
}

// Interface for rich generated documents
export interface KairoDocument {
  id: string;
  clientId: string | null;
  clientName: string;
  fileName: string;
  filePath: string;
  fileHash: string | null;
  docType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
  content?: string; // HTML or compiled text content
}

// ==========================================
// 2. EXECUTIVE DOCUMENTS INFRASTRUCTURE SERVICE
// ==========================================
export const documentService = {

  // A. TEMPLATE ENGINE
  async getTemplates(): Promise<MockTemplate[]> {
    try {
      const { data, error } = await supabase
        .from("document_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        // Seed database templates dynamically if empty
        /* seed templates removed */
        return [];
      }

      return data.map(item => ({
        id: item.id,
        name: item.name,
        category: (item.category.charAt(0).toUpperCase() + item.category.slice(1)) as DocType,
        description: `Custom database template. Category: ${item.category}`,
        usageCount: 12 // Default standard usage tracking
      }));
    } catch (error: any) {
      console.error("Error fetching templates, falling back to mock:", error.message);
      return [];
    }
  },

  // B. COMPILER ENGINE (PLACEHOLDERS PARSING)
  compileTemplate(
    templateContent: string,
    variables: {
      clientName: string;
      companyName: string;
      projectName?: string;
      projectScope?: string;
      price?: number;
      governingLaw?: string;
      date?: string;
      invoiceNumber?: string;
      lineItemsHtml?: string;
    }
  ): string {
    let compiled = templateContent;

    const replacements: Record<string, string> = {
      "{{client_name}}": variables.clientName,
      "{{company_name}}": variables.companyName,
      "{{project_name}}": variables.projectName || "Operational Retainer",
      "{{project_scope}}": variables.projectScope || "Provision of digital management infrastructure.",
      "{{price}}": variables.price ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(variables.price) : "$0.00",
      "{{invoice_amount}}": variables.price ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(variables.price) : "$0.00",
      "{{governing_law}}": variables.governingLaw || "Delaware",
      "{{date}}": variables.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      "{{invoice_number}}": variables.invoiceNumber || `INV-${Date.now().toString().slice(-4)}`,
      "{{line_items}}": variables.lineItemsHtml || "Standard Service Provision - 1x"
    };

    // Inject Executive Signature Stamp automatically for professional branding
    const signatureSvg = `
      <div style="margin-top: 20px; font-family: 'Dancing Script', 'Brush Script MT', cursive; color: #1e40af;">
        <span style="font-size: 28px; font-weight: normal; letter-spacing: -1px; transform: rotate(-3deg); display: inline-block;">
          Kumail Kmr
        </span>
        <div style="font-family: sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 2px; margin-top: 4px;">
          Authorized Executive Signatory — Kairo OS
        </div>
      </div>
    `;

    compiled = compiled.replace("{{signature}}", signatureSvg);

    for (const [placeholder, val] of Object.entries(replacements)) {
      compiled = compiled.replaceAll(placeholder, val);
    }

    return compiled;
  },

  // C. FETCH DOCUMENTS LIBRARY
  async getDocuments(): Promise<KairoDocument[]> {
    const { data, error } = await supabase
      .from("documents")
      .select("*, clients(company_name)")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data.map(item => ({
      id: item.id,
      clientId: item.client_id,
      clientName: (item.clients as unknown as { company_name: string })?.company_name || "Stoic Investments",
      fileName: item.file_name,
      filePath: item.file_path,
      fileHash: item.file_hash,
      docType: item.doc_type,
      status: item.status,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  },

  // D. DYNAMIC PROPOSAL/SOW/CONTRACT GENERATION PIPELINE
  async generateDocument(input: {
    clientId: string;
    docType: "proposal" | "contract" | "sow" | "nda" | "onboarding" | "invoice";
    title: string;
    content: string; // The compiled HTML content
    metadata?: Record<string, any>;
  }): Promise<KairoDocument> {
    const fileExt = "html";
    const cleanTitle = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    const filePath = `vault/${input.clientId}/${cleanTitle}_${Date.now()}.${fileExt}`;
    const fileHash = Math.random().toString(36).substr(2, 9); // Simple tracking hash

    // 1. Upload HTML document representation to Supabase Storage
    const fileBlob = new Blob([input.content], { type: "text/html" });
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, fileBlob, {
        contentType: "text/html",
        cacheControl: "3600",
        upsert: true
      });

    if (uploadError) throw new Error(`Storage upload failure: ${uploadError.message}`);

    // 2. Delegate relational insertions to secure Server Action
    const res = await generateDocumentAction({
      clientId: input.clientId,
      docType: input.docType,
      title: input.title,
      filePath,
      fileHash,
      content: input.content,
      metadata: input.metadata
    });

    if (!res.success) {
      throw new Error(res.error);
    }

    return res.data;
  },

  // E. UPLOAD CUSTOM DOCUMENT ATTACHMENT
  async uploadAttachment(clientId: string, file: File, docType: string = "proposal"): Promise<KairoDocument> {
    const fileExt = file.name.split(".").pop();
    const filePath = `vault/${clientId}/${Math.random().toString(36).substr(2, 9)}_${Date.now()}.${fileExt}`;
    const fileHash = `sha256-hash-${Math.random().toString(36).substr(2, 5)}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data: docData, error: dbError } = await supabase
      .from("documents")
      .insert({
        client_id: clientId,
        file_name: file.name,
        file_path: filePath,
        file_hash: fileHash,
        doc_type: docType,
        status: "COMPLETED"
      })
      .select("*, clients(company_name)")
      .single();

    if (dbError) throw new Error(dbError.message);

    await logDocumentActivity(clientId, "ATTACHMENT_UPLOADED", { fileName: file.name, path: filePath });

    return {
      id: docData.id,
      clientId: docData.client_id,
      clientName: (docData.clients as unknown as { company_name: string })?.company_name || "Stoic Investments",
      fileName: docData.file_name,
      filePath: docData.file_path,
      fileHash: docData.file_hash,
      docType: docData.doc_type,
      status: docData.status,
      createdAt: docData.created_at,
      updatedAt: docData.updated_at,
      version: 1
    };
  },

  // F. DOWNLOAD SIGNED URL HANDSHAKE
  async getDownloadUrl(filePath: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(filePath, 3600); // 1-hour secure link validation

    if (error) throw new Error(`Signed URL Handshake failure: ${error.message}`);
    return data.signedUrl;
  },

  // G. VERSION TRACKING & UPDATE REVISION
  async createDocumentRevision(documentId: string, content: string): Promise<number> {
    const fileHash = Math.random().toString(36).substr(2, 9);
    const currentUserId = "c76fb973-ec63-41c4-b816-56be794c483d";

    // 1. Fetch document information to increment version
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("client_id, file_path")
      .eq("id", documentId)
      .single();

    if (fetchError) throw fetchError;

    // 2. Fetch last version number
    const { data: versions, error: versionError } = await supabase
      .from("document_versions")
      .select("version_number")
      .eq("document_id", documentId)
      .order("version_number", { ascending: false })
      .limit(1);

    if (versionError) throw versionError;

    const nextVersion = (versions && versions[0]?.version_number || 1) + 1;
    const cleanPath = document.file_path.replace(/_v\d+\.html$/, "");
    const nextPath = `${cleanPath.split(".")[0]}_v${nextVersion}.html`;

    // 3. Upload new version to Storage
    const fileBlob = new Blob([content], { type: "text/html" });
    await supabase.storage.from("documents").upload(nextPath, fileBlob, {
      contentType: "text/html",
      upsert: true
    });

    // 4. Update the main document reference to point to latest path
    await supabase.from("documents").update({
      file_path: nextPath,
      file_hash: fileHash,
      updated_at: new Date().toISOString()
    }).eq("id", documentId);

    // 5. Insert new version record
    await supabase.from("document_versions").insert({
      document_id: documentId,
      version_number: nextVersion,
      file_path: nextPath,
      file_hash: fileHash,
      created_by: currentUserId
    });

    await logDocumentActivity(document.client_id, "DOCUMENT_REVISED", { 
      documentId, 
      version: nextVersion,
      filePath: nextPath
    });

    return nextVersion;
  }
};
