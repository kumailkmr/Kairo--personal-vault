"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Activity, DollarSign, Calendar, AlertCircle } from "lucide-react";
import { soundManager, SoundCategory } from "@/utils/SoundManager";
import { useToast } from "@/providers/ToastProvider";

export function SoundSettingsPanel() {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [categories, setCategories] = useState<Record<SoundCategory, boolean>>({
    operational: true,
    alert: true,
    message: true,
    system: true
  });
  const { toast } = useToast();

  useEffect(() => {
    setEnabled(soundManager.isEnabled());
    setVolume(soundManager.getVolume());
    setCategories(soundManager.getCategories());
  }, []);

  const handleToggleGlobal = () => {
    const next = !enabled;
    setEnabled(next);
    soundManager.setEnabled(next);
    
    if (next) {
      toast({
        title: "Sound Enabled",
        description: "Executive audio feedback activated.",
        type: "system"
      });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundManager.setVolume(val);
  };

  const handleToggleCategory = (cat: SoundCategory) => {
    const next = !categories[cat];
    setCategories(prev => ({ ...prev, [cat]: next }));
    soundManager.toggleCategory(cat, next);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6 mt-6">
      <div>
        <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
          {enabled ? <Volume2 className="w-4 h-4 text-kairo-blue" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          Executive Audio Profile
        </h3>
        <p className="text-xs font-semibold text-slate-500 mt-1">Manage synthesized audio feedback and system alerts.</p>
      </div>

      {/* Global Toggle & Volume */}
      <div className="flex flex-col gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-900">Master Audio</span>
          <button 
            onClick={handleToggleGlobal}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${enabled ? 'bg-kairo-blue' : 'bg-slate-300'}`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-4.5' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className={`flex flex-col gap-2 transition-opacity ${enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Volume level</span>
            <span className="text-[10px] font-bold text-kairo-blue">{Math.round(volume * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="1" step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-kairo-blue h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Categories */}
      <div className={`flex flex-col gap-3 transition-opacity ${enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Feedback Channels</h4>
        
        <CategoryToggle 
          icon={<DollarSign className="w-3.5 h-3.5 text-emerald-500" />}
          title="Revenue & Operations"
          active={categories.operational}
          onToggle={() => handleToggleCategory('operational')}
        />
        
        <CategoryToggle 
          icon={<AlertCircle className="w-3.5 h-3.5 text-red-500" />}
          title="Critical Alerts"
          active={categories.alert}
          onToggle={() => handleToggleCategory('alert')}
        />

        <CategoryToggle 
          icon={<Calendar className="w-3.5 h-3.5 text-amber-500" />}
          title="Meetings & Deadlines"
          active={categories.message}
          onToggle={() => handleToggleCategory('message')}
        />

        <CategoryToggle 
          icon={<Activity className="w-3.5 h-3.5 text-slate-500" />}
          title="System Sync & Activity"
          active={categories.system}
          onToggle={() => handleToggleCategory('system')}
        />
      </div>
    </div>
  );
}

function CategoryToggle({ icon, title, active, onToggle }: { icon: React.ReactNode, title: string, active: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={onToggle}>
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg ${active ? 'bg-white shadow-sm' : 'bg-slate-100 opacity-50'}`}>
          {icon}
        </div>
        <span className={`text-xs font-semibold ${active ? 'text-gray-900' : 'text-slate-400'}`}>{title}</span>
      </div>
      <div className={`w-3 h-3 rounded-full border-2 ${active ? 'border-kairo-blue bg-kairo-blue shadow-sm' : 'border-slate-300'}`} />
    </div>
  );
}
