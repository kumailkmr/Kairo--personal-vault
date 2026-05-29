export type ClientStatus = "Active" | "Pending Onboarding" | "Inactive" | "Archived";
export type OnboardingStage = "Intake Form" | "Assets Received" | "Agreements Signed" | "Kickoff Completed" | "Fully Onboarded";

export interface CRMClient {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  revenue: number;
  projectsCount: number;
  status: ClientStatus;
  onboardingStage: OnboardingStage;
  onboardingProgress: number; // 0-100
  lastActivity: string;
  nextFollowUp: string | null;
  tags: string[];
}

export const MOCK_CRM_CLIENTS: CRMClient[] = [
  {
    id: "cli-001",
    name: "Alex Sterling",
    company: "Acme Corp",
    email: "alex@acmecorp.com",
    phone: "+1 (555) 019-2834",
    revenue: 125000,
    projectsCount: 3,
    status: "Active",
    onboardingStage: "Fully Onboarded",
    onboardingProgress: 100,
    lastActivity: "2 hours ago",
    nextFollowUp: "Tomorrow, 2:00 PM",
    tags: ["Enterprise", "High Priority"]
  },
  {
    id: "cli-002",
    name: "Sarah Chen",
    company: "Nexus Industries",
    email: "schen@nexus.io",
    phone: "+1 (555) 847-1928",
    revenue: 45000,
    projectsCount: 1,
    status: "Pending Onboarding",
    onboardingStage: "Assets Received",
    onboardingProgress: 40,
    lastActivity: "1 day ago",
    nextFollowUp: "Today, 4:30 PM",
    tags: ["Tech", "New Client"]
  },
  {
    id: "cli-003",
    name: "Marcus Wright",
    company: "Stark Labs",
    email: "m.wright@stark.com",
    phone: "+44 7700 900077",
    revenue: 280000,
    projectsCount: 5,
    status: "Active",
    onboardingStage: "Fully Onboarded",
    onboardingProgress: 100,
    lastActivity: "3 days ago",
    nextFollowUp: "Next Week",
    tags: ["Enterprise", "Recurring"]
  },
  {
    id: "cli-004",
    name: "Elena Rodriguez",
    company: "Ouroboros Design",
    email: "elena@ouroboros.design",
    phone: "+34 600 123 456",
    revenue: 18500,
    projectsCount: 1,
    status: "Inactive",
    onboardingStage: "Fully Onboarded",
    onboardingProgress: 100,
    lastActivity: "2 months ago",
    nextFollowUp: null,
    tags: ["Agency", "Legacy"]
  }
];

export const MOCK_CLIENT_TIMELINE = [
  { id: "tl-1", type: "meeting", title: "Strategy Sync Completed", date: "Today, 10:00 AM", detail: "Discussed Q3 roadmap and allocated budget for new phase." },
  { id: "tl-2", type: "document", title: "MSA Signed", date: "Oct 12, 2026", detail: "Master Services Agreement executed by both parties." },
  { id: "tl-3", type: "payment", title: "Invoice #1042 Paid", date: "Oct 10, 2026", detail: "Received $15,000 for phase 1 delivery." },
  { id: "tl-4", type: "onboarding", title: "Assets Received", date: "Oct 05, 2026", detail: "Brand guidelines and API keys securely transferred." }
];

export const MOCK_CLIENT_PROJECTS = [
  { id: "p-1", name: "AI Pipeline Integration", status: "Active", progress: 65, dueDate: "Dec 15, 2026" },
  { id: "p-2", name: "Mobile App V2", status: "Planning", progress: 10, dueDate: "Feb 01, 2027" },
  { id: "p-3", name: "Brand Refresh", status: "Completed", progress: 100, dueDate: "Sep 30, 2026" }
];

export const MOCK_CLIENT_INVOICES = [
  { id: "inv-1042", amount: 15000, status: "Paid", date: "Oct 10, 2026" },
  { id: "inv-1043", amount: 25000, status: "Pending", date: "Oct 25, 2026" },
  { id: "inv-1044", amount: 5000, status: "Draft", date: "Nov 01, 2026" }
];

export const MOCK_CLIENT_DOCUMENTS = [
  { id: "doc-1", name: "Master Services Agreement.pdf", type: "Agreement", size: "2.4 MB", date: "Oct 12, 2026" },
  { id: "doc-2", name: "Q3 Strategy Deck.key", type: "Presentation", size: "15.1 MB", date: "Oct 01, 2026" },
  { id: "doc-3", name: "Brand Assets.zip", type: "Assets", size: "45.0 MB", date: "Oct 05, 2026" }
];

export const MOCK_CLIENT_COMMS = [
  { id: "msg-1", type: "email", sender: "Alex Sterling", preview: "Great meeting today. Let's proceed with the phase 2 expansion...", date: "Today, 11:30 AM" },
  { id: "msg-2", type: "whatsapp", sender: "Kumail Kmr", preview: "Just sent over the draft for review.", date: "Yesterday, 4:15 PM" },
  { id: "msg-3", type: "automated", sender: "System", preview: "Invoice #1042 was successfully paid.", date: "Oct 10, 2026" }
];
