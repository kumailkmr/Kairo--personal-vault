import { supabase } from "@/lib/supabase";
import { 
  ClientInput,
  ProjectInput,
  MeetingInput,
  InvoiceInput
} from "@/schemas";
import { Project, Meeting, Client } from "@/types";
import { createClientAction } from "@/actions/crm";
import { createProjectAction } from "@/actions/projects";
import { createMeetingAction } from "@/actions/meetings";
import { createInvoiceAction } from "@/actions/finance";
import { createDocumentAction } from "@/actions/documents";

// ==========================================
// ENTERPRISE OPERATIONAL DATA ENGINE
// ==========================================
export const dbService = {

  // A. CRM READS & SECURED DELEGATED WRITES


  async getClients(): Promise<Client[]> {
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
      revenue: parseFloat(item.monthly_retainer as any),
      status: item.retainer_status === "ACTIVE" ? "active" : item.retainer_status === "REVIEW" ? "onboarding" : "inactive",
      tags: []
    }));
  },

  async createClient(input: ClientInput): Promise<Client> {
    // Delegate to secure, validated Server Action
    const res = await createClientAction(input);
    if (!res.success) {
      throw new Error(res.error);
    }
    
    const data = res.data;
    return {
      id: data.id,
      name: data.contact_name || data.name,
      company: data.company_name || data.company,
      email: data.email,
      revenue: parseFloat(data.monthly_retainer || data.revenue),
      status: (data.retainer_status === "ACTIVE" || data.status === "active") ? "active" : "onboarding",
      tags: data.tags || []
    };
  },
  async getProjects(): Promise<Project[]> {
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
      budget: parseFloat(item.budget as any),
      dueDate: item.due_date.split("T")[0]
    }));
  },

  async createProject(input: ProjectInput): Promise<Project> {
    // Delegate to secure, validated Server Action
    const res = await createProjectAction(input);
    if (!res.success) {
      throw new Error(res.error);
    }
    const data = res.data;
    return {
      id: data.id,
      name: data.name,
      clientName: data.clientName || "CRM Client",
      status: data.status ? data.status.toLowerCase() as any : "planning",
      progress: data.progress || 0,
      budget: parseFloat(data.budget || 0),
      dueDate: data.due_date ? data.due_date.split("T")[0] : new Date().toISOString().split("T")[0]
    };
  },

  // C. MEETINGS READS & DELEGATED WRITES
  async getMeetings(): Promise<Meeting[]> {
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
    // Delegate to secure, validated Server Action
    const res = await createMeetingAction(input);
    if (!res.success) {
      throw new Error(res.error);
    }
    const data = res.data;
    const start = new Date(data.start_time || data.startTime);
    const end = new Date(data.end_time || data.endTime);

    return {
      id: data.id,
      title: data.title,
      attendees: [data.client_name || "Client Representative", "Kumail Kmr"],
      startTime: `${String(start.getUTCHours()).padStart(2, "0")}:${String(start.getUTCMinutes()).padStart(2, "0")}`,
      endTime: `${String(end.getUTCHours()).padStart(2, "0")}:${String(end.getUTCMinutes()).padStart(2, "0")}`,
      platform: (data.platform || "google_meet") as any,
      link: data.platform_link || data.platformLink
    };
  },

  async getNotifications() {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(item => ({
      id: item.id,
      title: item.title,
      message: item.message,
      time: item.created_at,
      read: item.is_read,
      type: (item.priority === "CRITICAL" ? "alert" : "activity") as any,
      priority: item.priority.toLowerCase() as any
    }));
  },

  // D. FINANCIALS (INVOICES) - DELEGATED WRITES
  async getRevenueMetrics() {
    const { data, error } = await supabase
      .from("revenue_analytics_cache")
      .select("*");
    
    if (error) throw new Error(error.message);
    
    if (!data || data.length === 0) {
      // Fallback zero state if not calculated yet
      return [
        { label: "Annual Recurring Revenue (ARR)", amount: 0, changePercent: 0, period: "vs last quarter", trend: "up" },
        { label: "Monthly Recurring Revenue (MRR)", amount: 0, changePercent: 0, period: "vs last month", trend: "up" },
        { label: "Lifetime Paid Receipts", amount: 0, changePercent: 0, period: "vs baseline", trend: "up" }
      ];
    }
    
    return data.map(item => ({
      label: item.metric_name,
      amount: item.metric_value,
      changePercent: item.change_percent,
      period: item.period_label,
      trend: item.trend_direction?.toLowerCase() || "up"
    }));
  },

  async getMonthlyRevenue() {
    const { data, error } = await supabase
      .from("invoices")
      .select("amount, issue_date")
      .eq("status", "PAID")
      .order("issue_date", { ascending: true });
      
    if (error) throw new Error(error.message);
    
    // Aggregate by month (very simplified for UI display)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const aggregated: Record<string, number> = {};
    
    if (data) {
      data.forEach(inv => {
        const date = new Date(inv.issue_date);
        const monthStr = months[date.getMonth()];
        aggregated[monthStr] = (aggregated[monthStr] || 0) + parseFloat(inv.amount as any);
      });
    }
    
    // Return last 6 months logic could go here, but returning a static set of keys populated with DB data:
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(m => ({
      month: m,
      revenue: aggregated[m] || 0,
      expenses: (aggregated[m] || 0) * 0.3 // Mocking expenses for chart aesthetics, or query expenses table if it exists
    }));
  },

  async createInvoice(input: InvoiceInput) {
    // Delegate to secure, validated Server Action
    const res = await createInvoiceAction(input);
    if (!res.success) {
      throw new Error(res.error);
    }
    return res.data;
  },

  // E. STORAGE RELATIONSHIPS (UPLOAD ATTACHMENTS) - SECURED DATABASE ENTRY
  async uploadRelationalAsset(clientId: string, file: File, bucket = "documents") {
    const fileExt = file.name.split(".").pop();
    const filePath = `vault/${clientId}/${Math.random().toString(36).substr(2, 9)}.${fileExt}`;



    // 1. Upload storage blob client-side
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    // 2. Delegate database insert securely to Server Action
    const res = await createDocumentAction({
      clientId,
      fileName: file.name,
      filePath,
      fileHash: "sha256-hash-placeholder",
      docType: "proposal",
      status: "ACTIVE"
    });

    if (!res.success) {
      throw new Error(res.error);
    }

    return res.data;
  }
};
