"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { documentService, KairoDocument } from "@/services/document.service";
import { Search, Filter, MoreHorizontal, Download, Eye, FileText, CheckCircle, Clock, Loader2 } from "lucide-react";
import { DocumentPreviewModal } from "./DocumentPreviewModal";

export const DocumentCenterDashboard: React.FC<{ onGenerate: () => void }> = ({ onGenerate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [previewDocId, setPreviewDocId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // A. FETCH DYNAMIC DOCUMENTS VIA TANSTACK QUERY
  const { data: documents = [], isLoading, error } = useQuery<KairoDocument[]>({
    queryKey: ["documents"],
    queryFn: () => documentService.getDocuments(),
    refetchOnWindowFocus: false
  });

  // B. BIND SUPABASE REALTIME AUTO-INVALIDATION LOOP
  useRealtimeSync("documents", ["documents"]);

  const getStatusStyle = (status: string) => {
    const s = status.toUpperCase();
    switch(s) {
      case "SIGNED":
      case "COMPLETED":
      case "APPROVED":
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "IN REVIEW":
      case "IN_REVIEW":
      case "SENT":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "DRAFT":
        return "bg-orange-50 text-orange-600 border-orange-100";
      case "VOID":
      case "ARCHIVED":
      default:
        return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  // C. DOWNLOAD HANDLER (SECURE SIGNED STORAGE URL HANDSHAKE)
  const handleDownload = async (e: React.MouseEvent, doc: KairoDocument) => {
    e.stopPropagation();
    try {
      setDownloadingId(doc.id);
      const signedUrl = await documentService.getDownloadUrl(doc.filePath);
      
      // Safe dynamic anchor creation for clean prints downloads
      const anchor = window.document.createElement("a");
      anchor.href = signedUrl;
      anchor.target = "_blank";
      anchor.download = doc.fileName;
      window.document.body.appendChild(anchor);
      anchor.click();
      window.document.body.removeChild(anchor);
    } catch (err) {
      console.error("Failed to fetch download link:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  // D. SEARCH AND CATEGORY FILTERING logic
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.docType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "ALL" || doc.docType.toUpperCase() === selectedType;

    return matchesSearch && matchesType;
  });

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 placeholder:text-slate-400 focus:outline-none focus:border-kairo-blue focus:ring-2 focus:ring-kairo-blue/10 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl px-4 py-2.5 outline-none focus:border-kairo-blue shadow-sm"
            >
              <option value="ALL">All Types</option>
              <option value="PROPOSAL">Proposals</option>
              <option value="CONTRACT">Contracts</option>
              <option value="NDA">NDAs</option>
              <option value="SOW">SOWs</option>
              <option value="INVOICE">Invoices</option>
              <option value="ONBOARDING">Onboarding</option>
            </select>
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-kairo-blue" />
            <span className="text-xs font-bold uppercase tracking-widest">Accessing Document Vault...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 font-medium">
            Error loading legal files: {(error as Error).message}
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">No Documents Found</h4>
            <p className="text-xs font-medium text-slate-500 max-w-sm">No files matched your active filters or there are no stored agreements yet.</p>
            <button 
              onClick={onGenerate}
              className="mt-4 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm"
            >
              Generate First Document
            </button>
          </div>
        ) : (
          /* Documents Table */
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Document</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Client</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Created At</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredDocs.map((doc) => (
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
                          <span className="text-sm font-bold text-gray-900 group-hover:text-kairo-blue transition-colors">
                            {doc.fileName.replace(/\.pdf$/, "")}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{doc.docType}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {doc.clientName}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${getStatusStyle(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Clock className="w-3.5 h-3.5" /> {new Date(doc.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
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
                          disabled={downloadingId === doc.id}
                          onClick={(e) => handleDownload(e, doc)}
                          className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        >
                          {downloadingId === doc.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
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
        )}
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
