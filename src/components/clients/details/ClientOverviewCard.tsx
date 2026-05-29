"use client";

import React from "react";
import { Mail, Phone, Globe, Tag } from "lucide-react";
import { CRMClient } from "@/mock/clients";

export const ClientOverviewCard: React.FC<{ client: CRMClient }> = ({ client }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        
        {/* Contact Info */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <div className="p-1.5 bg-slate-50 rounded-lg"><Mail className="w-4 h-4 text-slate-400" /></div>
            {client.email}
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <div className="p-1.5 bg-slate-50 rounded-lg"><Phone className="w-4 h-4 text-slate-400" /></div>
            {client.phone}
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <div className="p-1.5 bg-slate-50 rounded-lg"><Globe className="w-4 h-4 text-slate-400" /></div>
            www.{client.company.toLowerCase().replace(/\s+/g, '')}.com
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Generated Rev</div>
            <div className="text-lg font-bold text-gray-900">${client.revenue.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Projects</div>
            <div className="text-lg font-bold text-gray-900">{client.projectsCount}</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">
            <Tag className="w-3 h-3" /> Tags:
          </div>
          {client.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-200">
              {tag}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};
