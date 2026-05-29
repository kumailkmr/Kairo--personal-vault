export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
}

export type ClientStatus = 'active' | 'inactive' | 'onboarding';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  status: ClientStatus;
  revenue: number;
  tags: string[];
}

export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';

export interface Project {
  id: string;
  name: string;
  clientName: string;
  status: ProjectStatus;
  progress: number; // 0 to 100
  budget: number;
  dueDate: string;
}

export interface RevenueMetric {
  label: string;
  amount: number;
  changePercent: number;
  period: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface Meeting {
  id: string;
  title: string;
  attendees: string[];
  startTime: string;
  endTime: string;
  platform: 'google_meet' | 'zoom' | 'teams' | 'in_person';
  link?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'folder';
  size?: string;
  lastModified: string;
  owner: string;
}

export type NotificationType = 'alert' | 'deadline' | 'activity' | 'ai';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: NotificationType;
}

export interface GoalItem {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  category: 'business' | 'personal' | 'ai';
  progress: number;
  targetDate: string;
}

export interface AIWorkflow {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  successRate: number;
  lastRun: string;
}
