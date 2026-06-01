"use server";

import { DocumentRepository } from "@/repositories/DocumentRepository";
import { CRMRepository } from "@/repositories/CRMRepository";
import { requireOperatorAuth } from "@/actions/auth";
import { documentSchema, proposalSchema, contractSchema } from "@/schemas/document.schema";
import { ActionResult } from "@/actions/crm";
import { createKairoServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { AuditService } from "@/services/AuditService";

export async function createDocumentAction(input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const validated = documentSchema.parse(input);

    const doc = await DocumentRepository.createDocument({
      client_id: validated.clientId || undefined,
      file_name: validated.fileName,
      file_path: validated.filePath,
      file_hash: validated.fileHash || undefined,
      doc_type: validated.docType as any,
      status: validated.status || "DRAFT"
    });

    await AuditService.log({
      userId: actor.id,
      action: "CREATE_DOCUMENT",
      tableName: "documents",
      recordId: doc.id || "new"
    });
    logger.info("DOCUMENT", "Document created", { docId: doc.id });

    return { success: true, data: doc };
  } catch (error: any) {
    logger.error("DOCUMENT", "Failed to catalog document", { input }, error);
    return { success: false, error: error.message || "Failed to catalog document." };
  }
}

export async function updateDocumentStatusAction(id: string, status: string): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const doc = await DocumentRepository.updateDocumentStatus(id, status);
    
    await AuditService.logMutation(actor.id, "UPDATE_DOCUMENT_STATUS", "documents", id, undefined, { status });
    logger.info("DOCUMENT", "Document status updated", { docId: id, status });

    return { success: true, data: doc };
  } catch (error: any) {
    logger.error("DOCUMENT", "Failed to update document status", { docId: id }, error);
    return { success: false, error: error.message || "Failed to update document status." };
  }
}

export async function createAgreementAction(input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const validated = contractSchema.parse(input);
    const agreement = await DocumentRepository.createAgreement({
      client_id: validated.clientId,
      title: `${validated.type} Agreement`,
      status: "SENT",
      expires_at: validated.confidentialityPeriod ? new Date(Date.now() + 365*24*60*60*1000).toISOString() : undefined
    });

    await AuditService.log({
      userId: actor.id,
      action: "CREATE_AGREEMENT",
      tableName: "agreements",
      recordId: agreement.id || "new"
    });
    logger.info("DOCUMENT", "Agreement created", { agreementId: agreement.id });

    return { success: true, data: agreement };
  } catch (error: any) {
    logger.error("DOCUMENT", "Failed to create agreement", { input }, error);
    return { success: false, error: error.message || "Failed to create agreement." };
  }
}

export async function createProposalAction(input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const validated = proposalSchema.parse(input);
    const proposal = await DocumentRepository.createProposal({
      client_id: validated.clientId,
      title: `${validated.projectName} Proposal`,
      budget_estimate: validated.price,
      scope_details: validated.summary,
      status: "DRAFT"
    });

    await AuditService.log({
      userId: actor.id,
      action: "CREATE_PROPOSAL",
      tableName: "proposals",
      recordId: proposal.id || "new"
    });
    logger.info("DOCUMENT", "Proposal created", { proposalId: proposal.id });

    return { success: true, data: proposal };
  } catch (error: any) {
    logger.error("DOCUMENT", "Failed to create proposal", { input }, error);
    return { success: false, error: error.message || "Failed to create proposal." };
  }
}

// Complete relational document generation Server Action
export async function generateDocumentAction(input: {
  clientId: string;
  docType: "proposal" | "contract" | "sow" | "nda" | "onboarding" | "invoice";
  title: string;
  filePath: string;
  fileHash: string;
  content: string;
  metadata?: Record<string, any>;
}): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();

    const client = await createKairoServerClient();

    // 1. Insert standard document entry
    const { data: docData, error: dbError } = await client
      .from("documents")
      .insert({
        client_id: input.clientId,
        file_name: `${input.title}.pdf`,
        file_path: input.filePath,
        file_hash: input.fileHash,
        doc_type: input.docType === "invoice" ? "proposal" : input.docType,
        status: "SENT"
      })
      .select("*, clients(company_name)")
      .single();

    if (dbError) throw new Error(`Database entry failure: ${dbError.message}`);

    // 2. Insert Document Version
    await client.from("document_versions").insert({
      document_id: docData.id,
      version_number: 1,
      file_path: input.filePath,
      file_hash: input.fileHash,
      created_by: actor.id
    });

    // 3. Insert relational sub-tables
    if (input.docType === "proposal") {
      await client.from("proposals").insert({
        client_id: input.clientId,
        title: input.title,
        budget_estimate: input.metadata?.price || 0,
        scope_details: input.metadata?.summary || input.title,
        status: "SENT"
      });
    } else if (input.docType === "contract" || input.docType === "nda" || input.docType === "sow") {
      // Setup master agreement parent
      const { data: agrData } = await client.from("agreements").insert({
        client_id: input.clientId,
        title: input.title,
        status: "SENT"
      }).select().single();

      if (agrData) {
        if (input.docType === "contract") {
          await client.from("contracts").insert({
            agreement_id: agrData.id,
            client_id: input.clientId,
            contract_terms: input.metadata?.summary || "Standard Contract",
            governing_law: "Delaware"
          });
        } else if (input.docType === "nda") {
          await client.from("ndas").insert({
            agreement_id: agrData.id,
            client_id: input.clientId,
            confidentiality_period: "5 years",
            permitted_use: "Evaluation of business engagement"
          });
        } else if (input.docType === "sow") {
          await client.from("sow_documents").insert({
            agreement_id: agrData.id,
            client_id: input.clientId,
            milestones_json: JSON.stringify(input.metadata?.deliverables || []),
            hourly_rate: 150.00
          });
        }
      }
    }

    // 4. Log CRM activity
    await CRMRepository.logActivity(
      input.clientId,
      "DOCUMENT_GENERATED",
      { title: input.title, docType: input.docType, filePath: input.filePath },
      actor.id
    );

    await AuditService.log({
      userId: actor.id,
      action: "GENERATE_DOCUMENT",
      tableName: "documents",
      recordId: docData.id || "new"
    });
    logger.info("DOCUMENT", "Document generated", { docId: docData.id });

    return {
      success: true,
      data: {
        id: docData.id,
        clientId: input.clientId,
        clientName: (docData.clients as any)?.company_name || "General Workspace",
        fileName: docData.file_name,
        filePath: docData.file_path,
        fileHash: docData.file_hash,
        docType: docData.doc_type,
        status: docData.status,
        createdAt: docData.created_at,
        updatedAt: docData.updated_at,
        version: 1
      }
    };
  } catch (error: any) {
    logger.error("DOCUMENT", "Failed to generate document", { input }, error);
    return { success: false, error: error.message || "Failed to generate document." };
  }
}
