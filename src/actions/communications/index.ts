"use server";

import { CommunicationRepository } from "@/repositories/CommunicationRepository";
import { requireOperatorAuth } from "@/actions/auth";
import { communicationLogSchema } from "@/schemas/comms.schema";
import { ActionResult } from "@/actions/crm";
import { logger } from "@/lib/logger";
import { AuditService } from "@/services/AuditService";

export async function createCommunicationLogAction(input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const validated = communicationLogSchema.parse(input);

    const log = await CommunicationRepository.createCommunicationLog({
      client_id: validated.clientId || "",
      type: validated.channel as any,
      direction: validated.direction as any,
      subject: validated.subject || "No Subject",
      summary: validated.body,
      metadata: {}
    });

    await AuditService.log({
      userId: actor.id,
      action: "CREATE_COMMUNICATION_LOG",
      tableName: "communication_logs",
      recordId: log?.id || "new"
    });
    logger.info("COMMUNICATION", "Communication record logged", { logId: log?.id });

    return { success: true, data: log };
  } catch (error: any) {
    logger.error("COMMUNICATION", "Failed to log communication record", { input }, error);
    return { success: false, error: error.message || "Failed to log communication record." };
  }
}

export async function createOnboardingRequestAction(input: any): Promise<ActionResult<any>> {
  try {
    // Onboarding requests can be created without operator auth (public intake form)
    const request = await CommunicationRepository.createOnboardingRequest({
      company_name: input.companyName || input.company_name,
      contact_name: input.contactName || input.contact_name,
      email: input.email,
      phone: input.phone,
      retainer_value: input.retainerValue || input.retainer_value || 0,
      status: "PENDING"
    });

    logger.info("COMMUNICATION", "Public onboarding request submitted", { requestId: request?.id, email: input.email });

    return { success: true, data: request };
  } catch (error: any) {
    logger.error("COMMUNICATION", "Failed to submit onboarding request", { input }, error);
    return { success: false, error: error.message || "Failed to submit onboarding request." };
  }
}
