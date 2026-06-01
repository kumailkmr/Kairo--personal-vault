import { InvoiceRepository, DBInvoiceData, DBInvoiceItemData } from "@/repositories/InvoiceRepository";
import { CRMRepository } from "@/repositories/CRMRepository";
import { NotificationRepository } from "@/repositories/NotificationRepository";
import { createKairoServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export const InvoiceService = {
  async getInvoices() {
    return await InvoiceRepository.getInvoices();
  },

  async createInvoice(data: Omit<DBInvoiceData, "amount"> & { id?: string }, items: DBInvoiceItemData[], creatorId: string) {
    // 1. Calculate the total invoice amount dynamically from billing items
    const subtotal = items.reduce((acc, curr) => acc + (curr.quantity * curr.unit_price), 0);
    const taxAmount = subtotal * (data.tax / 100);
    const totalAmount = parseFloat((subtotal + taxAmount).toFixed(2));

    const invoicePayload: DBInvoiceData = {
      client_id: data.client_id,
      project_id: data.project_id,
      invoice_number: data.invoice_number,
      status: data.status,
      amount: totalAmount,
      tax: data.tax,
      issue_date: data.issue_date,
      due_date: data.due_date
    };

    // 2. Persist invoice + items inside repository
    const invoice = await InvoiceRepository.createInvoice(invoicePayload, items);

    // 3. Log CRM activity
    await CRMRepository.logActivity(
      data.client_id,
      "INVOICE_GENERATED",
      { invoice_number: data.invoice_number, total_amount: totalAmount },
      creatorId
    );

    // 4. Send notification
    await NotificationRepository.createNotification({
      user_id: creatorId,
      title: "Invoice Ledger Logged",
      message: `Billing Invoice #${data.invoice_number} created for $${totalAmount.toLocaleString()}.`,
      priority: "MEDIUM",
      is_read: false
    });

    return invoice;
  },

  async markPaid(id: string, paymentMethod = "ACH Transfer", transactionId?: string, operatorId = "c76fb973-ec63-41c4-b816-56be794c483d") {
    // 1. Mark as PAID in repository (which registers payment relation too)
    const result = await InvoiceRepository.markPaid(id, paymentMethod, transactionId);

    // 2. Fetch invoice info for logs
    const client = await createKairoServerClient();
    const { data } = await client
      .from("invoices")
      .select("*, clients(company_name)")
      .eq("id", id)
      .single();
    const invoiceInfo = data;

    const amount = invoiceInfo ? parseFloat(invoiceInfo.amount) : 0;
    const clientId = invoiceInfo ? invoiceInfo.client_id : "global";
    const invoiceNum = invoiceInfo ? invoiceInfo.invoice_number : "Unknown";

    // 3. Log transaction audit activity
    await CRMRepository.logActivity(
      clientId,
      "FINANCIAL_PAYMENT_MET",
      { invoice_id: id, invoice_number: invoiceNum, amount_paid: amount },
      operatorId
    );

    // 4. Send financial notification
    await NotificationRepository.createNotification({
      user_id: operatorId,
      title: "Revenue Received ✔",
      message: `Payment of $${amount.toLocaleString()} received for Invoice #${invoiceNum}.`,
      priority: "HIGH",
      is_read: false
    });

    // 5. Automatically recalculate and sync analytics caches
    await this.calculateAndSyncRevenueAnalytics();

    return result;
  },

  async getRevenueMetrics() {
    return await InvoiceRepository.getRevenueMetrics();
  },

  async calculateAndSyncRevenueAnalytics() {
    const client = await createKairoServerClient();
    
    // 1. Get all PAID invoice amounts
    const { data: paidInvoices } = await client
      .from("invoices")
      .select("amount")
      .eq("status", "PAID");

    const totalPaid = paidInvoices ? paidInvoices.reduce((acc, curr) => acc + parseFloat(curr.amount as any), 0) : 0;

    // 2. Prepare metrics values
    const arr = totalPaid * 12;
    const mrr = totalPaid;
    const receipts = totalPaid;

    const metricsPayload = [
      { metric_name: "Annual Recurring Revenue (ARR)", metric_value: arr, change_percent: 9.2, period_label: "vs last quarter", trend_direction: "UP" },
      { metric_name: "Monthly Recurring Revenue (MRR)", metric_value: mrr, change_percent: 14.3, period_label: "vs last month", trend_direction: "UP" },
      { metric_name: "Lifetime Paid Receipts", metric_value: receipts, change_percent: 18.0, period_label: "vs baseline", trend_direction: "UP" }
    ];

    // 3. Upsert them into the database cache analytics table
    for (const metric of metricsPayload) {
      try {
        await client
          .from("revenue_analytics_cache")
          .upsert(metric, { onConflict: "metric_name" });
      } catch (err) {
        console.error("Failed to upsert revenue analytics cache metrics:", err);
      }
    }

    logger.info("FINANCE", `Refreshed revenue metrics caches. ARR: $${arr}, MRR: $${mrr}`);
  }
};
