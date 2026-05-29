"use client";

import React, { useState, useEffect } from "react";
import { soundManager, SoundCategory } from "@/utils/SoundManager";
import { Volume2, VolumeX, ShieldCheck, Activity, BellRing, Cpu } from "lucide-react";

export const NotificationPreferences: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [categories, setCategories] = useState<Record<SoundCategory, boolean>>({
    operational: true,
    alert: true,
    message: true,
    system: true,
  });

  useEffect(() => {
    setEnabled(soundManager.isEnabled());
    setCategories(soundManager.getCategories());
  }, []);

  const handleToggleGlobal = () => {
    const newVal = !enabled;
    soundManager.setEnabled(newVal);
    setEnabled(newVal);
  };

  const handleToggleCategory = (cat: SoundCategory) => {
    const newVal = !categories[cat];
    soundManager.toggleCategory(cat, newVal);
    setCategories((prev) => ({ ...prev, [cat]: newVal }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-2xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-base font-heading font-bold text-gray-900">Audio Intelligence</h2>
          <p className="text-sm text-slate-500 mt-1">Configure subtle operational chimes and alert sounds.</p>
        </div>
        <button
          onClick={handleToggleGlobal}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
            enabled ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          {enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          {enabled ? "Sound Enabled" : "Silent Mode"}
        </button>
      </div>

      <div className={`flex flex-col gap-4 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <PreferenceRow 
          icon={<Activity className="w-4 h-4 text-kairo-blue" />}
          title="Operational Updates"
          description="Subtle pings for tasks, invoices, and milestones."
          enabled={categories.operational}
          onToggle={() => handleToggleCategory("operational")}
        />
        <PreferenceRow 
          icon={<BellRing className="w-4 h-4 text-orange-500" />}
          title="Critical Alerts"
          description="Distinctive chimes for deadlines and warnings."
          enabled={categories.alert}
          onToggle={() => handleToggleCategory("alert")}
        />
        <PreferenceRow 
          icon={<ShieldCheck className="w-4 h-4 text-slate-500" />}
          title="System Logs"
          description="Low-profile sounds for background syncs."
          enabled={categories.system}
          onToggle={() => handleToggleCategory("system")}
        />
        <PreferenceRow 
          icon={<Cpu className="w-4 h-4 text-purple-500" />}
          title="AI Signals"
          description="Audio feedback for AI agent operations."
          enabled={categories.message}
          onToggle={() => handleToggleCategory("message")}
        />
      </div>
    </div>
  );
};

const PreferenceRow: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}> = ({ icon, title, description, enabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm shrink-0 border border-slate-200">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      
      {/* Toggle Switch */}
      <button 
        onClick={onToggle}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          enabled ? "bg-kairo-blue" : "bg-slate-300"
        }`}
      >
        <span 
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};
