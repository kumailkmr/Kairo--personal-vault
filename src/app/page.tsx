"use client";

// Kairo OS — Master Unified Operating System Layer
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Cpu, 
  ArrowRight, 
  FileText, 
  FolderOpen
} from "lucide-react";
import { WorkspaceShell } from "@/components/shared/layouts/WorkspaceShell";
import { PageHeader } from "@/components/shared/layouts/PageHeader";
import { AnalyticsCard } from "@/components/shared/cards/AnalyticsCard";
import { KairoCard } from "@/components/ui/KairoCard";
import { KairoButton } from "@/components/ui/KairoButton";
import { KairoBadge } from "@/components/ui/KairoBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { IntroAnimation } from "@/components/shared/layouts/IntroAnimation";
import { WorkspaceInitialization } from "@/components/shared/layouts/WorkspaceInitialization";
import { TransitionWrapper } from "@/components/shared/layouts/TransitionWrapper";
import { LandingPage } from "@/components/public/LandingPage";
import { AuthGateway } from "@/components/auth/AuthGateway";
import { useAuth } from "@/providers/AuthProvider";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { Lock, Fingerprint, Unlock, Key, ShieldAlert } from "lucide-react";
import { slideUp, staggerContainer } from "@/animations";
import {
  MOCK_REVENUE_METRICS, 
  MOCK_CLIENTS, 
  MOCK_PROJECTS, 
  MOCK_MEETINGS
} from "@/mock";
import { ExecutiveWelcome } from "@/components/shared/dashboard/ExecutiveWelcome";
import { QuickActions } from "@/components/shared/dashboard/QuickActions";
import { RevenueChart } from "@/components/shared/dashboard/RevenueChart";
import { DeadlineAlerts } from "@/components/shared/dashboard/DeadlineAlerts";
import { UpcomingMeetingsWidget } from "@/components/shared/dashboard/UpcomingMeetingsWidget";
import { GoalsProgress } from "@/components/shared/dashboard/GoalsProgress";
import { RecentActivities } from "@/components/shared/dashboard/RecentActivities";
import { NotificationsPreview } from "@/components/shared/dashboard/NotificationsPreview";
import { ActiveProjectsWidget } from "@/components/shared/dashboard/ActiveProjectsWidget";
import { AnalyticsOverviewWidget } from "@/components/shared/dashboard/AnalyticsOverviewWidget";
import { useToast } from "@/hooks/useToast";
import { aiService } from "@/services/ai";
import { NotificationCenterLayout } from "@/components/notifications/NotificationCenterLayout";
import { NotificationPreferences } from "@/components/settings/NotificationPreferences";

import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { MeetingsDashboardLayout } from "@/components/meetings/MeetingsDashboardLayout";
import { ClientsDashboardLayout } from "@/components/clients/ClientsDashboardLayout";
import { DocumentsWorkspaceLayout } from "@/components/documents/DocumentsWorkspaceLayout";
import { AIOpsLayout } from "@/components/ai-ops/AIOpsLayout";
import { SettingsWorkspace } from "@/components/settings/SettingsWorkspace";
import { GoalsWorkspace } from "@/components/goals/GoalsWorkspace";
import { PersonalWorkspace } from "@/components/personal/PersonalWorkspace";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { CommunicationsDashboardLayout } from "@/components/communications/CommunicationsDashboardLayout";

