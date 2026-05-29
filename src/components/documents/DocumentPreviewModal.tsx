"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Download, Printer, History, PenTool, ExternalLink, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { documentService, KairoDocument } from "@/services/document.service";

export const DocumentPreviewModal: React.FC<{ documentId: string; onClose: () => void }> = ({ documentId, onClose }) => {
  const [downloading, setDownloading] = useState(false);

  // A. FETCH LATEST CACHED DOCUMENTS ROSTER
  const { data: documents = [] } = useQuery<KairoDocument[]>({
    queryKey: ["documents"],
    queryFn: () => documentService.getDocuments(),
    enabled: !!documentId
  });

  const doc = documents.find(d => d.id === documentId);

  if (!doc) return null;

  // B. DOWNLOAD HANDLER (SECURE SIGNED STORAGE URL HANDSHAKE)
  const handleDownload = async () => {
    try {
      setDownloading(true);
      const url = await documentService.getDownloadUrl(doc.filePath);
      const anchor = window.document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank";
      anchor.download = doc.fileName;
      window.document.body.appendChild(anchor);
      anchor.click();
      window.document.body.removeChild(anchor);
    } catch (err) {
      console.error("Failed to generate download handshake:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${doc.fileName}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
            h1, h2, h3 { color: #0f172a; margin-top: 1.5em; }
            hr { border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
            .logo { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase; }
            .footer { margin-top: 60px; display: flex; justify-content: space-between; }
            .sig-line { width: 200px; border-bottom: 1px solid #0f172a; padding-bottom: 8px; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">Kairo OS</div>
              <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-top: 2px;">Executive Document Engine</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 12px; font-weight: bold; text-transform: uppercase;">${doc.docType}</div>
              <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Billed To: ${doc.clientName}</div>
            </div>
          </div>
          <div>
            ${doc.content || `
              <h2>${doc.fileName.replace(/\.pdf$/, "")}</h2>
              <p>This document has been fully registered and archived within Kairo's operational vault. Secure ledger reference hash is active.</p>
              <hr />
              <h3>Ledger Specifications</h3>
              <ul>
                <li><strong>UUID Ref:</strong> ${doc.id}</li>
                <li><strong>Status:</strong> ${doc.status}</li>
                <li><strong>Category:</strong> ${doc.docType}</li>
                <li><strong>Storage URI:</strong> ${doc.filePath}</li>
                <li><strong>Integrity Checksum:</strong> ${doc.fileHash || "VERIFIED"}</li>
              </ul>
            `}
          </div>
          <div class="footer">
            <div>
              <div class="sig-line">Kumail Kmr</div>
              <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-top: 4px;">Provider Signature</div>
            </div>
            <div>
              <div class="sig-line" style="color: #cbd5e1;">Pending Client Sign</div>
              <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-top: 4px;">Client Signature</div>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl h-full max-h-[90vh] bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-10">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-heading font-bold text-gray-900">{doc.fileName.replace(/\.pdf$/, "")}</h2>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-lg border ${
                doc.status === 'Signed' || doc.status === 'Completed' || doc.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {doc.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrint}
                className="p-2 rounded-xl text-slate-400 hover:text-gray-900 hover:bg-slate-100 transition-colors hidden sm:block"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button 
                disabled={downloading}
                onClick={handleDownload}
                className="p-2 rounded-xl text-slate-400 hover:text-gray-900 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-kairo-blue" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
              
              <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />
              
              {doc.status === "DRAFT" || doc.status === "SENT" ? (
                 <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-kairo-blue hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm">
                   <PenTool className="w-3.5 h-3.5" /> Request Signature
                 </button>
              ) : (
                 <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm">
                   <ExternalLink className="w-3.5 h-3.5" /> View Audit Trail
                 </button>
              )}

              <button onClick={onClose} className="p-2 ml-2 rounded-full hover:bg-slate-200 transition-colors text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Document Preview Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex justify-center bg-slate-200/50">
            {/* The Page */}
            <div className="w-full max-w-[800px] min-h-[1100px] bg-white shadow-lg border border-slate-200 p-12 sm:p-16 relative flex flex-col justify-between">
               
               <div>
                 {/* Styled Branded Header */}
                 <div className="border-b-2 border-gray-900 pb-6 mb-12 flex justify-between items-end">
                   <div>
                     <h1 className="text-3xl font-heading font-black text-gray-900 tracking-tight uppercase">Kairo OS</h1>
                     <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Executive Operations</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">{doc.docType}</p>
                     <p className="text-xs text-slate-500 mt-1">{doc.clientName}</p>
                   </div>
                 </div>

                 {/* Compiled Custom HTML Body */}
                 {doc.content ? (
                   <div 
                     className="prose prose-slate max-w-none text-sm text-gray-800 space-y-4"
                     dangerouslySetInnerHTML={{ __html: doc.content }}
                   />
                 ) : (
                   /* Fallback Standard Layout */
                   <div className="space-y-6">
                     <h3 className="text-xl font-bold text-gray-900">1. Operational Overview</h3>
                     <p className="text-sm text-gray-600 leading-relaxed">
                       This executive legal brief formally documents the strategic service engagement between Kairo OS and {doc.clientName}. 
                       All digital operational protocols, security configurations, and database integrations comply strictly with our 
                       Enterprise Operations Framework.
                     </p>

                     <h3 className="text-xl font-bold text-gray-900 mt-8">2. Standard Ledger Integrity</h3>
                     <table className="w-full text-left text-xs border-collapse mt-4">
                       <tbody>
                         <tr className="border-b border-slate-100">
                           <td className="py-2 font-bold text-slate-500">Document UUID</td>
                           <td className="py-2 text-gray-900 font-mono">{doc.id}</td>
                         </tr>
                         <tr className="border-b border-slate-100">
                           <td className="py-2 font-bold text-slate-500">Category</td>
                           <td className="py-2 text-gray-900">{doc.docType}</td>
                         </tr>
                         <tr className="border-b border-slate-100">
                           <td className="py-2 font-bold text-slate-500">Storage Location</td>
                           <td className="py-2 text-gray-900 font-mono">{doc.filePath}</td>
                         </tr>
                         <tr className="border-b border-slate-100">
                           <td className="py-2 font-bold text-slate-500">Document Status</td>
                           <td className="py-2 text-gray-900 font-semibold">{doc.status}</td>
                         </tr>
                       </tbody>
                     </table>
                   </div>
                 )}
               </div>

               {/* Signatures */}
               <div className="flex justify-between items-end mt-20 pt-8 border-t border-slate-100">
                 <div className="w-48">
                   <div className="h-16 border-b border-gray-900 flex items-end pb-2">
                     <span className="font-serif text-3xl text-kairo-blue -rotate-3 select-none">Kumail Kmr</span>
                   </div>
                   <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mt-2">Provider Signature</p>
                 </div>
                 <div className="w-48">
                   <div className="h-16 border-b border-gray-900 flex items-end pb-2">
                     {doc.status === "Signed" || doc.status === "Completed" || doc.status === "ACTIVE" ? (
                       <span className="font-serif text-2xl text-slate-800 -rotate-2 select-none">Client Authorized</span>
                     ) : (
                       <span className="text-xs text-slate-300 font-semibold uppercase italic pb-1 select-none">Pending Authorized Signature</span>
                     )}
                   </div>
                   <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mt-2">Client Signature</p>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
