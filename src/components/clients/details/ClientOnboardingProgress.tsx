"use client";

import React from "react";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

const STAGES: any[] = [
  "Intake Form",
  "Assets Received",
  "Agreements Signed",
  "Kickoff Completed",
  "Fully Onboarded"
];

export const ClientOnboardingProgress: React.FC<{ client: any }> = ({ client }) => {
  const currentStageIndex = STAGES.indexOf(client.onboardingStage);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase">Onboarding Track</h3>
        <span className="text-xs font-bold text-kairo-blue">{client.onboardingProgress}%</span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-6">
        <div 
          className="bg-kairo-blue h-full rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${client.onboardingProgress}%` }} 
        />
      </div>

      <div className="flex flex-col gap-3">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx <= currentStageIndex && client.onboardingProgress === 100 ? true : idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex && client.onboardingProgress < 100;
          
          return (
            <div key={stage} className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${isCurrent ? 'bg-blue-50/50 border border-blue-100' : 'border border-transparent'}`}>
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : isCurrent ? (
                <div className="w-4 h-4 rounded-full border-2 border-kairo-blue shrink-0 animate-pulse" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 shrink-0" />
              )}
              
              <span className={`text-xs font-semibold uppercase tracking-widest ${
                isCompleted ? 'text-slate-400' : isCurrent ? 'text-kairo-blue' : 'text-slate-300'
              }`}>
                {stage}
              </span>
              
              {isCurrent && (
                <button className="ml-auto text-[10px] font-bold text-kairo-blue flex items-center gap-1 uppercase tracking-widest hover:text-blue-700 transition-colors">
                  Action <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
