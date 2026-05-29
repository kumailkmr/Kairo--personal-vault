"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Cpu, 
  ArrowRight, 
  FileText, 
  FolderOpen, 
  RefreshCw,
  ExternalLink
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
import { slideUp, staggerContainer } from "@/animations";
import { 
  MOCK_REVENUE_METRICS, 
  MOCK_CLIENTS, 
  MOCK_PROJECTS, 
  MOCK_MEETINGS, 
  MOCK_GOALS 
} from "@/mock";
import { useToast } from "@/hooks/useToast";
import { aiService } from "@/services/ai";

export default function HomePage() {
  const [appState, setAppState] = useState<"landing" | "auth" | "intro" | "skeletal" | "active">("landing");

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

  switch (path) {
    case "/dashboard":
      return (
        <>
          <PageHeader
            breadcrumbs={["Kairo OS", "Dashboard"]}
            title="Operations Control Center"
            description="Private executive intelligence dashboard and real-time operations console."
            action={
              <div className="flex gap-2.5">
                <KairoButton
                  variant="outline"
                  size="sm"
                  onClick={() => toast({
                    title: "Sync Process Engaged",
                    description: "Syncing Google Calendar & Meetings in the background...",
                    type: "deadline"
                  })}
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sync Shell
                </KairoButton>
                <KairoButton
                  variant="primary"
                  size="sm"
                  onClick={() => toast({
                    title: "AI Forecaster Launched",
                    description: "Synthesizing client database modeling...",
                    type: "ai"
                  })}
                >
                  <Cpu className="w-3.5 h-3.5" /> Dispatch Agent
                </KairoButton>
              </div>
            }
          />

          {/* Quick Metrics Grid */}
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

          {/* Detailed Workspace Operations Grids */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-6">
            
            {/* Live Project Delivery Tracker Table */}
            <div className="xl:col-span-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-heading font-bold text-foreground-primary">
                  Operational Project Pipeline
                </h3>
                <KairoButton variant="ghost" size="sm" onClick={() => onNavigate("/projects")}>
                  View all roadmaps <ArrowRight className="w-3 h-3" />
                </KairoButton>
              </div>

              <KairoCard className="p-0 border border-kairo-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-kairo-border text-[10px] font-heading font-bold text-slate-400 uppercase tracking-widest">
                        <th className="px-6 py-3.5">Project Name</th>
                        <th className="px-6 py-3.5">Client Profile</th>
                        <th className="px-6 py-3.5">Completion</th>
                        <th className="px-6 py-3.5">Budget</th>
                        <th className="px-6 py-3.5">Timeline Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-kairo-border/60 text-xs text-foreground-secondary">
                      {MOCK_PROJECTS.map((proj) => {
                        let statusColor: "primary" | "success" | "warning" | "neutral" = "neutral";
                        let statusLabel = "Planning";

                        if (proj.status === "in_progress") {
                          statusColor = "primary";
                          statusLabel = "In Progress";
                        } else if (proj.status === "completed") {
                          statusColor = "success";
                          statusLabel = "Completed";
                        } else if (proj.status === "review") {
                          statusColor = "warning";
                          statusLabel = "Under Review";
                        }

                        return (
                          <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4.5 font-semibold text-foreground-primary">
                              {proj.name}
                            </td>
                            <td className="px-6 py-4.5 font-medium">{proj.clientName}</td>
                            <td className="px-6 py-4.5">
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200/50">
                                  <div 
                                    className="h-full bg-kairo-blue rounded-full transition-all duration-500" 
                                    style={{ width: `${proj.progress}%` }}
                                  />
                                </div>
                                <span className="font-mono font-bold leading-none">{proj.progress}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4.5 font-mono font-medium">
                              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(proj.budget)}
                            </td>
                            <td className="px-6 py-4.5">
                              <KairoBadge variant={statusColor}>{statusLabel}</KairoBadge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </KairoCard>
            </div>

            {/* Quick Agenda & Objectives Panel */}
            <div className="flex flex-col gap-6">
              
              {/* Daily Google Meet Agenda */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-heading font-bold text-foreground-primary">
                  Today&apos;s Meetings agenda
                </h3>
                
                <div className="flex flex-col gap-3.5">
                  {MOCK_MEETINGS.map((meeting) => (
                    <KairoCard key={meeting.id} className="p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs font-semibold text-foreground-primary font-heading line-clamp-1">
                          {meeting.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0 select-none">
                          {meeting.startTime} - {meeting.endTime}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1 gap-3">
                        <span className="text-[10px] text-foreground-muted truncate">
                          {meeting.attendees.join(", ")}
                        </span>
                        
                        {meeting.platform === "google_meet" ? (
                          <KairoButton 
                            variant="secondary" 
                            size="sm" 
                            className="px-2.5 py-1 text-[10px] h-6"
                            onClick={() => toast({
                              title: "Google Meet Launched",
                              description: "Redirecting to video conference link...",
                              type: "activity"
                            })}
                          >
                            Join Meet <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                          </KairoButton>
                        ) : (
                          <KairoBadge variant="neutral">In Person</KairoBadge>
                        )}
                      </div>
                    </KairoCard>
                  ))}
                </div>
              </div>

              {/* Private Executive Objectives */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-heading font-bold text-foreground-primary">
                  Active Focus Objectives
                </h3>
                
                <KairoCard className="p-4.5 flex flex-col gap-3.5">
                  {MOCK_GOALS.map((goal) => (
                    <div key={goal.id} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground-secondary line-clamp-1">
                          {goal.title}
                        </span>
                        <KairoBadge variant={goal.category === "ai" ? "primary" : "neutral"} className="scale-90 origin-right">
                          {goal.category}
                        </KairoBadge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                          <div 
                            className="h-full bg-kairo-blue rounded-full" 
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono font-bold leading-none text-slate-400">
                          {goal.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </KairoCard>
              </div>

            </div>

          </div>
        </>
      );

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
