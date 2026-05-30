/**
 * Strict database type interfaces mapping directly to Supabase PostgreSQL schema.
 * Prevents type leaks, avoids hardcoding, and ensures standard, robust compile verification.
 */

export type UserRole = "OPERATOR" | "CLIENT" | "operator" | "client";
export type RetainerStatus = "ACTIVE" | "REVIEW" | "PAUSED" | "TERMINATED" | "active" | "review" | "paused" | "terminated";
export type ProjectStatus = "PLANNING" | "IN_PROGRESS" | "REVIEW" | "COMPLETED" | "ARCHIVED" | "planning" | "in_progress" | "review" | "completed" | "archived";
export type TaskStatus = "TODO" | "DOING" | "REVIEW" | "DONE" | "todo" | "doing" | "review" | "done";
export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "low" | "medium" | "high" | "critical";
export type DocType = "proposal" | "contract" | "sow" | "nda" | "template";
export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "VOID" | "draft" | "sent" | "paid" | "overdue" | "void";

export interface UserProfile {
  id: string; // UUID references auth.users(id)
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  theme: string;
  timezone: string;
  biometrics_enabled: boolean;
  mfa_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  owner_id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  retainer_status: RetainerStatus;
  monthly_retainer: number;
  created_at: string;
  updated_at: string;
}

export interface ClientContact {
  id: string;
  client_id: string;
  full_name: string;
  role?: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  progress: number;
  budget: number;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  target_date: string;
  completed_at?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  milestone_id?: string;
  assignee_id?: string;
  title: string;
  description?: string;
  due_date?: string;
  status: TaskStatus;
  priority: PriorityLevel;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  client_id?: string;
  title: string;
  description?: string;
  platform: string;
  platform_link: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface MeetingNote {
  id: string;
  meeting_id: string;
  author_id: string;
  content: string;
  action_items?: string[];
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  client_id: string;
  project_id?: string;
  invoice_number: string;
  status: InvoiceStatus;
  amount: number;
  tax: number;
  issue_date: string;
  due_date: string;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: string;
  transaction_id?: string;
  status: string;
  paid_at: string;
  created_at: string;
}

export interface Document {
  id: string;
  client_id?: string;
  file_name: string;
  file_path: string;
  file_hash?: string;
  doc_type: DocType;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Agreement {
  id: string;
  client_id: string;
  title: string;
  status: string;
  sent_at?: string;
  signed_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  agreement_id?: string;
  client_id: string;
  title: string;
  budget_estimate: number;
  scope_details: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AIAgent {
  id: string;
  name: string;
  agent_type: string;
  description?: string;
  status: string;
  success_rate: number;
  last_run?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowRun {
  id: string;
  workflow_id: string;
  status: string;
  execution_time_ms: number;
  metadata?: Record<string, any>;
  executed_at: string;
}

export interface Goal {
  id: string;
  owner_id: string;
  objective: string;
  description?: string;
  time_horizon: string;
  progress: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  priority: PriorityLevel;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}
