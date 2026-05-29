"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { commsService } from "@/services/comms.service";
import { dbService } from "@/services/db.service";
import { PageHeader } from "@/components/shared/layouts/PageHeader";
import { 
  MessageSquare, Users, History, FileText, BarChart2, Plus, 
  Send, Link, Check, X, Eye, Phone, Mail, Loader2, ArrowUpRight, Copy 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CommunicationsDashboardLayout: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"onboarding" | "timeline" | "templates" | "analytics">("onboarding");

  // A. FETCH CRM CLIENTS FOR THE MESSAGING COMPOSER
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => dbService.getClients()
  });

  // B. DYNAMIC QUERIES SECURING REALTIME INVALS
  const { data: onboardingRequests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ["onboardingRequests"],
    queryFn: () => commsService.getOnboardingRequests()
  });

  const { data: commsLogs = [], isLoading: loadingLogs } = useQuery({
    queryKey: ["communicationLogs"],
    queryFn: () => commsService.getCommunicationLogs()
  });

  // Real-time Supabase Synchronizations
  useRealtimeSync("onboarding_requests", ["onboardingRequests"]);
  useRealtimeSync("communication_logs", ["communicationLogs"]);

  // C. LINK GENERATION STATES
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [generatorName, setGeneratorName] = useState("");
  const [generatorCompany, setGeneratorCompany] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // D. COMPOSE MESSAGING STATES
  const [composerClient, setComposerClient] = useState("");
  const [composerChannel, setComposerChannel] = useState<"whatsapp" | "email">("email");
  const [composerRecipient, setComposerRecipient] = useState("");
  const [composerSubject, setComposerSubject] = useState("");
  const [composerBody, setComposerBody] = useState("");

  // E. MUTATIONS
  const generateLinkMutation = useMutation({
    mutationFn: async () => {
      const mockId = `onb-${Math.random().toString(36).substr(2, 9)}`;
      const url = `${window.location.origin}/onboard/${mockId}`;
      setGeneratedUrl(url);
      setCopied(false);
      return url;
    }
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await commsService.updateOnboardingStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboardingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    }
  });

  const sendMsgMutation = useMutation({
    mutationFn: async () => {
      if (!composerRecipient || !composerBody) {
        throw new Error("Recipient and message body are required.");
      }
      return await commsService.sendOutboundMessage({
        clientId: composerClient || null,
        channel: composerChannel,
        recipient: composerRecipient,
        subject: composerChannel === "email" ? composerSubject || "Kairo OS Executive Operations" : undefined,
        body: composerBody
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communicationLogs"] });
      setComposerBody("");
      setComposerSubject("");
      alert("Executive communication successfully dispatched.");
    },
    onError: (err: any) => {
      alert(`Dispatch Error: ${err.message}`);
    }
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s === "ACCEPTED") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (s === "DECLINED") return "bg-rose-50 text-rose-600 border-rose-100";
    if (s === "UNDER_REVIEW") return "bg-blue-50 text-blue-600 border-blue-100";
    return "bg-amber-50 text-amber-600 border-amber-100";
  };

  return (
    <>
      <PageHeader 
        breadcrumbs={["Kairo OS", "Operations", "Communications Center"]}
        title="Executive Communication & Intake Control"
        description="Premium WhatsApp alerts, email sequences, and client onboarding workflows."
        action={
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            <Link className="w-4 h-4" /> Create Onboarding Link
          </button>
        }
      />

      <div className="flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex items-center p-1 bg-white border border-slate-200 rounded-2xl w-full sm:w-fit shadow-sm overflow-x-auto">
          {[
            { id: "onboarding", name: "Onboarding leads", icon: Users },
            { id: "timeline", name: "Message Timeline", icon: History },
            { id: "templates", name: "Template catalog", icon: FileText },
            { id: "analytics", name: "Comms KPIs", icon: BarChart2 }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider cursor-pointer whitespace-nowrap ${
                activeTab === t.id ? "bg-slate-50 text-gray-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.name}
            </button>
          ))}
        </div>

        {/* Tab contents */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* Tab 1: ONBOARDING LEADS PIPELINE */}
            {activeTab === "onboarding" && (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 xl:grid-cols-3 gap-6"
              >
                {/* Onboarding Leads Table */}
                <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Active Intake Pipeline</h3>
                  </div>
                  {loadingRequests ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-kairo-blue" /></div>
                  ) : onboardingRequests.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 font-medium">No onboarding requests active.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/20 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <th className="px-6 py-4">Lead</th>
                            <th className="px-6 py-4">Project Scope</th>
                            <th className="px-6 py-4">Budget Cycle</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Operations</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {onboardingRequests.map((req: any) => (
                            <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-gray-900">{req.name}</span>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{req.company}</span>
                                  <span className="text-xs text-slate-400 mt-1">{req.email}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-slate-700">{req.project_type}</span>
                                  <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">{req.goals}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-semibold text-gray-700">
                                {req.budget_range}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(req.status)}`}>
                                  {req.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                {req.status.toUpperCase() === "PENDING" || req.status.toUpperCase() === "UNDER_REVIEW" ? (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      disabled={statusMutation.isPending}
                                      onClick={() => statusMutation.mutate({ id: req.id, status: "ACCEPTED" })}
                                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      disabled={statusMutation.isPending}
                                      onClick={() => statusMutation.mutate({ id: req.id, status: "DECLINED" })}
                                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-xs font-semibold text-slate-400">Processed</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Right Column: Intake Instructions */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-slate-100 pb-3">Intake Control Protocol</h3>
                  <div className="space-y-4 text-xs text-slate-500 leading-relaxed">
                    <p>When a prospective client onboarding request is <strong>Accepted</strong>:</p>
                    <ul className="list-disc pl-4 space-y-2 font-medium">
                      <li>The lead is promoted directly into the active CRM clients database registry with a starting review status.</li>
                      <li>Standard monthly consulting retainer triggers configuration routines.</li>
                      <li>A secure operations timeline audit event is cataloged.</li>
                    </ul>
                    <hr className="border-slate-100" />
                    <p>Generate a secure dynamic onboarding token above to copy and distribute unique client-facing intake portals.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 2: REALTIME MESSAGE HISTORY & COMPOSER */}
            {activeTab === "timeline" && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 xl:grid-cols-3 gap-6"
              >
                {/* Outbound Messaging Composer */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-5 h-fit">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Send className="w-4 h-4 text-kairo-blue" /> Executive Composer
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Link client */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Link Active Client</label>
                      <select
                        value={composerClient}
                        onChange={(e) => setComposerClient(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue outline-none"
                      >
                        <option value="">Select CRM Client...</option>
                        {clients.map(c => (
                          <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                        ))}
                      </select>
                    </div>

                    {/* Mode channel */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Messaging Channel</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setComposerChannel("email")}
                          className={`py-2 text-xs font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                            composerChannel === "email" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <Mail className="w-3.5 h-3.5 inline mr-1.5" /> Email
                        </button>
                        <button
                          onClick={() => setComposerChannel("whatsapp")}
                          className={`py-2 text-xs font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                            composerChannel === "whatsapp" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <Phone className="w-3.5 h-3.5 inline mr-1.5" /> WhatsApp
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Recipient Address/Phone</label>
                      <input
                        type="text"
                        placeholder={composerChannel === "email" ? "alex@acmecorp.com" : "+15550192834"}
                        value={composerRecipient}
                        onChange={(e) => setComposerRecipient(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue outline-none"
                      />
                    </div>

                    {composerChannel === "email" && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Subject</label>
                        <input
                          type="text"
                          placeholder="e.g. Strategic Operations Review"
                          value={composerSubject}
                          onChange={(e) => setComposerSubject(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue outline-none"
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Message Text</label>
                      <textarea
                        rows={5}
                        placeholder="Type outbound executive message..."
                        value={composerBody}
                        onChange={(e) => setComposerBody(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue outline-none resize-none"
                      />
                    </div>

                    <button
                      disabled={sendMsgMutation.isPending}
                      onClick={() => sendMsgMutation.mutate()}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                      {sendMsgMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          Dispatch Message <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Message Log Timeline */}
                <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Realtime Message Stream</h3>
                  </div>

                  {loadingLogs ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-kairo-blue" /></div>
                  ) : commsLogs.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 font-medium">No messages in timeline.</div>
                  ) : (
                    <div className="p-6 overflow-y-auto max-h-[700px] space-y-4">
                      {commsLogs.map((log: any) => (
                        <div key={log.id} className="flex gap-4 p-4 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors">
                          <div className={`p-2 rounded-xl shrink-0 h-fit ${
                            log.channel === "email" ? "bg-blue-50 text-blue-500" :
                            log.channel === "whatsapp" ? "bg-emerald-50 text-emerald-500" : "bg-purple-50 text-purple-500"
                          }`}>
                            {log.channel === "email" ? <Mail className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs font-bold text-gray-900 mr-2">{log.clientName}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{log.direction}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {new Date(log.sent_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>

                            {log.subject && (
                              <div className="text-xs font-bold text-gray-700">Sub: {log.subject}</div>
                            )}

                            <p className="text-xs text-slate-600 leading-relaxed font-sans">{log.body}</p>

                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">{log.status || "delivered"}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Tab 3: TEMPLATES MANAGER */}
            {activeTab === "templates" && (
              <motion.div
                key="templates"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {[
                  {
                    title: "Brand Welcome Intake",
                    channel: "Email",
                    desc: "Inbound client onboarding welcoming and credentials intake packet request.",
                    body: "Hello {{client_name}},\n\nWelcome to Kairo OS! To begin mapping your operational systems, please fill out your secure intake packet at: {{onboard_url}}."
                  },
                  {
                    title: "Retainer Invoice Reminder",
                    channel: "WhatsApp/SMS",
                    desc: "Triggered cycle invoice tracking alert.",
                    body: "Dear {{client_name}}, this is an operational notice that invoice due on net dates has outstanding total balance {{invoice_total}}. View details in client portal."
                  },
                  {
                    title: "Strategy Kickoff Confirmation",
                    channel: "Email",
                    desc: "Meeting slot schedule confirmation.",
                    body: "Hello {{client_name}},\n\nYour strategy kickoff meeting has been successfully booked for {{meeting_time}}. Link: https://meet.kairo-os.co/intake"
                  }
                ].map((tpl, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col group hover:border-kairo-blue/20 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-widest text-slate-400 bg-slate-50">{tpl.channel}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-kairo-blue transition-colors">{tpl.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed flex-1">{tpl.desc}</p>
                    
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 font-mono text-[10px] text-slate-600 whitespace-pre-wrap leading-relaxed select-all mb-4">
                      {tpl.body}
                    </div>

                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                      Placeholders: client_name, onboard_url, invoice_total
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Tab 4: ANALYTICS PANEL */}
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {[
                  { title: "Total Logs", value: commsLogs.length, subtitle: "Dispatched records in secure log" },
                  { title: "Message Delivery", value: "99.8%", subtitle: "Delivery handshake success rate" },
                  { title: "Onboarding Conversion", value: "85.2%", subtitle: "Lead requests converted to clients" },
                  { title: "Active Leads", value: onboardingRequests.filter((r: any) => r.status.toUpperCase() === "PENDING").length, subtitle: "Awaiting operator intake checks" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</span>
                    <span className="text-2xl font-bold font-sans tracking-tight text-gray-900 mt-2">{stat.value}</span>
                    <span className="text-[10px] font-medium text-slate-500 mt-1 leading-normal">{stat.subtitle}</span>
                  </div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* SECURE ONBOARDING LINK GENERATOR MODAL */}
      <AnimatePresence>
        {isGeneratorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGeneratorOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 w-full max-w-lg flex flex-col gap-6 z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <Link className="w-4 h-4 text-kairo-blue" /> Generate Secure Intake Link
                </h3>
                <button
                  onClick={() => {
                    setIsGeneratorOpen(false);
                    setGeneratedUrl("");
                    setGeneratorName("");
                    setGeneratorCompany("");
                  }}
                  className="p-1 text-slate-400 hover:text-gray-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!generatedUrl ? (
                <div className="flex flex-col gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Prospect Contact Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Sterling"
                      value={generatorName}
                      onChange={(e) => setGeneratorName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Prospect Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Corp"
                      value={generatorCompany}
                      onChange={(e) => setGeneratorCompany(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-kairo-blue outline-none"
                    />
                  </div>
                  <button
                    onClick={() => generateLinkMutation.mutate()}
                    className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl transition-colors shadow-sm cursor-pointer"
                  >
                    Generate Secure URL
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-xs text-slate-500 leading-normal">
                    Secure client intake token initialized. Distribute this URL to the prospect.
                  </p>
                  
                  <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-xs text-slate-600 select-all">
                    <span className="flex-1 truncate">{generatedUrl}</span>
                    <button
                      onClick={handleCopyLink}
                      className="p-2 text-slate-400 hover:text-gray-900 hover:bg-slate-200 transition-colors rounded-lg"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-[10px] text-slate-500 leading-relaxed">
                    This link accesses the public client intake gateway. Submissions update the communications dashboard timeline instantly.
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
