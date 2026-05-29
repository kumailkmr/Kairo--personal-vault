"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/layouts/PageHeader";
import { NotificationPreferences } from "./NotificationPreferences";
import { MOCK_PROJECT_REQUESTS, ProjectRequest, RequestStatus } from "@/mock/requests";
import { Settings, ShieldCheck, ToggleRight, ToggleLeft, Sliders, Palette, Zap, Sparkles, UserCheck, Inbox, Eye, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const SettingsWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"system" | "requests" | "personalization" | "security">("system");
  const [requests, setRequests] = useState<ProjectRequest[]>(MOCK_PROJECT_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);

  // Mock settings states
  const [focusMode, setFocusMode] = useState("Execution Mode");
  const [density, setDensity] = useState("Executive Spacious");
  const [realtime, setRealtime] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [animationIntensity, setAnimationIntensity] = useState("Standard Smooth");

  const updateRequestStatus = (id: string, newStatus: RequestStatus) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "Accepted": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Under Review": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Declined": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <>
      <PageHeader
        breadcrumbs={["Kairo OS", "System", "Settings"]}
        title="Workspace Preferences"
        description="Configure workspace identity, dynamic optimization nodes, system themes, and system triggers."
      />

      <div className="flex flex-col gap-6">
        
        {/* Navigation tabs */}
        <div className="flex items-center p-1.5 bg-white border border-slate-200 rounded-2xl w-full shadow-sm overflow-x-auto hide-scrollbar">
           <div className="flex items-center gap-1 min-w-max">
             <button
               onClick={() => setActiveTab("system")}
               className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                 activeTab === "system" ? "bg-slate-50 text-kairo-blue shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
               }`}
             >
                <Settings className="w-3.5 h-3.5" /> System Settings
             </button>
             <button
               onClick={() => setActiveTab("requests")}
               className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                 activeTab === "requests" ? "bg-slate-50 text-kairo-blue shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
               }`}
             >
                <Inbox className="w-3.5 h-3.5" /> Inbound Requests
             </button>
             <button
               onClick={() => setActiveTab("personalization")}
               className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                 activeTab === "personalization" ? "bg-slate-50 text-kairo-blue shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
               }`}
             >
                <Palette className="w-3.5 h-3.5" /> Theme & UI
             </button>
             <button
               onClick={() => setActiveTab("security")}
               className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
                 activeTab === "security" ? "bg-slate-50 text-kairo-blue shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
               }`}
             >
                <ShieldCheck className="w-3.5 h-3.5" /> Security & Access
             </button>
           </div>
        </div>

        {/* Display panels */}
        <div className="min-h-[500px]">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                 {activeTab === "system" && (
                    <>
                       {/* Left System Controls */}
                       <div className="lg:col-span-2 flex flex-col gap-6">
                          
                          {/* Personal OS Control Center */}
                          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
                             <div>
                                <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
                                   <UserCheck className="w-4 h-4 text-kairo-blue" /> Personal OS Control
                                </h3>
                                <p className="text-xs font-semibold text-slate-500 mt-1">Configure Focus blocks and workflow thresholds allocated for Kumail Kmr.</p>
                             </div>
                             
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                   <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Sliders className="w-3.5 h-3.5 text-kairo-blue" /> Operating focus Mode</label>
                                   <select 
                                     value={focusMode}
                                     onChange={(e) => setFocusMode(e.target.value)}
                                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors"
                                   >
                                      <option>Execution Mode (Deep Work)</option>
                                      <option>Creative planning Mode</option>
                                      <option>Relaxation & Sync Mode</option>
                                   </select>
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[10px] font-bold text-slate-500 uppercase">System Readiness</label>
                                   <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live & optimized
                                   </div>
                                </div>
                             </div>
                          </div>

                          {/* SMTP & Real-time Integrations toggles */}
                          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
                             <div>
                                <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase">System Automation Triggers</h3>
                                <p className="text-xs font-semibold text-slate-500 mt-1">Personalize system sensitivity options and background webhook synchronization.</p>
                             </div>
                             
                             <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                   <div>
                                      <h4 className="text-xs font-bold text-gray-900">Real-time Webhook Synchronization</h4>
                                      <p className="text-[10px] text-slate-500 mt-0.5">Stream pipeline state changes instantly across dashboards.</p>
                                   </div>
                                   <button onClick={() => setRealtime(!realtime)} className="text-slate-400 hover:text-gray-900 transition-colors">
                                      {realtime ? <ToggleRight className="w-8 h-8 text-kairo-blue" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                                   </button>
                                </div>
                                <div className="h-px bg-slate-100 w-full" />
                                <div className="flex items-center justify-between">
                                   <div>
                                      <h4 className="text-xs font-bold text-gray-900">AI Context Suggestions</h4>
                                      <p className="text-[10px] text-slate-500 mt-0.5">Populate executive brief notes automatically using client details.</p>
                                   </div>
                                   <button onClick={() => setAiSuggestions(!aiSuggestions)} className="text-slate-400 hover:text-gray-900 transition-colors">
                                      {aiSuggestions ? <ToggleRight className="w-8 h-8 text-kairo-blue" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                                   </button>
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* Right Column: Notification Panel */}
                       <div className="lg:col-span-1">
                          <NotificationPreferences />
                       </div>
                    </>
                 )}

                 {activeTab === "requests" && (
                    <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                       <div className="p-6 border-b border-slate-100">
                          <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase">Project Requests Pipeline</h3>
                          <p className="text-xs font-semibold text-slate-500 mt-1">Review similar project requests submitted by visitors via public workspace gateways.</p>
                       </div>

                       <div className="w-full overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                             <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80">
                                   <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inquirer</th>
                                   <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Project Type</th>
                                   <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Budget</th>
                                   <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                   <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                   <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100 bg-white">
                                {requests.map(req => (
                                   <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedRequest(req)}>
                                      <td className="px-6 py-4">
                                         <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900 group-hover:text-kairo-blue transition-colors">{req.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{req.company}</span>
                                         </div>
                                      </td>
                                      <td className="px-6 py-4 text-xs font-bold text-slate-600">{req.projectType}</td>
                                      <td className="px-6 py-4 text-xs font-bold text-slate-500">{req.budgetRange}</td>
                                      <td className="px-6 py-4 text-xs font-semibold text-slate-500">{req.date}</td>
                                      <td className="px-6 py-4">
                                         <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${getStatusColor(req.status)}`}>
                                            {req.status}
                                         </span>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                         <button 
                                           onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}
                                           className="p-2 rounded-lg text-slate-400 hover:text-kairo-blue hover:bg-blue-50 transition-colors"
                                         >
                                            <Eye className="w-4 h-4" />
                                         </button>
                                      </td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 )}

                 {activeTab === "personalization" && (
                    <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
                       <div>
                          <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
                             <Palette className="w-4 h-4 text-kairo-blue" /> Visual Personalization
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 mt-1">Configure layout densities, spacing multipliers, and motion pacing across all workspace shells.</p>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-500 uppercase">Layout spacing density</label>
                             <select 
                               value={density}
                               onChange={(e) => setDensity(e.target.value)}
                               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors"
                             >
                                <option>Executive Spacious (Refined padding)</option>
                                <option>Compact (High analytical density)</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-500 uppercase">Animation Velocity</label>
                             <select 
                               value={animationIntensity}
                               onChange={(e) => setAnimationIntensity(e.target.value)}
                               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors"
                             >
                                <option>Standard Smooth (Cubic-bezier active)</option>
                                <option>Instant (Low performance load)</option>
                             </select>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === "security" && (
                    <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
                       <div>
                          <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
                             <ShieldCheck className="w-4 h-4 text-emerald-500" /> Operational Encryption Gateways
                          </h3>
                          <p className="text-xs font-semibold text-slate-500 mt-1">Monitor zero-trust developer access keys and local security indicators.</p>
                       </div>
                       <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                             <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest">End-to-End local key Vault live</h4>
                             <p className="text-xs text-emerald-600 mt-1 leading-relaxed">No external tokens or security parameters are saved on servers. Everything resides strictly in local browser databases.</p>
                          </div>
                       </div>
                    </div>
                 )}
              </motion.div>
           </AnimatePresence>
        </div>
      </div>

      {/* Request details modal */}
      {selectedRequest && (
         <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                 onClick={() => setSelectedRequest(null)}
               />
               
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 10 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95, y: 10 }}
                 transition={{ type: "spring", damping: 25, stiffness: 300 }}
                 className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col z-10"
               >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 bg-white border-b border-slate-100">
                     <div>
                        <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase">Request Auditing</h3>
                        <p className="text-xs text-slate-500 mt-1">{selectedRequest.name} • {selectedRequest.company}</p>
                     </div>
                     <button onClick={() => setSelectedRequest(null)} className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
                        <X className="w-4 h-4" />
                     </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Project Type</span>
                           <span className="text-xs font-bold text-gray-900 mt-1 block">{selectedRequest.projectType}</span>
                        </div>
                        <div>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Budget Range</span>
                           <span className="text-xs font-bold text-gray-900 mt-1 block">{selectedRequest.budgetRange}</span>
                        </div>
                     </div>

                     <div className="h-px bg-slate-100 w-full" />

                     <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Contact Details</span>
                        <div className="flex flex-col gap-1 mt-1.5">
                           <span className="text-xs font-medium text-slate-700">{selectedRequest.email}</span>
                           <span className="text-xs font-medium text-slate-700 flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-500" /> {selectedRequest.phone}</span>
                        </div>
                     </div>

                     <div className="h-px bg-slate-100 w-full" />

                     <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Project Goals</span>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans mt-1">"{selectedRequest.goals}"</p>
                     </div>

                     {selectedRequest.notes && (
                        <>
                           <div className="h-px bg-slate-100 w-full" />
                           <div>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Additional Notes</span>
                              <p className="text-xs text-slate-600 leading-relaxed font-sans mt-1">"{selectedRequest.notes}"</p>
                           </div>
                        </>
                     )}
                  </div>

                  {/* Modal Footer Controls */}
                  <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end gap-3">
                     {selectedRequest.status !== "Accepted" && (
                        <button 
                          onClick={() => updateRequestStatus(selectedRequest.id, "Accepted")}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm"
                        >
                           Accept Request
                        </button>
                     )}
                     {selectedRequest.status !== "Under Review" && selectedRequest.status !== "Accepted" && (
                        <button 
                          onClick={() => updateRequestStatus(selectedRequest.id, "Under Review")}
                          className="px-4 py-2 bg-slate-200 hover:bg-slate-350 text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors"
                        >
                           Under Review
                        </button>
                     )}
                     {selectedRequest.status !== "Declined" && (
                        <button 
                          onClick={() => updateRequestStatus(selectedRequest.id, "Declined")}
                          className="px-4 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors"
                        >
                           Decline
                        </button>
                     )}
                  </div>
               </motion.div>
            </div>
         </AnimatePresence>
      )}
    </>
  );
};
