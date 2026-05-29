export interface AIEmployee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "Active" | "Idle" | "Training";
  tasksHandled: number;
  performanceScore: number; // 0-100
  recentActivity: string;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  status: "Active" | "Paused";
  lastTriggered: string;
}

export interface AITask {
  id: string;
  type: string;
  agent: string;
  status: "Running" | "Queued" | "Completed" | "Failed";
  timestamp: string;
  relatedEntity: string;
}

export interface AIInsight {
  id: string;
  type: "warning" | "success" | "info";
  message: string;
  timestamp: string;
}

export interface AISubscription {
  id: string;
  name: string;
  provider: string;
  usage: number; // percentage 0-100
  limitLabel: string;
  cost: string;
  status: "Active" | "Warning" | "Inactive";
}

export const MOCK_AI_EMPLOYEES: AIEmployee[] = [
  {
    id: "emp-1",
    name: "Aria",
    role: "Client Onboarding AI",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    status: "Active",
    tasksHandled: 1420,
    performanceScore: 98.4,
    recentActivity: "Processed Acme Corp onboarding form."
  },
  {
    id: "emp-2",
    name: "Cyra",
    role: "Proposal Generation AI",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
    status: "Active",
    tasksHandled: 843,
    performanceScore: 96.8,
    recentActivity: "Generated Q4 Website Redesign proposal for Stark Labs."
  },
  {
    id: "emp-3",
    name: "Dax",
    role: "Invoice & Ledger Assistant",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
    status: "Idle",
    tasksHandled: 2314,
    performanceScore: 99.2,
    recentActivity: "Calculated totals & added tax exemptions for Stark Labs."
  },
  {
    id: "emp-4",
    name: "Lyra",
    role: "WhatsApp Outreach AI",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    status: "Active",
    tasksHandled: 4120,
    performanceScore: 94.1,
    recentActivity: "Sent payment reminder to Nexus Industries."
  },
  {
    id: "emp-5",
    name: "Kaelen",
    role: "Ads & Media Gen AI",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&h=100&q=80",
    status: "Training",
    tasksHandled: 124,
    performanceScore: 91.5,
    recentActivity: "Analyzing target metrics for Higgsfield ad creation."
  }
];

export const MOCK_AI_WORKFLOWS: AutomationWorkflow[] = [
  {
    id: "wf-1",
    name: "Onboard Welcome Cycle",
    trigger: "CRM Client Created",
    condition: "Status is Active",
    action: "Send WhatsApp welcome + Generate Proposal draft",
    status: "Active",
    lastTriggered: "2 mins ago"
  },
  {
    id: "wf-2",
    name: "Autopay Reminders",
    trigger: "Invoice Due in 3 days",
    condition: "Status is Pending",
    action: "Email client invoice link + WhatsApp reminder",
    status: "Active",
    lastTriggered: "1 hour ago"
  },
  {
    id: "wf-3",
    name: "Post-Call Summary",
    trigger: "Meeting Completed",
    condition: "Type is Strategy",
    action: "Generate strategic notes summary + upload files to docs",
    status: "Active",
    lastTriggered: "Yesterday"
  },
  {
    id: "wf-4",
    name: "Lead Re-engagement",
    trigger: "Lead inactive 30 days",
    condition: "Priority is High",
    action: "Draft re-engagement proposal for founder review",
    status: "Paused",
    lastTriggered: "5 days ago"
  }
];

export const MOCK_AI_TASKS: AITask[] = [
  {
    id: "task-901",
    type: "WhatsApp Outreach",
    agent: "Lyra",
    status: "Running",
    timestamp: "Just now",
    relatedEntity: "Nexus Industries"
  },
  {
    id: "task-902",
    type: "Ad Video Compilation",
    agent: "Kaelen",
    status: "Queued",
    timestamp: "1 min ago",
    relatedEntity: "Q4 Campaign"
  },
  {
    id: "task-903",
    type: "Document Synthesizer",
    agent: "Cyra",
    status: "Completed",
    timestamp: "12 mins ago",
    relatedEntity: "Nexus SOW draft"
  },
  {
    id: "task-904",
    type: "Ledger Update",
    agent: "Dax",
    status: "Completed",
    timestamp: "1 hour ago",
    relatedEntity: "Invoice #1043"
  },
  {
    id: "task-905",
    type: "Contract Review",
    agent: "Aria",
    status: "Failed",
    timestamp: "3 hours ago",
    relatedEntity: "Acme Corp MSA"
  }
];

export const MOCK_AI_INSIGHTS: AIInsight[] = [
  {
    id: "ins-1",
    type: "success",
    message: "Aria successfully closed onboarding loops for 3 enterprise clients this week.",
    timestamp: "2 hours ago"
  },
  {
    id: "ins-2",
    type: "warning",
    message: "Lyra detected WhatsApp delivery failure to Stark Labs. Standard fallback email queued.",
    timestamp: "4 hours ago"
  },
  {
    id: "ins-3",
    type: "info",
    message: "Cyra reports a 18% increase in proposal layout acceptance over the last 15 iterations.",
    timestamp: "1 day ago"
  }
];

export const MOCK_AI_SUBSCRIPTIONS: AISubscription[] = [
  {
    id: "sub-1",
    name: "OpenAI GPT-4o API",
    provider: "OpenAI",
    usage: 62.5,
    limitLabel: "6.2M tokens / 10.0M tokens limit",
    cost: "$124.50",
    status: "Active"
  },
  {
    id: "sub-2",
    name: "WhatsApp Cloud Business Api",
    provider: "Meta Developer",
    usage: 84.1,
    limitLabel: "8,410 / 10,000 sent messages",
    cost: "$42.05",
    status: "Warning"
  },
  {
    id: "sub-3",
    name: "Higgsfield AI Video API",
    provider: "Higgsfield Inc.",
    usage: 15.0,
    limitLabel: "15 mins generated / 100 mins total",
    cost: "$150.00",
    status: "Active"
  },
  {
    id: "sub-4",
    name: "Google Calendar & Meet Connector",
    provider: "Google Cloud Console",
    usage: 4.8,
    limitLabel: "480 requests / 10,000 requests limit",
    cost: "$0.00",
    status: "Active"
  }
];
