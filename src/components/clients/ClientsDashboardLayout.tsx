"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/layouts/PageHeader";
import { Plus, Search, Filter } from "lucide-react";
import { ClientsTable } from "./ClientsTable";
import { ClientInsightsWidget } from "./ClientInsightsWidget";
import { ClientDetailWorkspace } from "./details/ClientDetailWorkspace";
import { ClientFormModal } from "./crud/ClientFormModal";

export const ClientsDashboardLayout: React.FC = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (selectedClientId) {
    return (
      <ClientDetailWorkspace 
        clientId={selectedClientId} 
        onBack={() => setSelectedClientId(null)} 
      />
    );
  }

  return (
    <>
      <PageHeader
        breadcrumbs={["Kairo OS", "CRM", "Clients Overview"]}
        title="Relationship Infrastructure"
        description="Executive management of active clients, onboarding processes, and historical relationships."
        action={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Client
          </button>
        }
      />

      <div className="flex flex-col gap-6">
        <ClientInsightsWidget />

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-slate-100 gap-4 bg-slate-50/50">
            <div className="relative w-full sm:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-kairo-blue transition-colors" />
              <input 
                type="text" 
                placeholder="Search clients by name, company, or tag..." 
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-kairo-blue focus:ring-2 focus:ring-kairo-blue/10 transition-all shadow-sm"
              />
            </div>
            
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors w-full sm:w-auto shadow-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>

          <ClientsTable onSelectClient={setSelectedClientId} />
        </div>
      </div>

      {isModalOpen && (
        <ClientFormModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};
