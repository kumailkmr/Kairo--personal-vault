"use client";

import React from "react";
import { MoreHorizontal, ArrowRight } from "lucide-react";
import { MOCK_CRM_CLIENTS, CRMClient } from "@/mock/clients";

export const ClientsTable: React.FC<{ onSelectClient: (id: string) => void }> = ({ onSelectClient }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Client & Company</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Revenue</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next Follow-up</th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {MOCK_CRM_CLIENTS.map((client) => (
            <tr 
              key={client.id} 
              onClick={() => onSelectClient(client.id)}
              className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 group-hover:text-kairo-blue transition-colors">{client.name}</span>
                  <span className="text-xs font-medium text-slate-500 mt-0.5">{client.company}</span>
                </div>
              </td>
              
              <td className="px-6 py-4">
                <div className="flex flex-col items-start gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    client.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    client.status === 'Pending Onboarding' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                    'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {client.status}
                  </span>
                  {client.status === 'Pending Onboarding' && (
                    <span className="text-[10px] font-semibold text-slate-400">{client.onboardingStage}</span>
                  )}
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="text-sm font-semibold text-gray-900 font-sans tracking-tight">
                  ${client.revenue.toLocaleString()}
                </div>
                <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                  {client.projectsCount} Project{client.projectsCount !== 1 && 's'}
                </div>
              </td>

              <td className="px-6 py-4">
                <span className="text-xs font-medium text-slate-600">
                  {client.nextFollowUp || <span className="text-slate-300 italic">None Scheduled</span>}
                </span>
              </td>

              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button className="p-2 rounded-lg text-slate-400 hover:text-gray-900 hover:bg-slate-200 transition-colors" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-kairo-blue hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
