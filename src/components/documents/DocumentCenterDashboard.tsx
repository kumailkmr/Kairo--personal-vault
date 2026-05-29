"use client";

import React, { useState } from "react";
import { MOCK_DOCUMENTS, DocStatus } from "@/mock/documents";
import { Search, Filter, MoreHorizontal, Download, Eye, FileText, CheckCircle, Clock } from "lucide-react";
import { DocumentPreviewModal } from "./DocumentPreviewModal";

export const DocumentCenterDashboard: React.FC<{ onGenerate: () => void }> = ({ onGenerate }) => {
  const [previewDocId, setPreviewDocId] = useState<string | null>(null);

  const getStatusStyle = (status: DocStatus) => {
    switch(status) {
      case "Signed":
      case "Completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "In Review":
      case "Sent":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Draft":
        return "bg-orange-50 text-orange-600 border-orange-100";
      default:
        return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-slate-100 gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-kairo-blue transition-colors" />
            <input 
              type="text" 
              placeholder="Search documents by title, client, or type..." 
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-kairo-blue focus:ring-2 focus:ring-kairo-blue/10 transition-all shadow-sm"
            />
          </div>
          
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors w-full sm:w-auto shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Documents Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Document</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Client</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Edited</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {MOCK_DOCUMENTS.map((doc) => (
                <tr 
                  key={doc.id} 
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => setPreviewDocId(doc.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 group-hover:text-kairo-blue transition-colors">{doc.title}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{doc.type}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {doc.client}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${getStatusStyle(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Clock className="w-3.5 h-3.5" /> {doc.lastEdited}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setPreviewDocId(doc.id); }}
                        className="p-2 rounded-lg text-slate-400 hover:text-kairo-blue hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-2 rounded-lg text-slate-400 hover:text-gray-900 hover:bg-slate-200 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {previewDocId && (
        <DocumentPreviewModal 
          documentId={previewDocId} 
          onClose={() => setPreviewDocId(null)} 
        />
      )}
    </>
  );
};
