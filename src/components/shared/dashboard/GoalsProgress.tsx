import React from "react";
import { Target, ArrowRight } from "lucide-react";
import { MOCK_GOALS } from "@/mock";

export const GoalsProgress: React.FC = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-purple-500" /> Strategic Objectives
        </h3>
      </div>
      
      <div className="flex flex-col gap-5">
        {MOCK_GOALS.slice(0, 2).map((goal) => (
          <div key={goal.id} className="group cursor-pointer">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">{goal.title}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{goal.targetDate}</p>
              </div>
              <span className="text-xs font-bold text-gray-900">{goal.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-900 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${goal.progress}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-5 py-2 text-[10px] font-bold text-slate-400 hover:text-gray-900 uppercase tracking-widest flex items-center justify-center gap-1 transition-colors">
        View Roadmap <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
