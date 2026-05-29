export type RequestStatus = "Pending" | "Under Review" | "Accepted" | "Declined";

export interface ProjectRequest {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  goals: string;
  notes: string;
  status: RequestStatus;
  date: string;
}

export const MOCK_PROJECT_REQUESTS: ProjectRequest[] = [
  {
    id: "req-201",
    name: "John Doe",
    company: "Acme Corp",
    email: "john@acmecorp.com",
    phone: "+1 (555) 123-4567",
    projectType: "Custom SaaS Dashboard",
    budgetRange: "$25,000 - $50,000",
    goals: "Unify internal sales tracking, logistics schedules, and custom CRM profiles into a singular premium executive portal.",
    notes: "Requires integration with Slack webhooks and Vercel hosting readiness by Q1 2027.",
    status: "Pending",
    date: "Today, 10:45 AM"
  },
  {
    id: "req-202",
    name: "Sarah Jenkins",
    company: "Vortex Labs",
    email: "s.jenkins@vortex.io",
    phone: "+44 7700 900088",
    projectType: "AI Automation Workspace",
    budgetRange: "$50,000+",
    goals: "Build an automated invoice builder and contracts organizer protected by strictly-typed validation logic.",
    notes: "Needs biometric placeholder elements and secure session indicators for deep workspace protection.",
    status: "Under Review",
    date: "Yesterday, 3:15 PM"
  },
  {
    id: "req-203",
    name: "Carlos Santana",
    company: "Ouroboros Inc",
    email: "carlos@ouroboros.org",
    phone: "+34 600 987 654",
    projectType: "Internal Operations System",
    budgetRange: "$10,000 - $25,000",
    goals: "Standardize client retainer logs, projects timelines, and meetings calendar schedules across team nodes.",
    notes: "Calm, dark-theme layout highly preferred. Spacing elements must be executive-grade.",
    status: "Accepted",
    date: "Oct 24, 2026"
  }
];
