import { Client, Project, Meeting, NotificationItem, GoalItem, RevenueMetric, UserProfile } from "@/types";

export const MOCK_USER: UserProfile = {
  id: "u-1",
  name: "Kumail Kmr",
  email: "kumail@kairo.co",
  role: "Chief Operating Officer",
  avatarUrl: "" // Empty triggers letters avatar
};

export const MOCK_REVENUE_METRICS: RevenueMetric[] = [
  {
    label: "Monthly Recurring Revenue",
    amount: 142850,
    changePercent: 12.4,
    period: "vs last month",
    trend: "up"
  },
  {
    label: "Active Project Pipeline",
    amount: 685000,
    changePercent: 8.2,
    period: "vs last quarter",
    trend: "up"
  },
  {
    label: "Average Client Contract",
    amount: 18500,
    changePercent: -1.4,
    period: "vs last month",
    trend: "down"
  },
  {
    label: "Operational Savings Index",
    amount: 32400,
    changePercent: 19.8,
    period: "vs last month",
    trend: "up"
  }
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: "c-1",
    name: "Alastair Vance",
    company: "Aetherius Capital",
    email: "alastair@aetherius.cap",
    status: "active",
    revenue: 48000,
    tags: ["Enterprise", "Retainer"]
  },
  {
    id: "c-2",
    name: "Helena Rostova",
    company: "Novus Biotech",
    email: "h.rostova@novus.bio",
    status: "active",
    revenue: 95000,
    tags: ["Enterprise", "Consulting"]
  },
  {
    id: "c-3",
    name: "Marcus Aurelius",
    company: "Stoic Investments",
    email: "marcus@stoic.capital",
    status: "onboarding",
    revenue: 24000,
    tags: ["Growth", "Fixed-Price"]
  },
  {
    id: "c-4",
    name: "Siobhan Roy",
    company: "Waystar Legacy",
    email: "siobhan@waystar.com",
    status: "active",
    revenue: 120000,
    tags: ["Key Client", "Advisory"]
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: "p-1",
    name: "Systemic Infrastructure Scaling",
    clientName: "Novus Biotech",
    status: "in_progress",
    progress: 74,
    budget: 95000,
    dueDate: "2026-06-15"
  },
  {
    id: "p-2",
    name: "Executive Brand Repositioning",
    clientName: "Aetherius Capital",
    status: "planning",
    progress: 15,
    budget: 48000,
    dueDate: "2026-07-01"
  },
  {
    id: "p-3",
    name: "Automated Lead Funnel Architect",
    clientName: "Stoic Investments",
    status: "review",
    progress: 90,
    budget: 24000,
    dueDate: "2026-06-05"
  },
  {
    id: "p-4",
    name: "Quarterly Intelligence Dashboard",
    clientName: "Waystar Legacy",
    status: "completed",
    progress: 100,
    budget: 65000,
    dueDate: "2026-05-20"
  }
];

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: "m-1",
    title: "Novus Biotech Operations Synch",
    attendees: ["Helena Rostova", "Kumail Kmr", "Sarah Chen"],
    startTime: "14:00",
    endTime: "14:45",
    platform: "google_meet",
    link: "https://meet.google.com/novus-sync"
  },
  {
    id: "m-2",
    title: "Quarterly Revenue Review",
    attendees: ["Kumail Kmr", "David Goggins (Advisor)"],
    startTime: "16:00",
    endTime: "17:00",
    platform: "in_person"
  },
  {
    id: "m-3",
    title: "Onboarding Launch Call",
    attendees: ["Marcus Aurelius", "Kumail Kmr"],
    startTime: "11:30",
    endTime: "12:00",
    platform: "google_meet",
    link: "https://meet.google.com/stoic-onboard"
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    title: "AI Pipeline Finished",
    message: "Sentiment-based Lead Scoring analyzer succeeded with 95.8% accuracy.",
    time: "2 mins ago",
    read: false,
    type: "ai"
  },
  {
    id: "n-2",
    title: "Project Milestone Pending Review",
    message: "Automated Lead Funnel Architect has hit 90% progress and requires review.",
    time: "1 hour ago",
    read: false,
    type: "deadline"
  },
  {
    id: "n-3",
    title: "New Onboarding Request",
    message: "Marcus Aurelius from Stoic Investments completed onboarding setup.",
    time: "4 hours ago",
    read: true,
    type: "activity"
  }
];

export const MOCK_GOALS: GoalItem[] = [
  {
    id: "g-1",
    title: "Complete operational automation setup",
    status: "in_progress",
    category: "ai",
    progress: 85,
    targetDate: "2026-06-10"
  },
  {
    id: "g-2",
    title: "Onboard 3 new enterprise tier partners",
    status: "in_progress",
    category: "business",
    progress: 66,
    targetDate: "2026-06-30"
  },
  {
    id: "g-3",
    title: "Establish daily mindfulness rhythm",
    status: "pending",
    category: "personal",
    progress: 0,
    targetDate: "2026-06-01"
  }
];

export const SYSTEM_COUNTS = {
  activeClients: MOCK_CLIENTS.filter(c => c.status === "active").length,
  pendingProjects: MOCK_PROJECTS.filter(p => p.status !== "completed").length,
  todaysMeetings: MOCK_MEETINGS.length,
  unreadAlerts: MOCK_NOTIFICATIONS.filter(n => !n.read).length,
  runningAgents: 1
};