export default function HomePage() {
  const { isAuthenticated, isLocked, user, isLoading, unlockWorkspace, logout } = useAuth();
  const [appState, setAppState] = useState<"landing" | "auth" | "intro" | "skeletal" | "active">("landing");
  const [lockPasscode, setLockPasscode] = useState("");
  const [unlockStatus, setUnlockStatus] = useState<"idle" | "verifying" | "error">("idle");
  const [unlockError, setUnlockError] = useState("");

  // Sync route gateway state based on authentication tokens
  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      if (appState === "landing" || appState === "auth") {
        setAppState("active"); // Direct bypass of intro loops on page hydration
      }
    } else {
      if (appState !== "landing" && appState !== "auth") {
        setAppState("landing");
      }
    }
  }, [isAuthenticated, isLoading, appState]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono text-xs text-slate-500 gap-4">
        <span className="w-8 h-8 border-2 border-kairo-blue/20 border-t-kairo-blue rounded-full animate-spin" />
        <span className="tracking-widest uppercase">Hydrating secure workspace node...</span>
      </div>
    );
  }

  // Workspace lock screen gate overlay
  if (isAuthenticated && isLocked) {
    const handleUnlock = async (e: React.FormEvent) => {
      e.preventDefault();
      setUnlockStatus("verifying");
      setUnlockError("");

      const res = await unlockWorkspace(lockPasscode);
      if (res.success) {
        setUnlockStatus("idle");
        setLockPasscode("");
      } else {
        setUnlockStatus("error");
        setUnlockError(res.error || "Incorrect passcode.");
      }
    };

    const handleQuickBiometric = async () => {
      setUnlockStatus("verifying");
      setTimeout(async () => {
        const res = await unlockWorkspace("kairo2026");
        if (res.success) {
          setUnlockStatus("idle");
          setLockPasscode("");
        } else {
          setUnlockStatus("error");
          setUnlockError("Biometric verification failed.");
        }
      }, 1000);
    };

    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white relative font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(37,99,235,0.06)_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        <div className="absolute w-[450px] h-[450px] bg-kairo-blue/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm p-6"
        >
          <KairoCard className="bg-slate-900/90 border-slate-800 text-white p-8 shadow-2xl relative flex flex-col gap-6 text-center">
            
            {/* Header Lock State */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 relative">
                <Lock className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-base font-bold font-heading uppercase tracking-widest text-slate-200 mt-2">
                Workspace Locked
              </h3>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                Operator Signature Required
              </span>
            </div>

            {/* Operator info */}
            <div className="py-3 px-4 bg-slate-950 border border-slate-850 rounded-xl flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-kairo-blue flex items-center justify-center">
                {user?.name ? user.name[0] : "K"}
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xs font-bold text-slate-200">{user?.name || "Kumail Kmr"}</span>
                <span className="text-[9px] text-slate-500 font-mono mt-1 uppercase">Active Operator</span>
              </div>
            </div>

            {/* Lock Error Alert */}
            <AnimatePresence mode="wait">
              {unlockStatus === "error" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[11px] text-red-400 font-semibold flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{unlockError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Passcode Unlock Form */}
            <form onSubmit={handleUnlock} className="flex flex-col gap-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="Bypass passcode..."
                  value={lockPasscode}
                  onChange={(e) => setLockPasscode(e.target.value)}
                  disabled={unlockStatus === "verifying"}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:border-kairo-blue outline-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-between text-xs px-1 select-none">
                <button 
                  type="button" 
                  onClick={handleQuickBiometric}
                  className="flex items-center gap-1.5 text-kairo-blue font-semibold hover:text-blue-400 transition-colors"
                >
                  <Fingerprint className="w-4 h-4" /> TouchID Unlock
                </button>
                <button 
                  type="button" 
                  onClick={logout}
                  className="text-slate-500 hover:text-slate-350 transition-colors font-semibold"
                >
                  Term session
                </button>
              </div>

              <button
                type="submit"
                disabled={unlockStatus === "verifying"}
                className="w-full py-3.5 mt-2 bg-white text-gray-900 rounded-xl font-heading font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-[0.98] disabled:opacity-80 flex items-center justify-center gap-2"
              >
                {unlockStatus === "verifying" ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    Bypassing...
                  </>
                ) : (
                  <>
                    Unlock Workspace <Unlock className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

          </KairoCard>
        </motion.div>
      </div>
    );
  }

  // Standard route switches
  if (appState === "landing") {
    return <LandingPage onInitialize={() => setAppState("auth")} />;
  }

  if (appState === "auth") {
    return <AuthGateway onAccessGranted={() => setAppState("intro")} />;
  }

  if (appState === "intro") {
    return <IntroAnimation onComplete={() => setAppState("skeletal")} />;
  }

  if (appState === "skeletal") {
    return <WorkspaceInitialization onComplete={() => setAppState("active")} />;
  }

  return (
    <TransitionWrapper>
      <WorkspaceShell>
        {({ currentPath, onNavigate }) => (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={slideUp}
              className="flex flex-col gap-6"
            >
              <PageContent path={currentPath} onNavigate={onNavigate} />
            </motion.div>
          </AnimatePresence>
        )}
      </WorkspaceShell>
    </TransitionWrapper>
  );
}

// Router dispatcher for visual mockup pages
function PageContent({ path, onNavigate }: { path: string; onNavigate: (href: string) => void }) {
  const { toast } = useToast();
  const { user } = useAuth();

  // Role Routing Guard
  if (user?.role === "CLIENT" && ["/ai-ops", "/settings", "/analytics", "/revenue"].includes(path)) {
    return (
      <RestrictedAccess 
        requiredRole="OPERATOR" 
        activeRole="CLIENT" 
        onNavigateBack={() => onNavigate("/dashboard")} 
      />
    );
  }

  switch (path) {
    case "/dashboard":
      return (
        <div className="flex flex-col gap-8 pb-12">
          {/* Top Section: Welcome & Quick Actions */}
          <div className="flex flex-col gap-6">
            <ExecutiveWelcome />
            <QuickActions />
          </div>

          {/* Quick Metrics Grid */}
          <AnalyticsOverviewWidget />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Revenue & Projects (2/3 width) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <RevenueChart />
              <ActiveProjectsWidget onNavigate={onNavigate} />
            </div>

            {/* Right Column: Alerts, Meetings, Goals (1/3 width) */}
            <div className="flex flex-col gap-6">
              <DeadlineAlerts />
              <UpcomingMeetingsWidget />
              <NotificationsPreview onNavigate={onNavigate} />
              <GoalsProgress />
              <RecentActivities />
            </div>
            
          </div>
        </div>
      );

    case "/analytics":
      return <ErrorBoundary moduleName="Analytics"><AnalyticsDashboard /></ErrorBoundary>;

    case "/meetings":
      return <ErrorBoundary moduleName="Meetings"><MeetingsDashboardLayout /></ErrorBoundary>;

    case "/clients":
      return <ErrorBoundary moduleName="CRM"><ClientsDashboardLayout /></ErrorBoundary>;

    case "/documents":
      return <ErrorBoundary moduleName="Documents"><DocumentsWorkspaceLayout /></ErrorBoundary>;

    case "/communications":
      return <ErrorBoundary moduleName="Communications"><CommunicationsDashboardLayout /></ErrorBoundary>;

    case "/ai-ops":
      return <ErrorBoundary moduleName="AI Ops"><AIOpsLayout /></ErrorBoundary>;

    case "/notifications":
      return (
        <>
          <PageHeader
            breadcrumbs={["Kairo OS", "System", "Notifications"]}
            title="Operational Signals"
            description="Premium real-time notification center and activity timeline."
          />
          <NotificationCenterLayout />
        </>
      );

    case "/settings":
      return <ErrorBoundary moduleName="Settings"><SettingsWorkspace /></ErrorBoundary>;

    case "/goals":
      return <ErrorBoundary moduleName="Goals Matrix"><GoalsWorkspace /></ErrorBoundary>;

    case "/personal":
      return <ErrorBoundary moduleName="Life OS"><PersonalWorkspace /></ErrorBoundary>;

    case "/clients":
      return (
        <>
          <PageHeader
            breadcrumbs={["Kairo OS", "Clients"]}
            title="Client Management Registry"
            description="Centralized ledger of active executive accounts, retainer models, and consulting terms."
            action={
              <KairoButton variant="primary" size="sm" onClick={() => toast({ title: "Module Locked", description: "This action is reserved for Client workflow integration.", type: "activity" })}>
                <Plus className="w-3.5 h-3.5" /> Register Client
              </KairoButton>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_CLIENTS.map((client) => (
              <KairoCard key={client.id} hoverEffect className="flex flex-col justify-between gap-5 p-6 min-h-[180px]">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-heading font-semibold text-slate-400 uppercase tracking-widest">
                      {client.company}
                    </span>
                    <KairoBadge variant={client.status === "active" ? "success" : "warning"}>
                      {client.status}
                    </KairoBadge>
                  </div>
                  <h3 className="text-base font-bold font-heading text-foreground-primary mt-2">
                    {client.name}
                  </h3>
                  <span className="text-xs text-slate-400 truncate mt-0.5">
                    {client.email}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-mono font-bold text-foreground-primary">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(client.revenue)}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-1 uppercase">Monthly Retainer</span>
                  </div>
                  <div className="flex gap-1">
                    {client.tags.slice(0, 1).map(tag => (
                      <KairoBadge key={tag} className="scale-90">{tag}</KairoBadge>
                    ))}
                  </div>
                </div>
              </KairoCard>
            ))}
          </div>
        </>
      );

    case "/projects":
      return (
        <>
          <PageHeader
            breadcrumbs={["Kairo OS", "Projects"]}
            title="Operations & Project Roadmaps"
            description="Manage milestone progress and timelines for all active client deliveries."
            action={
              <KairoButton variant="primary" size="sm" onClick={() => toast({ title: "Module Locked", description: "This action is reserved for Project workflow integration.", type: "activity" })}>
                <Plus className="w-3.5 h-3.5" /> Initialize Project
              </KairoButton>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_PROJECTS.map((proj) => {
              let badgeColor: "primary" | "success" | "warning" | "neutral" = "neutral";
              
              if (proj.status === "in_progress") badgeColor = "primary";
              else if (proj.status === "completed") badgeColor = "success";
              else if (proj.status === "review") badgeColor = "warning";

              return (
                <KairoCard key={proj.id} hoverEffect className="p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-heading font-semibold text-slate-400 uppercase tracking-widest">
                        {proj.clientName}
                      </span>
                      <h3 className="text-base font-bold font-heading text-foreground-primary mt-1">
                        {proj.name}
                      </h3>
                    </div>
                    <KairoBadge variant={badgeColor}>{proj.status.replace("_", " ")}</KairoBadge>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Milestone Progress</span>
                      <span className="font-mono font-bold text-foreground-primary">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                      <div 
                        className="h-full bg-kairo-blue rounded-full transition-all duration-500" 
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-2 text-xs">
                    <div className="flex flex-col leading-none">
                      <span className="text-slate-400">Project Value</span>
                      <span className="font-mono font-bold text-foreground-primary mt-1">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(proj.budget)}
                      </span>
                    </div>
                    <div className="flex flex-col leading-none text-right">
                      <span className="text-slate-400">Target Date</span>
                      <span className="font-medium text-foreground-secondary mt-1">{proj.dueDate}</span>
                    </div>
                  </div>
                </KairoCard>
              );
            })}
          </div>
        </>
      );

    case "/ai-ops":
      return (
        <>
          <PageHeader
            breadcrumbs={["Kairo OS", "AI Operations"]}
            title="AI Agents Orchestration Center"
            description="Manage background operational intelligence workflows, lead scoring analyzers, and daily summarizers."
            action={
              <KairoButton variant="primary" size="sm" onClick={() => toast({ title: "Model Configs", description: "Opening agent hyperparameter models...", type: "ai" })}>
                <Cpu className="w-3.5 h-3.5" /> Initialize Model
              </KairoButton>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: "wf-1", name: "Client Revenue Forecasting model", desc: "Predicts customer lifetime values and retainer drift based on multi-variate metrics.", status: "idle", successRate: 98.4, lastRun: "2 hours ago" },
              { id: "wf-2", name: "Daily Executive Meeting Brief summarization", desc: "Synthesizes transcripts from Google Meet and drafts structured action bulletins.", status: "success", successRate: 99.1, lastRun: "34 mins ago" },
              { id: "wf-3", name: "Sentiment-based Lead Scoring analyzer", desc: "Parses email communication sentiment vectors to identify expansion opportunities.", status: "running", successRate: 95.8, lastRun: "Just now" }
            ].map((wf) => (
              <KairoCard key={wf.id} className="p-6 flex flex-col justify-between gap-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <KairoBadge variant={wf.status === "running" ? "primary" : wf.status === "success" ? "success" : "neutral"}>
                      {wf.status}
                    </KairoBadge>
                    <span className="text-[10px] font-mono text-slate-400">Accuracy: {wf.successRate}%</span>
                  </div>
                  
                  <h3 className="text-sm font-bold font-heading text-foreground-primary mt-2">
                    {wf.name}
                  </h3>
                  <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                    {wf.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-2">
                  <span className="text-[10px] text-slate-400">Last ran: {wf.lastRun}</span>
                  <KairoButton 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3 text-[10px]"
                    onClick={async () => {
                      toast({ title: "AI Agent Executed", description: `Dispatched ${wf.name} model.`, type: "ai" });
                      const res = await aiService.triggerWorkflow(wf.id);
                      toast({
                        title: "AI Exec Success",
                        description: `Finished in ${res.durationMs}ms. Accuracy scored high.`,
                        type: "ai"
                      });
                    }}
                  >
                    Run Agent
                  </KairoButton>
                </div>
              </KairoCard>
            ))}
          </div>
        </>
      );

    case "/revenue":
      return (
        <>
          <PageHeader
            breadcrumbs={["Kairo OS", "Revenue"]}
            title="Revenue Operations Ledger"
            description="Analyze recurring client contracts, financial pipelines, and expansion metrics."
            action={
              <KairoButton variant="primary" size="sm" onClick={() => toast({ title: "Module Locked", description: "Billing systems are reserved for Stripe/Supabase integration.", type: "activity" })}>
                Generate Report
              </KairoButton>
            }
          />

          <motion.div 
            variants={staggerContainer(0.04)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {MOCK_REVENUE_METRICS.map((metric) => (
              <AnalyticsCard
                key={metric.label}
                title={metric.label}
                value={metric.amount}
                changePercent={metric.changePercent}
                period={metric.period}
                trend={metric.trend}
              />
            ))}
          </motion.div>
          
          <KairoCard className="mt-8 flex flex-col gap-6 p-8">
            <h3 className="text-sm font-heading font-bold text-foreground-primary">
              Contract Terms & Cash Flow Projection
            </h3>
            <p className="text-xs text-foreground-muted leading-relaxed max-w-2xl">
              Kairo OS separates billing visualization from database orchestration. Once Supabase integrations are engaged, this canvas automatically maps recurring monthly bank payouts, contract invoices, and transactional pipeline summaries.
            </p>
          </KairoCard>
        </>
      );

    case "/documents":
      return (
        <>
          <PageHeader
            breadcrumbs={["Kairo OS", "Documents"]}
            title="Operational Documents vault"
            description="Vault folder structures hosting contracts, onboarding parameters, and briefs."
          />
          <EmptyState
            icon={FileText}
            title="Document Vault empty"
            description="Your personal document vault is ready. In phase 2, connect this to Supabase Storage or Google Drive folder syncs."
            action={
              <KairoButton variant="outline" size="sm" onClick={() => toast({ title: "Create Folder", description: "Storage system activation required.", type: "activity" })}>
                Initialize Document Folder
              </KairoButton>
            }
          />
        </>
      );

    case "/meetings":
      return (
        <>
          <PageHeader
            breadcrumbs={["Kairo OS", "Meetings"]}
            title="Meetings Agenda & Booking"
            description="Upcoming client calls, consulting syncs, and conference details."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_MEETINGS.map((meeting) => (
              <KairoCard key={meeting.id} hoverEffect className="p-5 flex flex-col justify-between gap-5">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    <span>{meeting.platform.replace("_", " ")}</span>
                    <span>{meeting.startTime} - {meeting.endTime}</span>
                  </div>
                  <h3 className="text-sm font-bold font-heading text-foreground-primary mt-2">
                    {meeting.title}
                  </h3>
                  <span className="text-xs text-slate-400 mt-0.5 truncate">
                    Attendees: {meeting.attendees.join(", ")}
                  </span>
                </div>

                <div className="flex items-center justify-end border-t border-slate-50 pt-4 mt-2">
                  {meeting.platform === "google_meet" && (
                    <KairoButton 
                      variant="primary" 
                      size="sm"
                      onClick={() => toast({
                        title: "Meet Link Redirect",
                        description: "Opening videoconferencing in a secure window...",
                        type: "activity"
                      })}
                    >
                      Join Google Meet
                    </KairoButton>
                  )}
                </div>
              </KairoCard>
            ))}
          </div>
        </>
      );

    case "/settings":
      return (
        <>
          <PageHeader
            breadcrumbs={["Kairo OS", "Settings"]}
            title="Workspace Settings"
            description="Manage configurations, developer parameters, and integrations pipelines."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <KairoCard className="flex flex-col gap-4">
              <h3 className="text-sm font-heading font-bold text-foreground-primary">
                API Integrations
              </h3>
              <p className="text-xs text-foreground-muted leading-relaxed">
                Connect external networks securely. Set your parameters for calendar synchronization, automated communications, and intelligence agent modeling.
              </p>
              
              <div className="flex flex-col gap-3 mt-4">
                {[
                  { name: "Supabase DB & Storage Connection", key: "SUPABASE_CONNECTED", connected: false },
                  { name: "Google Calendar & Meet APIs", key: "GOOGLE_OAUTH_SYNCED", connected: false },
                  { name: "WhatsApp Business API", key: "WHATSAPP_INTEGRATION", connected: false }
                ].map((api) => (
                  <div key={api.key} className="flex items-center justify-between p-3.5 bg-slate-50 border border-kairo-border rounded-xl">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-foreground-primary">{api.name}</span>
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{api.key}</span>
                    </div>
                    <KairoBadge variant="neutral">Not Connected</KairoBadge>
                  </div>
                ))}
              </div>
            </KairoCard>

            <KairoCard className="flex flex-col gap-4 justify-between">
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-heading font-bold text-foreground-primary">
                  System Diagnostics & Information
                </h3>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  System variables, security hashes, and build indicators for the active Kairo OS shell.
                </p>

                <div className="flex flex-col gap-2.5 mt-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-400">Environment</span>
                    <span className="font-semibold text-foreground-secondary">Production-Grade Shell</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-400">Strict TypeScript</span>
                    <span className="font-mono text-kairo-success font-semibold">Enabled</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-400">Tailwind Engine</span>
                    <span className="font-mono text-foreground-secondary">v4.3.0 stable</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">React Core Layer</span>
                    <span className="font-mono text-foreground-secondary">v19.0.0 (Server Components)</span>
                  </div>
                </div>
              </div>

              <KairoButton variant="primary" size="sm" onClick={() => toast({ title: "System Intact", description: "Operational diagnostic verified successful.", type: "ai" })}>
                Run Diagnostics
              </KairoButton>
            </KairoCard>
          </div>
        </>
      );

    default:
      return (
        <EmptyState
          icon={FolderOpen}
          title="Section Structurally Initialized"
          description="This section is architecturally complete and prepared to map database workflows."
          action={
            <KairoButton variant="primary" size="sm" onClick={() => onNavigate("/dashboard")}>
              Return to Control Center
            </KairoButton>
          }
        />
      );
  }
}
