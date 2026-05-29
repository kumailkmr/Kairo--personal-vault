import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  DollarSign, 
  FileText, 
  Calendar, 
  Bell, 
  Target, 
  Heart, 
  Cpu, 
  Settings 
} from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  section: "workspace" | "personal" | "system";
  badgeKey?: string; // key to lookup standard counts
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  // Workspace Section
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    section: "workspace"
  },
  {
    name: "Clients",
    href: "/clients",
    icon: Users,
    section: "workspace",
    badgeKey: "activeClients"
  },
  {
    name: "Projects",
    href: "/projects",
    icon: Briefcase,
    section: "workspace",
    badgeKey: "pendingProjects"
  },
  {
    name: "Revenue",
    href: "/revenue",
    icon: DollarSign,
    section: "workspace"
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FileText,
    section: "workspace"
  },
  {
    name: "Meetings",
    href: "/meetings",
    icon: Calendar,
    section: "workspace",
    badgeKey: "todaysMeetings"
  },
  
  // Operational Intelligence Section
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
    section: "system",
    badgeKey: "unreadAlerts"
  },
  {
    name: "Goals",
    href: "/goals",
    icon: Target,
    section: "personal"
  },
  {
    name: "Personal Life",
    href: "/personal",
    icon: Heart,
    section: "personal"
  },
  {
    name: "AI Operations",
    href: "/ai-ops",
    icon: Cpu,
    section: "system",
    badgeKey: "runningAgents"
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    section: "system"
  }
];
