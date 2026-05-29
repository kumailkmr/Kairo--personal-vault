"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/layouts/PageHeader";
import { FileText, LayoutTemplate, Plus, Search, Filter, PenTool, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Sub-components
import { DocumentCenterDashboard } from "./DocumentCenterDashboard";
import { TemplateLibrary } from "./TemplateLibrary";
import { DocumentGeneratorWorkspace } from "./builder/DocumentGeneratorWorkspace";
import { AutomationFlowBuilder } from "./automation/AutomationFlowBuilder";

export type DocWorkspaceState = "dashboard" | "templates" | "builder" | "automation";

export const DocumentsWorkspaceLayout: React.FC = () => {
  const [workspaceState, setWorkspaceState] = useState<DocWorkspaceState>("dashboard");
  const [activeBuilderTemplate, setActiveBuilderTemplate] = useState<string | null>(null);

  const startBuilder = (templateId: string | null = null) => {
    setActiveBuilderTemplate(templateId);
    setWorkspaceState("builder");
  };

  const closeBuilder = () => {
    setActiveBuilderTemplate(null);
    setWorkspaceState("dashboard");
  };

  if (workspaceState === "builder") {
    return (
      <DocumentGeneratorWorkspace 
        templateId={activeBuilderTemplate} 
        onClose={closeBuilder} 
      />
    );
  }

  return (
    <>
      <PageHeader
        breadcrumbs={["Kairo OS", "Operations", "Documents Engine"]}
        title="Executive Legal & Intelligence"
        description="Premium document generation, contract management, and automated workflows."
        action={
          <button 
            onClick={() => startBuilder()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Generate Doc
          </button>
        }
      />

      <div className="flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex items-center p-1 bg-white border border-slate-200 rounded-2xl w-full sm:w-fit shadow-sm overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setWorkspaceState("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider ${
              workspaceState === "dashboard" ? "bg-slate-50 text-gray-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
            }`}
          >
            <FileText className="w-4 h-4" /> Library
          </button>
          <button
            onClick={() => setWorkspaceState("templates")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider ${
              workspaceState === "templates" ? "bg-slate-50 text-gray-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
            }`}
          >
            <LayoutTemplate className="w-4 h-4" /> Templates
          </button>
          <button
            onClick={() => setWorkspaceState("automation")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors uppercase tracking-wider ${
              workspaceState === "automation" ? "bg-slate-50 text-gray-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-gray-900"
            }`}
          >
            <Zap className="w-4 h-4" /> Automations
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={workspaceState}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {workspaceState === "dashboard" && <DocumentCenterDashboard onGenerate={startBuilder} />}
              {workspaceState === "templates" && <TemplateLibrary onSelectTemplate={startBuilder} />}
              {workspaceState === "automation" && <AutomationFlowBuilder />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
