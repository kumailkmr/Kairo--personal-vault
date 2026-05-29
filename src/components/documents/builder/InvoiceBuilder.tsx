"use client";

import React from "react";
import { User, Calendar, Plus, Settings } from "lucide-react";

export const InvoiceBuilder: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6 h-full overflow-y-auto">
      <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase flex items-center gap-2 mb-2">
        <Settings className="w-4 h-4 text-emerald-500" /> Invoice Configuration
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
           <label className="text-[10px] font-bold text-slate-500 uppercase">Invoice Number</label>
           <input type="text" defaultValue="INV-1045" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors" />
        </div>
        <div className="space-y-1">
           <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Calendar className="w-3 h-3" /> Due Date</label>
           <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors" />
        </div>
      </div>

      <div className="space-y-1">
         <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><User className="w-3 h-3" /> Billed To</label>
         <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors">
           <option>Select Client...</option>
           <option>Stark Labs</option>
           <option>Ouroboros Design</option>
         </select>
      </div>

      {/* Line Items */}
      <div className="space-y-4 mt-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Line Items</h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
             <input type="text" placeholder="Description" defaultValue="Phase 1 Design Delivery" className="flex-[2] bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors" />
             <input type="number" placeholder="Qty" defaultValue="1" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors" />
             <input type="number" placeholder="Price" defaultValue="15000" className="flex-[1.5] bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-kairo-blue transition-colors" />
          </div>
          <button className="text-[10px] font-bold text-kairo-blue uppercase tracking-widest flex items-center gap-1 self-start mt-1 hover:text-blue-700 transition-colors">
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100">
         <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Amount</span>
            <span className="text-2xl font-bold font-sans tracking-tight text-gray-900">$15,000.00</span>
         </div>
      </div>
    </div>
  );
};
