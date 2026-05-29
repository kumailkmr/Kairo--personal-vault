export interface PersonalGoal {
  id: string;
  title: string;
  category: "Business" | "Personal" | "Skill";
  timeframe: "Short-Term" | "Long-Term";
  progress: number; // 0-100
  status: "Active" | "Paused" | "Completed";
  priority: "High" | "Medium" | "Low";
  deadline: string;
  linkedProject?: string;
}

export interface RoadmapItem {
  id: string;
  objective: string;
  quarter: string; // e.g. Q4 2026
  timeline: string;
  status: "In Progress" | "Planned" | "Completed";
  dependencies: string[];
  notes: string;
}

export interface HabitItem {
  id: string;
  name: string;
  frequency: string;
  streak: number;
  completedToday: boolean;
}

export interface FocusBlock {
  id: string;
  timeSlot: string;
  activity: string;
  completed: boolean;
}

export interface ReflectionEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "Strategic" | "Reflection" | "Idea";
}

export const MOCK_GOALS: PersonalGoal[] = [
  {
    id: "g-1",
    title: "Scale CRM Retainer Revenue to $50k/mo",
    category: "Business",
    timeframe: "Short-Term",
    progress: 75,
    status: "Active",
    priority: "High",
    deadline: "Dec 31, 2026",
    linkedProject: "AI Pipeline Integration"
  },
  {
    id: "g-2",
    title: "Master Rust Systems Programming",
    category: "Skill",
    timeframe: "Long-Term",
    progress: 40,
    status: "Active",
    priority: "Medium",
    deadline: "March 2027"
  },
  {
    id: "g-3",
    title: "Complete 100km Ultra-marathon",
    category: "Personal",
    timeframe: "Long-Term",
    progress: 60,
    status: "Active",
    priority: "High",
    deadline: "June 2027"
  },
  {
    id: "g-4",
    title: "Deploy Automated Document pipelines",
    category: "Business",
    timeframe: "Short-Term",
    progress: 100,
    status: "Completed",
    priority: "High",
    deadline: "Oct 2026",
    linkedProject: "Documents Engine"
  }
];

export const MOCK_ROADMAP: RoadmapItem[] = [
  {
    id: "rm-1",
    objective: "Execute Q4 Client Expansion Drive",
    quarter: "Q4 2026",
    timeline: "Oct - Dec 2026",
    status: "In Progress",
    dependencies: ["Signed MSA contracts", "Proposal generation live"],
    notes: "Follow up closely with Nexus and Stark Labs to lock Q4 retainer expansions."
  },
  {
    id: "rm-2",
    objective: "Integrate Automated WhatsApp Gateway",
    quarter: "Q4 2026",
    timeline: "Nov 2026",
    status: "Planned",
    dependencies: ["Meta API configuration"],
    notes: "Move from frontend mock mode to live webhook routing."
  },
  {
    id: "rm-3",
    objective: "Complete Core OS Security Audits",
    quarter: "Q1 2027",
    timeline: "Jan - Feb 2027",
    status: "Planned",
    dependencies: ["Database access encryption"],
    notes: "Begin zero-trust validation audits for local business systems."
  }
];

export const MOCK_HABITS: HabitItem[] = [
  { id: "h-1", name: "Deep Work block (4 hours)", frequency: "Daily", streak: 12, completedToday: true },
  { id: "h-2", name: "Technical reading (30 mins)", frequency: "Daily", streak: 5, completedToday: true },
  { id: "h-3", name: "Cardio training session", frequency: "4x / week", streak: 3, completedToday: false }
];

export const MOCK_FOCUS_BLOCKS: FocusBlock[] = [
  { id: "fb-1", timeSlot: "08:00 AM - 12:00 PM", activity: "High-intensity system development", completed: true },
  { id: "fb-2", timeSlot: "02:00 PM - 04:00 PM", activity: "Outreach & client calls", completed: true },
  { id: "fb-3", timeSlot: "04:30 PM - 06:00 PM", activity: "OS roadmaps & strategic reflection", completed: false }
];

export const MOCK_REFLECTIONS: ReflectionEntry[] = [
  {
    id: "ref-1",
    title: "AI Integration Insights",
    content: "Transitioning AI operations to automated trigger systems holds immense potential. However, keeping close founder oversight on contract templates is key to quality assurance.",
    date: "Today, 5:30 PM",
    type: "Strategic"
  },
  {
    id: "ref-2",
    title: "Rust learning velocity",
    content: "Need to allocate more daily focus hours on understanding lifetimes and memory ownership boundaries in Rust system architectures.",
    date: "2 days ago",
    type: "Reflection"
  }
];

export const MOCK_PRODUCTIVITY_METRICS = {
  productivityScore: 94.8,
  focusHoursThisWeek: 32.5,
  consistencyScore: 96.0,
  taskCompletionRate: 98.2,
  weeklyTrend: [
    { day: "Mon", hours: 6.5 },
    { day: "Tue", hours: 7.2 },
    { day: "Wed", hours: 8.0 },
    { day: "Thu", hours: 6.8 },
    { day: "Fri", hours: 4.0 }
  ]
};
