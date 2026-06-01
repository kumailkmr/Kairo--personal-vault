"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Send, Save, Download, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { dbService } from "@/services/db.service";
import { documentService } from "@/services/document.service";
import { ProposalBuilder } from "./ProposalBuilder";
import { InvoiceBuilder } from "./InvoiceBuilder";
import { ContractBuilder } from "./ContractBuilder";
import { proposalSchema, contractSchema, invoiceSchema } from "@/schemas";

interface WorkspaceProps {
  templateId: string | null;
  onClose: () => void;
}

export const DocumentGeneratorWorkspace: React.FC<WorkspaceProps> = ({ templateId, onClose }) => {
  const queryClient = useQueryClient();
  const template = ([] as any[]).find((t: any) => t.id === templateId);
  const docType = template?.category || "Proposal"; // Fallback to Proposal if generating from scratch

  // A. RETRIEVE GLOBAL RELATIONSHIPS FROM THE CRM AND PROJECTS DATABASES
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => dbService.getClients()
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => dbService.getProjects()
  });

  // B. MASTER BUILDER GENERATOR STATE
  const [clientId, setClientId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [summary, setSummary] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>(["Core Digital Operations Integration", "Supabase Synchronizer Setup"]);
  const [price, setPrice] = useState<number>(5000);
  
  // Contracts state
  const [governingLaw, setGoverningLaw] = useState("Delaware");
  const [confidentialityPeriod, setConfidentialityPeriod] = useState("5 years");
  const [clauses, setClauses] = useState<string[]>([
    "Confidentiality Obligations",
    "Term and Termination Protocols",
    "Intellectual Property Covenants",
    "Limitation of Liability Caps",
    "Governing Law Standards"
  ]);

  // Invoice state
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-4)}`);
  const [tax, setTax] = useState<number>(0);
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [invoiceItems, setInvoiceItems] = useState<Array<{ description: string; quantity: number; unitPrice: number }>>([
    { description: "Phase 1 Execution & Architecture Delivery", quantity: 1, unitPrice: 5000 }
  ]);

  // Set default client once roster loads
  useEffect(() => {
    if (clients.length > 0 && !clientId) {
      setClientId(clients[0].id);
    }
  }, [clients, clientId]);

  const activeClient = clients.find(c => c.id === clientId) || { name: "Marcus Aurelius", company: "Stoic Investments" };

  // C. DYNAMIC COMPILED PREVIEW COMPILER
  const getCompiledContent = () => {
    let rawContent = "";
    if (docType === "Proposal") {
      rawContent = `
        <h2 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">1. Operational Overview</h2>
        <p style="color: #334155;">This document represents the strategic operational proposal for <strong>{{project_name}}</strong>, drafted specifically for <strong>{{company_name}}</strong> (Rep: {{client_name}}).</p>
        
        <h3 style="color: #0f172a; margin-top: 24px;">Executive Scope & Goals</h3>
        <p style="color: #334155;">{{project_scope}}</p>

        <h3 style="color: #0f172a; margin-top: 24px;">Core Deliverables</h3>
        <ul style="color: #334155; padding-left: 20px; line-height: 1.6;">
          ${deliverables.map(d => `<li><span style="color: #10b981; font-weight: bold; margin-right: 8px;">✔</span>${d}</li>`).join("")}
        </ul>

        <h3 style="color: #0f172a; margin-top: 28px; border-top: 1px solid #e2e8f0; padding-top: 16px;">2. Pricing & Structure</h3>
        <p style="color: #334155; font-size: 16px;">The total financial projection for the scope detailed above is calculated at <strong>{{price}}</strong>. Billing milestones will follow standard operational cycles.</p>
        
        <div style="margin-top: 40px; padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h4 style="color: #0f172a; margin-top: 0; margin-bottom: 8px;">Signatures & Authorizations</h4>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 16px;">By signing below, the parties execute this strategic services proposal.</p>
          {{signature}}
        </div>
      `;
    } else if (docType === "Invoice") {
      const subtotal = invoiceItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
      const grandTotal = subtotal + tax;

      rawContent = `
        <h2 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Billing Summary</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left;">
              <th style="padding: 10px; color: #475569;">Description</th>
              <th style="padding: 10px; color: #475569; text-align: center;">Qty</th>
              <th style="padding: 10px; color: #475569; text-align: right;">Unit Price</th>
              <th style="padding: 10px; color: #475569; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceItems.map(item => `
              <tr style="border-b: 1px solid #f1f5f9;">
                <td style="padding: 12px 10px; color: #334155;">${item.description}</td>
                <td style="padding: 12px 10px; color: #334155; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px 10px; color: #334155; text-align: right;">$${item.unitPrice.toLocaleString()}</td>
                <td style="padding: 12px 10px; color: #334155; text-align: right; font-weight: bold;">$${(item.quantity * item.unitPrice).toLocaleString()}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div style="margin-top: 30px; border-top: 2px solid #e2e8f0; padding-top: 16px; display: flex; flex-direction: column; align-items: flex-end; font-size: 14px;">
          <div style="display: flex; justify-content: space-between; width: 250px; margin-bottom: 8px;">
            <span style="color: #64748b;">Subtotal:</span>
            <span style="font-weight: bold; color: #1e293b;">$${subtotal.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; width: 250px; margin-bottom: 8px;">
            <span style="color: #64748b;">Tax Operations:</span>
            <span style="font-weight: bold; color: #1e293b;">$${tax.toLocaleString()}</span>
          </div>
          <hr style="width: 250px; border: 0; border-top: 1px solid #cbd5e1; margin: 8px 0;" />
          <div style="display: flex; justify-content: space-between; width: 250px; font-size: 18px;">
            <span style="color: #0f172a; font-weight: bold;">Grand Total:</span>
            <span style="font-weight: 900; color: #10b981;">$${grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <div style="margin-top: 40px; padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          <h4 style="color: #0f172a; margin-top: 0; margin-bottom: 6px;">Payment Instructions</h4>
          <p style="margin: 0 0 12px 0;">Please remit payment within the net cycles. Standard transaction protocols apply.</p>
          {{signature}}
        </div>
      `;
    } else {
      // Contracts / NDAs
      rawContent = `
        <h2 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Master Service Agreement</h2>
        <p style="color: #334155;">This document represents a binding legal covenant between <strong>Kairo OS LLC</strong> ("Provider") and <strong>{{company_name}}</strong> ("Second Party").</p>

        <h3 style="color: #0f172a; margin-top: 24px;">Core covenants</h3>
        <ol style="color: #334155; padding-left: 20px; line-height: 1.8;">
          ${clauses.map((c, idx) => `
            <li style="margin-bottom: 12px;">
              <strong>${c}:</strong> The parties covenant to abide strictly by standard digital legal conventions under ${governingLaw} statutes.
            </li>
          `).join("")}
        </ol>

        <h3 style="color: #0f172a; margin-top: 24px;">Terms and Periodicity</h3>
        <p style="color: #334155;">The confidentiality period for NDAs is locked to a period of <strong>${confidentialityPeriod}</strong>.</p>

        <div style="margin-top: 40px; padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h4 style="color: #0f172a; margin-top: 0; margin-bottom: 8px;">Attestation & Executive Sign</h4>
          <p style="color: #64748b; font-size: 11px; margin-bottom: 16px;">IN WITNESS WHEREOF, the authorized officers of the parties execute this covenant.</p>
          {{signature}}
        </div>
      `;
    }

    return documentService.compileTemplate(rawContent, {
      clientName: activeClient.name,
      companyName: activeClient.company,
      projectName,
      projectScope: summary,
      price: docType === "Invoice" 
        ? invoiceItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0) + tax
        : price,
      governingLaw,
      invoiceNumber,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      lineItemsHtml: invoiceItems.map(item => `${item.description} - ${item.quantity}x`).join(", ")
    });
  };

  const previewHtml = getCompiledContent();

  // D. MUTATION FOR RELATIONAL SUBMISSIONS & STORAGE VAULTING
  const mutation = useMutation({
    mutationFn: async (status: string) => {
      // 1. Zod schema validation
      if (docType === "Proposal") {
        proposalSchema.parse({
          clientId,
          projectName,
          summary,
          deliverables,
          price
        });

        return await documentService.generateDocument({
          clientId,
          docType: "proposal",
          title: projectName || "Retainer Proposal",
          content: previewHtml,
          metadata: { price, summary }
        });
      } else if (docType === "Invoice") {
        // Prepare Zod ISO Dates
        const issueISO = new Date().toISOString();
        const dueISO = new Date(dueDate).toISOString();

        invoiceSchema.parse({
          clientId,
          invoiceNumber,
          status: "DRAFT",
          tax,
          issueDate: issueISO,
          dueDate: dueISO,
          items: invoiceItems.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          }))
        });

        // Insert standard invoice database entry
        const invDb = await dbService.createInvoice({
          clientId,
          invoiceNumber,
          status: "DRAFT",
          tax,
          issueDate: issueISO,
          dueDate: dueISO,
          items: invoiceItems.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          }))
        });

        // Save generated document reference linked relationally
        return await documentService.generateDocument({
          clientId,
          docType: "invoice",
          title: `Invoice #${invoiceNumber}`,
          content: previewHtml,
          metadata: { price: invoiceItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0) + tax }
        });
      } else {
        // Contracts, NDAs, SOWs
        const typeStr = docType.toUpperCase() as any;
        contractSchema.parse({
          clientId,
          type: typeStr === "NDA" ? "NDA" : typeStr === "SOW" ? "SOW" : typeStr === "SLA" ? "SLA" : "Contract",
          governingLaw,
          confidentialityPeriod,
          clauses
        });

        return await documentService.generateDocument({
          clientId,
          docType: docType.toLowerCase() as any,
          title: template?.name || `Mutual Agreement`,
          content: previewHtml,
          metadata: { governingLaw, confidentialityPeriod }
        });
      }
    },
    onSuccess: () => {
      // E. INVALIDATE QUERIES AND SYNC LIVE
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      onClose();
    },
    onError: (err: any) => {
      alert(`Validation / Persist Error: ${err.message || "Ensure all required configurations are fulfilled."}`);
    }
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      {/* Builder Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 shadow-sm border border-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-heading font-bold text-gray-900">
              {template ? `Generating: ${template.name}` : "New Custom Document"}
            </h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
              {docType} Builder Workspace
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            disabled={mutation.isPending}
            onClick={() => mutation.mutate("Draft")}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
          <button 
            disabled={mutation.isPending}
            onClick={() => mutation.mutate("Sent")}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Persisting...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Generate & Persist
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dual Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[700px]">
        {/* Left: Input Form / Builder controls */}
        <div className="flex flex-col gap-6">
          {docType === "Proposal" && (
            <ProposalBuilder 
              clients={clients}
              clientId={clientId}
              setClientId={setClientId}
              projectName={projectName}
              setProjectName={setProjectName}
              summary={summary}
              setSummary={setSummary}
              deliverables={deliverables}
              setDeliverables={setDeliverables}
              price={price}
              setPrice={setPrice}
            />
          )}
          {docType === "Invoice" && (
            <InvoiceBuilder 
              clients={clients}
              projects={projects}
              clientId={clientId}
              setClientId={setClientId}
              invoiceNumber={invoiceNumber}
              setInvoiceNumber={setInvoiceNumber}
              tax={tax}
              setTax={setTax}
              dueDate={dueDate}
              setDueDate={setDueDate}
              invoiceItems={invoiceItems}
              setInvoiceItems={setInvoiceItems}
            />
          )}
          {(docType === "Contract" || docType === "NDA" || docType === "SOW" || docType === "SLA") && (
            <ContractBuilder 
              type={docType}
              clients={clients}
              clientId={clientId}
              setClientId={setClientId}
              governingLaw={governingLaw}
              setGoverningLaw={setGoverningLaw}
              confidentialityPeriod={confidentialityPeriod}
              setConfidentialityPeriod={setConfidentialityPeriod}
              clauses={clauses}
              setClauses={setClauses}
            />
          )}
          {docType === "Onboarding" && (
            <ProposalBuilder 
              clients={clients}
              clientId={clientId}
              setClientId={setClientId}
              projectName={projectName}
              setProjectName={setProjectName}
              summary={summary}
              setSummary={setSummary}
              deliverables={deliverables}
              setDeliverables={setDeliverables}
              price={price}
              setPrice={setPrice}
            />
          )}
        </div>

        {/* Right: Live Preview Panel */}
        <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 flex flex-col relative overflow-hidden">
           <div className="bg-white flex-1 rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 overflow-y-auto max-h-[85vh]">
              {/* Paper Layout Canvas */}
              <div className="w-full relative flex flex-col justify-between" style={{ minHeight: "650px" }}>
                 <div>
                   {/* Layout Header */}
                   <div className="border-b-2 border-gray-900 pb-4 mb-8 flex justify-between items-end">
                     <div>
                       <h3 className="text-2xl font-heading font-black text-gray-900 tracking-tight uppercase">Kairo OS</h3>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Live Generation</p>
                     </div>
                     <div className="text-right">
                       <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">{docType}</p>
                       <p className="text-xs text-slate-500 mt-0.5 font-medium">{activeClient.company}</p>
                     </div>
                   </div>

                   {/* Render Dynamic Live Previews */}
                   <div 
                     className="prose prose-slate max-w-none text-xs text-gray-800 space-y-4"
                     dangerouslySetInnerHTML={{ __html: previewHtml }}
                   />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
