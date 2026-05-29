"use client";

import React from "react";
import { User, Calendar, Plus, Settings, Trash2 } from "lucide-react";
import { CRMClient } from "@/mock/clients";
import { Project } from "@/types";

interface InvoiceBuilderProps {
  clients: CRMClient[];
  projects: Project[];
  clientId: string;
  setClientId: (val: string) => void;
  invoiceNumber: string;
  setInvoiceNumber: (val: string) => void;
  tax: number;
  setTax: (val: number) => void;
  dueDate: string;
  setDueDate: (val: string) => void;
  invoiceItems: Array<{ description: string; quantity: number; unitPrice: number }>;
  setInvoiceItems: (val: Array<{ description: string; quantity: number; unitPrice: number }>) => void;
}

export const InvoiceBuilder: React.FC<InvoiceBuilderProps> = ({
  clients,
  projects,
  clientId,
  setClientId,
  invoiceNumber,
  setInvoiceNumber,
  tax,
  setTax,
  dueDate,
  setDueDate,
  invoiceItems,
  setInvoiceItems
}) => {

  const addLineItem = () => {
    setInvoiceItems([...invoiceItems, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const updateLineItem = (idx: number, field: "description" | "quantity" | "unitPrice", value: any) => {
    const updated = [...invoiceItems];
    if (field === "quantity" || field === "unitPrice") {
      updated[idx][field] = parseFloat(value) || 0;
    } else {
      updated[idx][field] = value;
    }
    setInvoiceItems(updated);
  };

  const removeLineItem = (idx: number) => {
    if (invoiceItems.length <= 1) return;
    setInvoiceItems(invoiceItems.filter((_, i) => i !== idx));
  };

  const subtotal = invoiceItems.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
  const grandTotal = subtotal + tax;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6 h-full max-h-[85vh] overflow-y-auto">
      <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2 mb-2">
        <Settings className="w-4 h-4 text-emerald-500" /> Invoice Configuration
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
           <label className="text-[10px] font-bold text-slate-500 uppercase">Invoice Number</label>
           <input 
             type="text" 
             value={invoiceNumber} 
             onChange={(e) => setInvoiceNumber(e.target.value)}
             className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none" 
           />
        </div>
        <div className="space-y-1">
           <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
             <Calendar className="w-3 h-3" /> Due Date
           </label>
           <input 
             type="date" 
             value={dueDate}
             onChange={(e) => setDueDate(e.target.value)}
             className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none" 
           />
        </div>
      </div>

      <div className="space-y-1">
         <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
           <User className="w-3 h-3" /> Billed To (Client)
         </label>
         <select 
           value={clientId}
           onChange={(e) => setClientId(e.target.value)}
           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none"
         >
           <option value="">Select Client...</option>
           {clients.map(c => (
             <option key={c.id} value={c.id}>
               {c.company} ({c.name})
             </option>
           ))}
         </select>
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Line Items</h4>
        <div className="flex flex-col gap-3">
          {invoiceItems.map((item, idx) => (
             <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 border border-slate-100 p-3 rounded-2xl bg-slate-50/50">
               <input 
                 type="text" 
                 placeholder="Item Description" 
                 value={item.description}
                 onChange={(e) => updateLineItem(idx, "description", e.target.value)}
                 className="w-full sm:flex-[2] bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none" 
               />
               <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1">
                 <input 
                   type="number" 
                   placeholder="Qty" 
                   value={item.quantity || ""}
                   onChange={(e) => updateLineItem(idx, "quantity", e.target.value)}
                   className="w-16 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-gray-900 text-center focus:outline-none focus:border-kairo-blue transition-colors outline-none" 
                 />
                 <input 
                   type="number" 
                   placeholder="Price" 
                   value={item.unitPrice || ""}
                   onChange={(e) => updateLineItem(idx, "unitPrice", e.target.value)}
                   className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none" 
                 />
                 <button 
                   onClick={() => removeLineItem(idx)}
                   className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             </div>
          ))}
          <button 
            onClick={addLineItem}
            className="text-[10px] font-bold text-kairo-blue uppercase tracking-widest flex items-center gap-1 self-start mt-1 hover:text-blue-700 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </div>
      </div>

      {/* Tax Section */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase">Tax Operations ($)</label>
        <input 
          type="number" 
          placeholder="0.00"
          value={tax || ""}
          onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
          className="w-1/3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors outline-none" 
        />
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100">
         <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Amount</span>
            <span className="text-2xl font-bold font-sans tracking-tight text-gray-900">
              ${grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
         </div>
      </div>
    </div>
  );
};
