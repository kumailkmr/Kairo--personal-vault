export type DocStatus = "Draft" | "In Review" | "Sent" | "Signed" | "Completed" | "Archived";
export type DocType = "Proposal" | "Invoice" | "Contract" | "NDA" | "SOW" | "SLA" | "Onboarding";

export interface MockDocument {
  id: string;
  title: string;
  type: DocType;
  client: string;
  status: DocStatus;
  lastEdited: string;
  author: string;
}

export const MOCK_DOCUMENTS: MockDocument[] = [
  { id: "doc-101", title: "Q4 Retainer Proposal", type: "Proposal", client: "Acme Corp", status: "Sent", lastEdited: "2 hrs ago", author: "Kumail Kmr" },
  { id: "doc-102", title: "Invoice #1043", type: "Invoice", client: "Nexus Industries", status: "Draft", lastEdited: "1 day ago", author: "Kumail Kmr" },
  { id: "doc-103", title: "Master Services Agreement", type: "Contract", client: "Stark Labs", status: "Signed", lastEdited: "Oct 12, 2026", author: "Kumail Kmr" },
  { id: "doc-104", title: "Mutual NDA", type: "NDA", client: "Ouroboros Design", status: "Completed", lastEdited: "Sep 30, 2026", author: "Kumail Kmr" },
  { id: "doc-105", title: "Phase 1 SOW", type: "SOW", client: "Nexus Industries", status: "In Review", lastEdited: "Oct 15, 2026", author: "Kumail Kmr" },
];

export interface MockTemplate {
  id: string;
  name: string;
  category: DocType;
  description: string;
  usageCount: number;
}

export const MOCK_TEMPLATES: MockTemplate[] = [
  { id: "tpl-1", name: "Executive Proposal v2", category: "Proposal", description: "Standard high-tier proposal with tiered pricing structure.", usageCount: 42 },
  { id: "tpl-2", name: "Standard Invoice", category: "Invoice", description: "Clean, professional invoice with embedded payment links.", usageCount: 156 },
  { id: "tpl-3", name: "B2B Service Agreement", category: "Contract", description: "Comprehensive MSA for long-term engagements.", usageCount: 28 },
  { id: "tpl-4", name: "Strict Mutual NDA", category: "NDA", description: "Standard non-disclosure agreement for early talks.", usageCount: 89 },
  { id: "tpl-5", name: "Client Intake Packet", category: "Onboarding", description: "Welcome guide and credentials request form.", usageCount: 34 },
];

export const MOCK_AUTOMATIONS = [
  { id: "auto-1", name: "Onboarding Trigger", trigger: "Deal Closed (Won)", action: "Generate Client Intake Packet", status: "Active" },
  { id: "auto-2", name: "Invoice Reminder", trigger: "Invoice Overdue > 3 days", action: "Send automated email + SMS", status: "Active" },
  { id: "auto-3", name: "NDA Auto-Gen", trigger: "Discovery Call Scheduled", action: "Draft Mutual NDA", status: "Paused" },
];
