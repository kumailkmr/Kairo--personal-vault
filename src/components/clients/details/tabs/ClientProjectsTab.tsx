"use client";

import React from "react";
import { MOCK_CLIENT_PROJECTS } from "@/mock/clients";
import { motion } from "framer-motion";
import { LayoutGrid, Clock, CheckCircle } from "lucide-react";

export const ClientProjectsTab: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {MOCK_CLIENT_PROJECTS.map((project, idx) => (
        <motion.div 
          key={project.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm group hover:border-kairo-blue/30 transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2 rounded-xl ${
              project.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' :
              project.status === 'Active' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
            }`}>
              {project.status === 'Completed' ? <CheckCircle className="w-5 h-5" /> :
               project.status === 'Active' ? <LayoutGrid className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              {project.status}
            </span>
          </div>

          <h4 className="text-lg font-heading font-bold text-gray-900 mb-2 group-hover:text-kairo-blue transition-colors">
            {project.name}
          </h4>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
            Due: {project.dueDate}
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500">Progress</span>
              <span className="text-gray-900">{project.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  project.progress === 100 ? 'bg-emerald-500' : 'bg-kairo-blue'
                }`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
