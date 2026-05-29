"use client";

import React from "react";
import { MOCK_CLIENT_INVOICES } from "@/mock/clients";
import { motion } from "framer-motion";
import { DollarSign, Download, ArrowUpRight } from "lucide-react";

export const ClientRevenueTab: React.FC = () => {
  const totalRevenue = MOCK_CLIENT_INVOICES.reduce((acc, inv) => acc + (inv.status === "Paid" ? inv.amount : 0), 0);
  const pendingRevenue = MOCK_CLIENT_INVOICES.reduce((acc, inv) => acc + (inv.status === "Pending" ? inv.amount : 0), 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-kairo-blue rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2">Total Paid Revenue</h4>
            <div className="text-3xl font-bold font-sans tracking-tight">${totalRevenue.toLocaleString()}</div>
          </div>
          <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-800/30" />
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pending Payments</h4>
          <div className="text-3xl font-bold font-sans tracking-tight text-gray-900">${pendingRevenue.toLocaleString()}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-center items-start">
           <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors w-full justify-center">
             <PlusIcon /> Generate Invoice
           </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
           <h3 className="text-sm font-heading font-bold text-gray-900 tracking-widest uppercase">Invoice History</h3>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Invoice</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_CLIENT_INVOICES.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{inv.id.toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm font-semibold font-sans tracking-tight text-gray-900">${inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">{inv.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      inv.status === 'Pending' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                      'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 rounded-lg text-slate-400 hover:text-kairo-blue hover:bg-blue-50 transition-colors">
                         <Download className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);
