"use client";

import React, { useState } from "react";
import { X, User, Briefcase, Mail, Phone, Tag, DollarSign, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clientSchema } from "@/schemas/client";
import { CRMClient } from "@/mock/clients";
import { useToast } from "@/hooks/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dbService } from "@/services/db.service";

interface ClientFormModalProps {
  onClose: () => void;
  onSuccess: (newClient: CRMClient) => void;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({ onClose, onSuccess }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State variables for inputs
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [revenue, setRevenue] = useState(5000);
  const [selectedTags, setSelectedTags] = useState<string[]>(["New Client"]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const availableTags = ["Enterprise", "Agency", "Tech", "Legacy", "High Priority", "New Client"];

  // 1. Setup TanStack Query mutation to write client to the relational backend
  const { mutate, isPending } = useMutation({
    mutationFn: (clientData: Parameters<typeof dbService.createClient>[0]) => 
      dbService.createClient(clientData),
    onSuccess: (newClient) => {
      // Invalidate query to trigger live reactive refreshes across layout grids
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      onSuccess(newClient);
      
      toast({
        title: "CRM Ledger Created",
        description: `Successfully onboarded ${name} representing ${company}.`,
        type: "activity"
      });
    },
    onError: (err: Error) => {
      setValidationError(err.message || "Failed to save client to Supabase.");
      toast({
        title: "Operational Sync Error",
        description: err.message || "An exception occurred while persisting records.",
        type: "alert"
      });
    }
  });

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate inputs via Zod clientSchema
    const validationResult = clientSchema.safeParse({
      name,
      company,
      email,
      phone,
      status: "onboarding", // Default status upon creation
      revenue: Number(revenue),
      tags: selectedTags
    });

    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues[0]?.message || "Invalid client parameters.";
      setValidationError(errorMsg);
      toast({
        title: "Validation Error",
        description: errorMsg,
        type: "alert"
      });
      return;
    }

    // Call mutation to write validated values to the Supabase backend
    mutate({
      name,
      company,
      email,
      phone,
      status: "onboarding",
      revenue: Number(revenue),
      tags: selectedTags
    });
  };

  const inputClasses = "w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-gray-900 placeholder:text-slate-350 focus:outline-none focus:border-kairo-blue focus:bg-white transition-all shadow-sm";
  const labelClasses = "text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-heading font-bold text-gray-900 uppercase tracking-widest">New Client Profile</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors text-slate-500 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Validation Alert Box */}
              <AnimatePresence mode="wait">
                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-semibold flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-1 group">
                  <label className={labelClasses}>
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Elena Rodriguez" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isPending}
                      className={inputClasses}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-1 group">
                  <label className={labelClasses}>
                    <Briefcase className="w-3.5 h-3.5" /> Company Name
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Ouroboros Design" 
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      disabled={isPending}
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1 group">
                  <label className={labelClasses}>
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      placeholder="elena@ouroboros.design" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isPending}
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1 group">
                  <label className={labelClasses}>
                    <Phone className="w-3.5 h-3.5" /> Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="tel" 
                      required
                      placeholder="+1 (555) 000-0000" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isPending}
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Revenue Retainer */}
                <div className="space-y-1 group sm:col-span-2">
                  <label className={labelClasses}>
                    <DollarSign className="w-3.5 h-3.5" /> Monthly Retainer Value (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      required
                      placeholder="5000" 
                      value={revenue}
                      onChange={(e) => setRevenue(Number(e.target.value))}
                      disabled={isPending}
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>

              {/* Tags Selection */}
              <div className="space-y-2">
                 <label className={labelClasses}>
                    <Tag className="w-3.5 h-3.5" /> Client Segmentation Tags
                  </label>
                  <div className="flex flex-wrap gap-2 p-4 border border-slate-200 rounded-2xl bg-slate-50">
                     {availableTags.map(tag => {
                       const isSelected = selectedTags.includes(tag);
                       return (
                         <button 
                           key={tag} 
                           type="button"
                           disabled={isPending}
                           onClick={() => handleToggleTag(tag)}
                           className={`px-3.5 py-1.5 border text-xs font-bold font-heading uppercase rounded-xl transition-all cursor-pointer ${
                             isSelected 
                               ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                               : "bg-white border-slate-200 text-slate-500 hover:border-slate-350 hover:text-gray-900"
                           }`}
                         >
                           {tag}
                         </button>
                       );
                     })}
                  </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end px-6 py-4 bg-slate-50 border-t border-slate-100 gap-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-5 py-2.5 text-xs font-bold text-slate-650 hover:bg-slate-200 rounded-xl transition-colors uppercase tracking-widest cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 bg-kairo-blue hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Create Client"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
