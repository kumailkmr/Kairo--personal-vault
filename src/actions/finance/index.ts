"use server";

import { InvoiceService } from "@/services/InvoiceService";
import { InvoiceRepository } from "@/repositories/InvoiceRepository";
import { requireOperatorAuth } from "@/actions/auth";
import { invoiceSchema } from "@/schemas/invoice.schema";
import { ActionResult } from "@/actions/crm";
import { logger } from "@/lib/logger";
import { AuditService } from "@/services/AuditService";

export async function createInvoiceAction(input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    
    // Server-side Zod validation
    const validated = invoiceSchema.parse(input);

    const billingItems = validated.items.map(itm => ({
      description: itm.description,
      quantity: itm.quantity,
      unit_price: itm.unitPrice
    }));

    const invoice = await InvoiceService.createInvoice({
      client_id: validated.clientId,
      project_id: validated.projectId || undefined,
      invoice_number: validated.invoiceNumber,
      status: validated.status as any,
      tax: validated.tax,
      issue_date: validated.issueDate,
      due_date: validated.dueDate
    }, billingItems, actor.id);

    await AuditService.log({
      userId: actor.id,
      action: "CREATE_INVOICE",
      tableName: "invoices",
      recordId: invoice.id || "new"
    });
    logger.info("FINANCE", "Invoice created", { invoiceId: invoice.id });

    return { success: true, data: invoice };
  } catch (error: any) {
    logger.error("FINANCE", "Failed to issue invoice", { input }, error);
    return { success: false, error: error.message || "Failed to issue invoice." };
  }
}

export async function updateInvoiceStatusAction(id: string, status: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const invoice = await InvoiceRepository.updateInvoiceStatus(id, status);
    
    await AuditService.logMutation(actor.id, "UPDATE_INVOICE_STATUS", "invoices", id, undefined, { status });
    logger.info("FINANCE", "Invoice status updated", { invoiceId: id, status });

    return { success: true, data: invoice };
  } catch (error: any) {
    logger.error("FINANCE", "Failed to update invoice status", { invoiceId: id }, error);
    return { success: false, error: error.message || "Failed to update invoice status." };
  }
}

export async function markInvoicePaidAction(id: string, paymentMethod = "ACH Transfer", transactionId?: string): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const result = await InvoiceService.markPaid(id, paymentMethod, transactionId, actor.id);
    
    await AuditService.logMutation(actor.id, "MARK_INVOICE_PAID", "invoices", id, undefined, { paymentMethod, transactionId });
    logger.info("FINANCE", "Invoice marked paid", { invoiceId: id });

    return { success: true, data: result };
  } catch (error: any) {
    logger.error("FINANCE", "Failed to mark invoice as paid", { invoiceId: id }, error);
    return { success: false, error: error.message || "Failed to mark invoice as paid." };
  }
}

export async function createPaymentAction(invoiceId: string, amount: number, paymentMethod: string, transactionId?: string): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const result = await InvoiceService.markPaid(invoiceId, paymentMethod, transactionId, actor.id);
    
    await AuditService.log({
      userId: actor.id,
      action: "CREATE_PAYMENT",
      tableName: "payments",
      recordId: invoiceId
    });
    logger.info("FINANCE", "Payment created", { invoiceId });

    return { success: true, data: result };
  } catch (error: any) {
    logger.error("FINANCE", "Failed to post payment details", { invoiceId }, error);
    return { success: false, error: error.message || "Failed to post payment details." };
  }
}
