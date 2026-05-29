import { supabase, isMockMode, localDb } from "@/lib/supabase";
import { 
  clientSchema, 
  projectSchema, 
  meetingSchema, 
  invoiceSchema,
  ClientInput,
  ProjectInput,
  MeetingInput,
  InvoiceInput
} from "@/schemas";
import { Client, Project, Meeting } from "@/types";
import { CRMClient } from "@/mock/clients";

// ==========================================
// 1. REPOSITORY AUDITING LOGS UTILITY
// ==========================================
async function logActivity(clientId: string, action: string, details: Record<string, unknown>, userId = "c76fb973-ec63-41c4-b816-56be794c483d") {
  const logEntry = {
    id: `act-${Math.random().toString(36).substr(2, 9)}`,
    client_id: clientId,
    user_id: userId,
    action,
    details,
    created_at: new Date().toISOString()
  };

  if (isMockMode) {
    localDb.activityLogs.push(logEntry);
    console.log(`[Audit Log] ${action} logged for Client: ${clientId}`);
  } else {
    try {
      await supabase.from("client_activity_logs").insert(logEntry);
    } catch (err) {
      console.error("Failed to persist operational audit log to Supabase:", err);
    }
  }
}

// ==========================================
// 2. ENTERPRISE OPERATIONAL DATA ENGINE
// ==========================================
export const dbService = {

  // A. CRM INFRASTRUCTURE
  async getClients(): Promise<CRMClient[]> {
    if (isMockMode) {
      // Re-map the active mock list dynamically to match type expectations
      return localDb.clients.map(item => {
        // If it's already a rich CRMClient, return it
        if ("onboardingProgress" in item) {
          return item as unknown as CRMClient;
        }
        // Otherwise, construct a rich CRMClient representation from Client
        return {
          id: item.id,
          name: item.name,
          company: item.company,
          email: item.email,
          phone: "+1 (555) 000-0000",
          revenue: item.revenue,
          projectsCount: 1,
          status: item.status === "active" ? "Active" : item.status === "onboarding" ? "Pending Onboarding" : "Inactive",
          onboardingStage: "Fully Onboarded",
          onboardingProgress: 100,
          lastActivity: "Just now",
          nextFollowUp: "Tomorrow, 10:00 AM",
          tags: item.tags || []
        };
      });
    }

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw new Error(error.message);

    return data.map(item => ({
      id: item.id,
      name: item.contact_name,
      company: item.company_name,
      email: item.email,
      phone: item.phone || "+1 (555) 000-0000",
      revenue: parseFloat(item.monthly_retainer),
      projectsCount: 1,
      status: item.retainer_status === "ACTIVE" ? "Active" : item.retainer_status === "REVIEW" ? "Pending Onboarding" : "Inactive",
      onboardingStage: "Fully Onboarded",
      onboardingProgress: 100,
      lastActivity: "Just now",
      nextFollowUp: "Tomorrow, 10:00 AM",
      tags: []
    }));
  },

  async createClient(input: ClientInput): Promise<CRMClient> {
    const validated = clientSchema.parse(input);

    const clientData = {
      id: `cli-${Date.now()}`,
      contact_name: validated.name,
      company_name: validated.company,
      email: validated.email,
      phone: validated.phone,
      retainer_status: validated.status === "active" ? "ACTIVE" : validated.status === "onboarding" ? "REVIEW" : "TERMINATED",
      monthly_retainer: validated.revenue,
      owner_id: "c76fb973-ec63-41c4-b816-56be794c483d"
    };

    if (isMockMode) {
      const newClient: CRMClient = {
        id: clientData.id,
        name: validated.name,
        company: validated.company,
        email: validated.email,
        phone: validated.phone,
        revenue: validated.revenue,
        projectsCount: 0,
        status: validated.status === "active" ? "Active" : validated.status === "onboarding" ? "Pending Onboarding" : "Inactive",
        onboardingStage: "Intake Form",
        onboardingProgress: 20,
        lastActivity: "Just now",
        nextFollowUp: "Tomorrow, 10:00 AM",
        tags: validated.tags || []
      };
      
      localDb.clients.unshift(newClient as unknown as Client);
      await logActivity(clientData.id, "CLIENT_INGRESS", { company: validated.company });
      return newClient;
    }

    const { data, error } = await supabase
      .from("clients")
      .insert({
        company_name: clientData.company_name,
        contact_name: clientData.contact_name,
        email: clientData.email,
        phone: clientData.phone,
        retainer_status: clientData.retainer_status,
        monthly_retainer: clientData.monthly_retainer,
        owner_id: clientData.owner_id
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    
    await logActivity(data.id, "CLIENT_INGRESS", { company: data.company_name });
    
    return {
      id: data.id,
      name: data.contact_name,
      company: data.company_name,
      email: data.email,
      phone: data.phone || "",
      revenue: parseFloat(data.monthly_retainer),
      projectsCount: 0,
      status: data.retainer_status === "ACTIVE" ? "Active" : data.retainer_status === "REVIEW" ? "Pending Onboarding" : "Inactive",
      onboardingStage: "Intake Form",
      onboardingProgress: 20,
      lastActivity: "Just now",
      nextFollowUp: "Tomorrow, 10:00 AM",
      tags: []
    };
  },

  // B. PROJECTS INFRASTRUCTURE
  async getProjects(): Promise<Project[]> {
    if (isMockMode) {
      return localDb.projects;
    }
    const { data, error } = await supabase
      .from("projects")
      .select("*, clients(company_name)")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(item => ({
      id: item.id,
      name: item.name,
      clientName: (item.clients as unknown as { company_name: string })?.company_name || "Unknown Client",
      status: item.status.toLowerCase() as any,
      progress: item.progress,
      budget: parseFloat(item.budget),
      dueDate: item.due_date.split("T")[0]
    }));
  },

  async createProject(input: ProjectInput): Promise<Project> {
    const validated = projectSchema.parse(input);

    const projectData = {
      id: `p-${Math.random().toString(36).substr(2, 9)}`,
      client_id: validated.clientId,
      name: validated.name,
      description: validated.description || "",
      status: validated.status,
      progress: validated.progress,
      budget: validated.budget,
      due_date: validated.dueDate
    };

    if (isMockMode) {
      const parentClient = localDb.clients.find(c => c.id === validated.clientId);
      const newProj: Project = {
        id: projectData.id,
        name: validated.name,
        clientName: parentClient?.company || "Stoic Investments",
        status: validated.status.toLowerCase() as any,
        progress: validated.progress,
        budget: validated.budget,
        dueDate: validated.dueDate.split("T")[0]
      };
      localDb.projects.unshift(newProj);
      
      await logActivity(validated.clientId, "PROJECT_CREATION", { projectName: validated.name, budget: validated.budget });
      return newProj;
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        client_id: projectData.client_id,
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        progress: projectData.progress,
        budget: projectData.budget,
        due_date: projectData.due_date
      })
      .select("*, clients(company_name)")
      .single();

    if (error) throw new Error(error.message);

    await logActivity(data.client_id, "PROJECT_CREATION", { projectName: data.name, budget: data.budget });

    return {
      id: data.id,
      name: data.name,
      clientName: (data.clients as unknown as { company_name: string })?.company_name || "Unknown Client",
      status: data.status.toLowerCase() as any,
      progress: data.progress,
      budget: parseFloat(data.budget),
      dueDate: data.due_date.split("T")[0]
    };
  },

  // C. MEETINGS INFRASTRUCTURE
  async getMeetings(): Promise<Meeting[]> {
    if (isMockMode) {
      return localDb.meetings;
    }
    const { data, error } = await supabase
      .from("meetings")
      .select("*, clients(contact_name)")
      .order("start_time", { ascending: true });

    if (error) throw new Error(error.message);
    return data.map(item => {
      const start = new Date(item.start_time);
      const end = new Date(item.end_time);
      return {
        id: item.id,
        title: item.title,
        attendees: [item.clients?.contact_name || "Client Representative", "Kumail Kmr"],
        startTime: `${String(start.getUTCHours()).padStart(2, "0")}:${String(start.getUTCMinutes()).padStart(2, "0")}`,
        endTime: `${String(end.getUTCHours()).padStart(2, "0")}:${String(end.getUTCMinutes()).padStart(2, "0")}`,
        platform: item.platform as any,
        link: item.platform_link
      };
    });
  },

  async createMeeting(input: MeetingInput): Promise<Meeting> {
    const validated = meetingSchema.parse(input);

    const meetingData = {
      id: `m-${Math.random().toString(36).substr(2, 9)}`,
      client_id: validated.clientId || null,
      title: validated.title,
      description: validated.description || "",
      platform: validated.platform,
      platform_link: validated.platformLink,
      start_time: validated.startTime,
      end_time: validated.endTime
    };

    if (isMockMode) {
      const parentClient = localDb.clients.find(c => c.id === validated.clientId);
      const start = new Date(validated.startTime);
      const end = new Date(validated.endTime);
      const newMeet: Meeting = {
        id: meetingData.id,
        title: validated.title,
        attendees: [parentClient?.name || "Marcus Aurelius", "Kumail Kmr"],
        startTime: `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`,
        endTime: `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`,
        platform: validated.platform as any,
        link: validated.platformLink
      };
      localDb.meetings.push(newMeet);
      
      if (validated.clientId) {
        await logActivity(validated.clientId, "MEETING_SCHEDULED", { title: validated.title, platform: validated.platform });
      }
      return newMeet;
    }

    const { data, error } = await supabase
      .from("meetings")
      .insert({
        client_id: meetingData.client_id,
        title: meetingData.title,
        description: meetingData.description,
        platform: meetingData.platform,
        platform_link: meetingData.platform_link,
        start_time: meetingData.start_time,
        end_time: meetingData.end_time
      })
      .select("*, clients(contact_name)")
      .single();

    if (error) throw new Error(error.message);

    if (data.client_id) {
      await logActivity(data.client_id, "MEETING_SCHEDULED", { title: data.title, platform: data.platform });
    }

    const start = new Date(data.start_time);
    const end = new Date(data.end_time);

    return {
      id: data.id,
      title: data.title,
      attendees: [data.clients?.contact_name || "Client Representative", "Kumail Kmr"],
      startTime: `${String(start.getUTCHours()).padStart(2, "0")}:${String(start.getUTCMinutes()).padStart(2, "0")}`,
      endTime: `${String(end.getUTCHours()).padStart(2, "0")}:${String(end.getUTCMinutes()).padStart(2, "0")}`,
      platform: data.platform as any,
      link: data.platform_link
    };
  },

  // D. FINANCIALS (INVOICES)
  async createInvoice(input: InvoiceInput) {
    const validated = invoiceSchema.parse(input);

    const invoiceData = {
      id: `inv-${Math.random().toString(36).substr(2, 9)}`,
      client_id: validated.clientId,
      project_id: validated.projectId || null,
      invoice_number: validated.invoiceNumber,
      status: validated.status,
      issue_date: validated.issueDate,
      due_date: validated.dueDate,
      tax: validated.tax,
      amount: validated.items.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0)
    };

    if (isMockMode) {
      await logActivity(validated.clientId, "INVOICE_GENERATED", { 
        invoiceNumber: validated.invoiceNumber, 
        amount: invoiceData.amount 
      });
      return invoiceData;
    }

    const { data: invoiceResult, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        client_id: invoiceData.client_id,
        project_id: invoiceData.project_id,
        invoice_number: invoiceData.invoice_number,
        status: invoiceData.status,
        tax: invoiceData.tax,
        amount: invoiceData.amount,
        issue_date: invoiceData.issue_date,
        due_date: invoiceData.due_date
      })
      .select()
      .single();

    if (invoiceError) throw new Error(invoiceError.message);

    const lineItems = validated.items.map(item => ({
      invoice_id: invoiceResult.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      amount: item.quantity * item.unitPrice
    }));

    const { error: itemsError } = await supabase
      .from("invoice_items")
      .insert(lineItems);

    if (itemsError) throw new Error(itemsError.message);

    await logActivity(invoiceResult.client_id, "INVOICE_GENERATED", { 
      invoiceNumber: invoiceResult.invoice_number, 
      amount: invoiceResult.amount 
    });

    return invoiceResult;
  },

  // E. STORAGE RELATIONSHIPS (UPLOAD ATTACHMENTS)
  async uploadRelationalAsset(clientId: string, file: File, bucket = "documents") {
    const fileExt = file.name.split(".").pop();
    const filePath = `vault/${clientId}/${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    if (isMockMode) {
      const mockDoc = {
        id: `doc-${Math.random().toString(36).substr(2, 9)}`,
        client_id: clientId,
        file_name: file.name,
        file_path: filePath,
        file_hash: "sha256-mock-hash",
        doc_type: "onboarding_upload",
        status: "APPROVED",
        created_at: new Date().toISOString()
      };
      localDb.documents.push(mockDoc);
      await logActivity(clientId, "ASSET_VAULTED", { fileName: file.name, path: filePath });
      return mockDoc;
    }

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data: docData, error: dbError } = await supabase
      .from("documents")
      .insert({
        client_id: clientId,
        file_name: file.name,
        file_path: filePath,
        file_hash: "sha256-hash-placeholder",
        doc_type: "proposal",
        status: "ACTIVE"
      })
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);

    await logActivity(clientId, "ASSET_VAULTED", { fileName: file.name, path: filePath });
    return docData;
  }
};
