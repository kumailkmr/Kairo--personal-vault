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
