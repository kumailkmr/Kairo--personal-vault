import { supabase, isMockMode, localDb } from "@/lib/supabase";
import { onboardingRequestSchema, communicationLogSchema, OnboardingRequestInput, CommunicationLogInput } from "@/schemas/comms.schema";

// Initialize mock data collections inside localDb if they are missing
if (!(localDb as any).onboardingRequests) {
  (localDb as any).onboardingRequests = [
    {
      id: "onb-101",
      name: "Marcus Aurelius",
      company: "Stoic Capital",
      email: "marcus@stoiccapital.com",
      phone: "+1 (555) 789-0123",
      project_type: "Full Infrastructure Automation",
      budget_range: "$50,000 - $100,000",
      goals: "Establish unified operational database ledgers.",
      notes: "High priority executive relationship.",
      status: "PENDING",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "onb-102",
      name: "Jane Austin",
      company: "Pemberley Publishing",
      email: "jane@pemberley.com",
      phone: "+1 (555) 456-7890",
      project_type: "Operations Portal Redesign",
      budget_range: "$25,000 - $50,000",
      goals: "Migrate CRM and document workflows out of spreadsheets.",
      notes: "Lead requested follow-up call.",
      status: "UNDER_REVIEW",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
}

if (!(localDb as any).communicationLogs) {
  (localDb as any).communicationLogs = [
    {
      id: "com-001",
      client_id: "cli-001",
      user_id: "c76fb973-ec63-41c4-b816-56be794c483d",
      channel: "email",
      direction: "outbound",
      subject: "Strategic Retainer Proposal Review Ready",
      body: "Hello Alex Sterling, your strategic operations proposal has been compiled and is ready for your signature review.",
      status: "delivered",
      sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "com-002",
      client_id: "cli-002",
      user_id: "c76fb973-ec63-41c4-b816-56be794c483d",
      channel: "whatsapp",
      direction: "outbound",
      subject: null,
      body: "Hi Sarah, just checking if you received the brand onboarding link.",
      status: "read",
      sent_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "com-003",
      client_id: "cli-001",
      user_id: "c76fb973-ec63-41c4-b816-56be794c483d",
      channel: "automated",
      direction: "outbound",
      subject: "Invoice #1042 Paid Confirmation",
      body: "[Automated] Invoice #1042 was successfully paid by Acme Corp.",
      status: "sent",
      sent_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
}

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

  if (isMockMode) {
    localDb.activityLogs.push(logEntry);
  } else {
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
}

// Global System Notifications helper
async function triggerCommsNotification(title: string, message: string, priority = "MEDIUM") {
  if (isMockMode) {
    localDb.notifications.unshift({
      id: `not-${Date.now()}`,
      title,
      message,
      priority,
      read: false,
      timestamp: "Just now"
    } as any);
  } else {
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
}

// =========================================================================
// 3. EXECUTIVE COMMUNICATION & ONBOARDING DATA ENGINE
// =========================================================================
export const commsService = {

  // A. ONBOARDING LEADS/REQUESTS ENGINE
  async getOnboardingRequests(): Promise<any[]> {
    if (isMockMode) {
      return (localDb as any).onboardingRequests;
    }

    const { data, error } = await supabase
      .from("onboarding_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async createOnboardingRequest(input: OnboardingRequestInput): Promise<any> {
    const validated = onboardingRequestSchema.parse(input);

    if (isMockMode) {
      const mockRequest = {
        id: `onb-${Math.random().toString(36).substr(2, 9)}`,
        name: validated.name,
        company: validated.company,
        email: validated.email,
        phone: validated.phone || null,
        project_type: validated.projectType,
        budget_range: validated.budgetRange,
        goals: validated.goals,
        notes: validated.notes || null,
        status: "PENDING",
        created_at: new Date().toISOString()
      };

      (localDb as any).onboardingRequests.unshift(mockRequest);

      await triggerCommsNotification(
        "Onboarding Request Received",
        `New strategic lead ${validated.name} representing ${validated.company} submitted onboarding intake.`,
        "HIGH"
      );

      return mockRequest;
    }

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

    if (isMockMode) {
      const req = (localDb as any).onboardingRequests.find((r: any) => r.id === id);
      if (req) {
        req.status = cleanStatus;
        req.updated_at = new Date().toISOString();

        if (cleanStatus === "ACCEPTED") {
          // Auto-generate a client record in active database registry!
          const clientId = `cli-${Math.random().toString(36).substr(2, 9)}`;
          localDb.clients.unshift({
            id: clientId,
            name: req.name,
            company: req.company,
            email: req.email,
            phone: req.phone || "+1 (555) 000-0000",
            revenue: 15000, // Standard consulting start base
            projectsCount: 1,
            status: "Pending Onboarding",
            onboardingStage: "Intake Form",
            onboardingProgress: 20,
            lastActivity: "Accepted onboard",
            nextFollowUp: "Tomorrow, 10:00 AM",
            tags: ["New Lead"]
          } as any);

          await logCommsActivity(clientId, "CLIENT_INGRESS_ONBOARD", { company: req.company });
          await triggerCommsNotification("Onboarding Request Accepted", `Lead ${req.name} has been promoted to client registry.`, "HIGH");
        }
      }
      return req;
    }

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
    if (isMockMode) {
      return (localDb as any).communicationLogs.map((log: any) => {
        const clientObj = localDb.clients.find(c => c.id === log.client_id);
        return {
          ...log,
          clientName: clientObj?.company || "Strategic Guest"
        };
      });
    }

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

    if (isMockMode) {
      const mockLog = {
        id: `com-${Date.now()}`,
        client_id: validated.clientId,
        user_id: currentUserId,
        channel: validated.channel,
        direction: "outbound",
        subject: validated.subject,
        body: validated.body,
        status: "delivered",
        sent_at: new Date().toISOString()
      };

      (localDb as any).communicationLogs.unshift(mockLog);
      
      await logCommsActivity(validated.clientId ?? null, "OUTBOUND_MESSAGE_DISPATCHED", { 
        channel: validated.channel,
        recipient: input.recipient
      });

      return mockLog;
    }

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
