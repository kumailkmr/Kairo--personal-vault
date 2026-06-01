"use server";

import { ClientService } from "@/services/ClientService";
import { CRMRepository } from "@/repositories/CRMRepository";
import { requireOperatorAuth } from "@/actions/auth";
import { clientSchema } from "@/schemas/client";
import { logger } from "@/lib/logger";
import { AuditService } from "@/services/AuditService";

export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; validationErrors?: Record<string, string[]> };

export async function createClientAction(input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    
    // Server-side Zod validation
    const validated = clientSchema.parse(input);

    const client = await ClientService.createClient({
      contact_name: validated.name,
      company_name: validated.company,
      email: validated.email,
      phone: validated.phone,
      retainer_status: validated.status === "active" ? "ACTIVE" : validated.status === "onboarding" ? "REVIEW" : "TERMINATED",
      monthly_retainer: validated.revenue,
      owner_id: actor.id
    }, actor.id);

    await AuditService.log({
      userId: actor.id,
      action: "CREATE_CLIENT",
      tableName: "clients",
      recordId: client.id || "new",
      details: { company: validated.company, email: validated.email },
      severity: "INFO",
    });

    logger.info("CRUD", "Client created successfully", { clientId: client.id, actor: actor.email });
    return { success: true, data: client };
  } catch (error: any) {
    logger.error("CRUD", "Failed to create client", { input }, error);
    return { success: false, error: error.message || "Failed to create client relationship." };
  }
}

export async function updateClientAction(id: string, input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    
    const validated = clientSchema.partial().parse(input);
    const updatePayload: any = {};
    if (validated.name) updatePayload.contact_name = validated.name;
    if (validated.company) updatePayload.company_name = validated.company;
    if (validated.email) updatePayload.email = validated.email;
    if (validated.phone) updatePayload.phone = validated.phone;
    if (validated.status) {
      updatePayload.retainer_status = validated.status === "active" ? "ACTIVE" : validated.status === "onboarding" ? "REVIEW" : "TERMINATED";
    }
    if (validated.revenue !== undefined) updatePayload.monthly_retainer = validated.revenue;

    const client = await ClientService.updateClient(id, updatePayload, actor.id);

    await AuditService.logMutation(actor.id, "UPDATE_CLIENT", "clients", id, undefined, updatePayload);
    logger.info("CRUD", "Client updated", { clientId: id, actor: actor.email });
    return { success: true, data: client };
  } catch (error: any) {
    logger.error("CRUD", "Failed to update client", { clientId: id }, error);
    return { success: false, error: error.message || "Failed to update client profile." };
  }
}

export async function deleteClientAction(id: string): Promise<ActionResult<boolean>> {
  try {
    const actor = await requireOperatorAuth();
    await ClientService.deleteClient(id, actor.id);

    await AuditService.log({
      userId: actor.id, action: "DELETE_CLIENT", tableName: "clients",
      recordId: id, severity: "WARNING",
    });
    logger.info("CRUD", "Client deleted", { clientId: id, actor: actor.email });
    return { success: true, data: true };
  } catch (error: any) {
    logger.error("CRUD", "Failed to delete client", { clientId: id }, error);
    return { success: false, error: error.message || "Failed to delete client account." };
  }
}

export async function archiveClientAction(id: string): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const client = await ClientService.archiveClient(id, actor.id);

    await AuditService.log({
      userId: actor.id, action: "ARCHIVE_CLIENT", tableName: "clients",
      recordId: id, severity: "INFO",
    });
    logger.info("CRUD", "Client archived", { clientId: id, actor: actor.email });
    return { success: true, data: client };
  } catch (error: any) {
    logger.error("CRUD", "Failed to archive client", { clientId: id }, error);
    return { success: false, error: error.message || "Failed to archive client account." };
  }
}

// Client Contacts CRUD Server Actions
export async function createContactAction(data: { client_id: string; full_name: string; email: string; phone?: string; role?: string }): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const contact = await CRMRepository.createContact(data);
    await AuditService.log({ userId: actor.id, action: "CREATE_CONTACT", tableName: "client_contacts", recordId: contact?.id || "new" });
    return { success: true, data: contact };
  } catch (error: any) {
    logger.error("CRUD", "Failed to create contact", { data }, error);
    return { success: false, error: error.message || "Failed to create contact." };
  }
}

export async function updateContactAction(id: string, data: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const contact = await CRMRepository.updateContact(id, data);
    await AuditService.log({ userId: actor.id, action: "UPDATE_CONTACT", tableName: "client_contacts", recordId: id });
    return { success: true, data: contact };
  } catch (error: any) {
    logger.error("CRUD", "Failed to update contact", { contactId: id }, error);
    return { success: false, error: error.message || "Failed to update contact." };
  }
}

export async function deleteContactAction(id: string): Promise<ActionResult<boolean>> {
  try {
    const actor = await requireOperatorAuth();
    await CRMRepository.deleteContact(id);
    await AuditService.log({ userId: actor.id, action: "DELETE_CONTACT", tableName: "client_contacts", recordId: id, severity: "WARNING" });
    return { success: true, data: true };
  } catch (error: any) {
    logger.error("CRUD", "Failed to delete contact", { contactId: id }, error);
    return { success: false, error: error.message || "Failed to delete contact." };
  }
}
