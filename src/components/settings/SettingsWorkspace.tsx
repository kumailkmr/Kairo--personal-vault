"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/layouts/PageHeader";
import { NotificationPreferences } from "./NotificationPreferences";
import { Settings, ShieldCheck, ToggleRight, ToggleLeft, Sliders, Palette, Zap, Sparkles, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const SettingsWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"system" | "personalization" | "security">("system");

  // Mock settings states
  const [focusMode, setFocusMode] = useState("Execution Mode");
  const [density, setDensity] = useState("Executive Spacious");
  const [realtime, setRealtime] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [animationIntensity, setAnimationIntensity] = useState("Standard Smooth");

  return (
    <>
      <PageHeader
        breadcrumbs={["Kairo OS", "System", "Settings"]}
        title="Workspace Preferences"
        description="Configure workspace identity, dynamic optimization nodes, system themes, and system triggers."
      />

      <div className="flex flex-col gap-6">
        
        {/* Navigation tabs */}
        <div className="flex items-center p-1.5 bg-white border border-slate-200 rounded-2xl w-full sm:w-fit shadow-sm overflow-x-auto hide-scrollbar">
           <button
             onClick={() => setActiveTab("system")}
             className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
               activeTab === "system" ? "bg-slate-50 text-kairo-blue shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
             }`}
           >
              <Settings className="w-3.5 h-3.5" /> System Settings
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
    </>
  );
};
