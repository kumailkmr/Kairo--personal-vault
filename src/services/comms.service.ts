import { supabase } from "@/lib/supabase";
import { onboardingRequestSchema, communicationLogSchema, OnboardingRequestInput, CommunicationLogInput } from "@/schemas/comms.schema";

// Activity Logging helper specifically for Communications
async function logCommsActivity(clientId: string | null, action: string, details: Record<string, unknown>) {
  const logEntry = {
    id: `act-${Math.random().toString(36).substr(2, 9)}`,
    client_id: clientId || "global",
    user_id: "c76fb973-ec63-41c4-b816-56be794c483d",
    action,
    details,
    created_at: new Date().toISOString()
  };

  try {
      if (clientId) {
        await supabase.from("client_activity_logs").insert({
          client_id: clientId,
          user_id: logEntry.user_id,
          action,
          details
        });
      }
    } catch (err) {
      console.error("Failed to persist comms audit activity log:", err);
    }
}

// Global System Notifications helper
async function triggerCommsNotification(title: string, message: string, priority = "MEDIUM") {
  try {
      await supabase.from("notifications").insert({
        user_id: "c76fb973-ec63-41c4-b816-56be794c483d",
        title,
        message,
        priority: priority.toUpperCase()
      });
    } catch (err) {
      console.error("Failed to generate communications notification:", err);
    }
}

// =========================================================================
// 3. EXECUTIVE COMMUNICATION & ONBOARDING DATA ENGINE
// =========================================================================
export const commsService = {

  // A. ONBOARDING LEADS/REQUESTS ENGINE
  async getOnboardingRequests(): Promise<any[]> {
    const { data, error } = await supabase
      .from("onboarding_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async createOnboardingRequest(input: OnboardingRequestInput): Promise<any> {
    const validated = onboardingRequestSchema.parse(input);

    const { data, error } = await supabase
      .from("onboarding_requests")
      .insert({
        name: validated.name,
        company: validated.company,
        email: validated.email,
        phone: validated.phone,
        project_type: validated.projectType,
        budget_range: validated.budgetRange,
        goals: validated.goals,
        notes: validated.notes,
        status: "PENDING"
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    await triggerCommsNotification(
      "Onboarding Request Received",
      `New strategic lead ${validated.name} representing ${validated.company} submitted onboarding intake.`,
      "HIGH"
    );

    return data;
  },

  async updateOnboardingStatus(id: string, status: string): Promise<any> {
    const cleanStatus = status.toUpperCase();

    const { data, error } = await supabase
      .from("onboarding_requests")
      .update({ status: cleanStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    if (cleanStatus === "ACCEPTED") {
      // 1. Insert into CRM clients registry automatically
      const currentUserId = "c76fb973-ec63-41c4-b816-56be794c483d";
      const { data: newClient } = await supabase
        .from("clients")
        .insert({
          owner_id: currentUserId,
          company_name: data.company,
          contact_name: data.name,
          email: data.email,
          phone: data.phone,
          retainer_status: "REVIEW",
          monthly_retainer: 15000
        })
        .select()
        .single();

      if (newClient) {
        await logCommsActivity(newClient.id, "CLIENT_INGRESS_ONBOARD", { company: data.company });
      }
      await triggerCommsNotification("Onboarding Request Accepted", `Lead ${data.name} has been promoted to client registry.`, "HIGH");
    }

    return data;
  },

  // B. COMMUNICATIONS EVENTS RETRIEVAL
  async getCommunicationLogs(): Promise<any[]> {
    const { data, error } = await supabase
      .from("communication_logs")
      .select("*, clients(company_name)")
      .order("sent_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data.map(item => ({
      id: item.id,
      clientId: item.client_id,
      clientName: (item.clients as unknown as { company_name: string })?.company_name || "Strategic Guest",
      channel: item.channel,
      direction: item.direction,
      subject: item.subject,
      body: item.body,
      status: "delivered", // Safe default
      sent_at: item.sent_at
    }));
  },

  // C. OUTBOUND COMMUNICATION TRANSMISSION & RELATION LOGGING (WHATSAPP/EMAIL)
  async sendOutboundMessage(input: {
    clientId: string | null;
    channel: "whatsapp" | "email" | "slack" | "automated";
    recipient: string;
    subject?: string;
    body: string;
  }): Promise<any> {
    const validated = communicationLogSchema.parse({
      clientId: input.clientId,
      channel: input.channel,
      direction: "outbound",
      subject: input.subject || null,
      body: input.body,
      status: "sent"
    });

    const currentUserId = "c76fb973-ec63-41c4-b816-56be794c483d";

    // 1. Write core timeline transaction to communication_logs
    const { data: commLog, error: commError } = await supabase
      .from("communication_logs")
      .insert({
        client_id: validated.clientId,
        user_id: currentUserId,
        channel: validated.channel,
        direction: "outbound",
        subject: validated.subject,
        body: validated.body
      })
      .select()
      .single();

    if (commError) throw new Error(commError.message);

    // 2. Cascade relational sub-logs specifically for Email or WhatsApp channels
    if (validated.channel === "email") {
      await supabase.from("email_logs").insert({
        communication_log_id: commLog.id,
        from_email: "operations@kairo-os.co",
        to_email: input.recipient,
        message_id: `email-msg-${Math.random().toString(36).substr(2, 9)}`,
        status: "delivered"
      });
    } else if (validated.channel === "whatsapp") {
      await supabase.from("whatsapp_logs").insert({
        communication_log_id: commLog.id,
        phone_number: input.recipient,
        message_sid: `wa-sid-${Math.random().toString(36).substr(2, 9)}`,
        status: "delivered"
      });
    }

    await logCommsActivity(validated.clientId ?? null, "OUTBOUND_MESSAGE_DISPATCHED", { 
      channel: validated.channel,
      recipient: input.recipient
    });

    return commLog;
  },

  // D. COMMUNICATION TEMPLATE PARSER ENGINE
  compileMessageTemplate(
    templateContent: string,
    placeholders: {
      clientName: string;
      meetingTime?: string;
      invoiceTotal?: string;
      onboardUrl?: string;
    }
  ): string {
    let text = templateContent;
    
    const mappings = {
      "{{client_name}}": placeholders.clientName,
      "{{meeting_time}}": placeholders.meetingTime || "Tomorrow at 2:00 PM",
      "{{invoice_total}}": placeholders.invoiceTotal || "$5,000.00",
      "{{onboard_url}}": placeholders.onboardUrl || "https://kairo-os.co/onboard/onb-active"
    };

    for (const [holder, val] of Object.entries(mappings)) {
      text = text.replaceAll(holder, val);
    }

    return text;
  }
};
