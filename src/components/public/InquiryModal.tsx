"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, X } from "lucide-react";
import { MOCK_PROJECT_REQUESTS } from "@/mock/requests";

export const InquiryModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Form input states
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [goals, setGoals] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");

    // Format current hours and minutes
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = `Today, ${timeStr}`;

    const newRequest = {
      id: `req-${Date.now()}`,
      name,
      company,
      email,
      phone,
      projectType: projectType || "Custom SaaS Dashboard",
      budgetRange: budgetRange || "$25,000 - $50,000",
      goals,
      notes: notes || "No additional parameters provided.",
      status: "Pending" as const,
      date: formattedDate
    };

    setTimeout(() => {
      MOCK_PROJECT_REQUESTS.unshift(newRequest); // Add to the front of the list
      setFormState("success");
    }, 1500);
  };

  const inputClasses = "w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-sans text-gray-900 placeholder-slate-400 focus:bg-white focus:border-kairo-blue focus:ring-4 focus:ring-kairo-blue/10 outline-none transition-all";
  const labelClasses = "block text-[10px] font-semibold font-heading text-gray-500 mb-1.5 uppercase tracking-widest ml-1 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Cinematic Frosted Glass Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
      />
      
      {/* Premium Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl shadow-gray-900/20 overflow-hidden flex flex-col max-h-[90vh] border border-white/50 ring-1 ring-slate-900/5"
      >
        {/* Subtle top glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-xl sticky top-0 z-10">
           <div>
             <h3 className="text-xl font-heading font-bold text-gray-900 tracking-tight">Project Inquiry</h3>
             <p className="text-sm text-gray-500 mt-1">Request a custom operations system or software architecture.</p>
           </div>
           <button 
             onClick={onClose} 
             className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all active:scale-95 border border-slate-200 shadow-sm animate-none"
           >
             <X className="w-4 h-4" />
           </button>
        </div>
        
        {/* Scrollable Form Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar relative">
           <AnimatePresence mode="wait">
             {formState === "success" ? (
               <motion.div 
                 key="success"
                 initial={{ opacity: 0, scale: 0.95, y: 10 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 className="flex flex-col items-center justify-center py-20 text-center"
               >
                 <div className="relative mb-8">
                   <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-full" />
                   <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-50 to-green-100 border border-green-200 text-green-600 flex items-center justify-center relative shadow-inner">
                     <CheckCircle2 className="w-10 h-10" />
                   </div>
                 </div>
                 <h4 className="text-2xl font-heading font-bold text-gray-900 mb-3 tracking-tight">Intelligence Routed</h4>
                 <p className="text-gray-500 font-sans max-w-sm mb-10 leading-relaxed">
                   Your inquiry has been secured and routed directly to Kumail&apos;s operational pipeline. We will review your project parameters and reach out shortly.
                 </p>
                 <button 
                   onClick={onClose}
                   className="px-8 py-3.5 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 active:scale-[0.98]"
                 >
                   Return to Dashboard
                 </button>
               </motion.div>
             ) : (
               <motion.form 
                 key="form"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onSubmit={handleSubmit}
                 className="flex flex-col gap-6"
               >
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="group">
                     <label className={`${labelClasses} ${focusedField === 'name' ? 'text-kairo-blue' : ''}`}>Full Name</label>
                     <input type="text" required placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} />
                   </div>
                   <div className="group">
                     <label className={`${labelClasses} ${focusedField === 'company' ? 'text-kairo-blue' : ''}`}>Business / Company</label>
                     <input type="text" required placeholder="Acme Corp" value={company} onChange={(e) => setCompany(e.target.value)} className={inputClasses} onFocus={() => setFocusedField('company')} onBlur={() => setFocusedField(null)} />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="group">
                     <label className={`${labelClasses} ${focusedField === 'email' ? 'text-kairo-blue' : ''}`}>Email Address</label>
                     <input type="email" required placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
                   </div>
                   <div className="group">
                     <label className={`${labelClasses} ${focusedField === 'phone' ? 'text-kairo-blue' : ''}`}>WhatsApp Number</label>
                     <input type="tel" required placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClasses} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="group">
                     <label className={`${labelClasses} ${focusedField === 'type' ? 'text-kairo-blue' : ''}`}>Project Type</label>
                     <select className={inputClasses} required value={projectType} onChange={(e) => setProjectType(e.target.value)} onFocus={() => setFocusedField('type')} onBlur={() => setFocusedField(null)}>
                       <option value="" disabled>Select project type...</option>
                       <option value="Custom SaaS Dashboard">Custom SaaS Dashboard</option>
                       <option value="Internal Operations System">Internal Operations System</option>
                       <option value="AI Automation Workspace">AI Automation Workspace</option>
                       <option value="Mobile Application">Mobile Application</option>
                       <option value="Other">Other</option>
                     </select>
                   </div>
                   <div className="group">
                     <label className={`${labelClasses} ${focusedField === 'budget' ? 'text-kairo-blue' : ''}`}>Budget Range</label>
                     <select className={inputClasses} required value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} onFocus={() => setFocusedField('budget')} onBlur={() => setFocusedField(null)}>
                       <option value="" disabled>Select budget range...</option>
                       <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                       <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                       <option value="$50,000+">$50,000+</option>
                     </select>
                   </div>
                 </div>

                 <div className="group">
                   <label className={`${labelClasses} ${focusedField === 'goals' ? 'text-kairo-blue' : ''}`}>Project Goals</label>
                   <textarea required placeholder="What are the primary operational objectives of this build?" value={goals} onChange={(e) => setGoals(e.target.value)} rows={3} className={`${inputClasses} resize-none`} onFocus={() => setFocusedField('goals')} onBlur={() => setFocusedField(null)} />
                 </div>

                 <div className="group">
                   <label className={`${labelClasses} ${focusedField === 'notes' ? 'text-kairo-blue' : ''}`}>Timeline & Additional Notes</label>
                   <textarea placeholder="Any strict deadlines or specific infrastructure requirements?" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={`${inputClasses} resize-none`} onFocus={() => setFocusedField('notes')} onBlur={() => setFocusedField(null)} />
                 </div>

                 <div className="pt-6 mt-2 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4">
                   <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                     Cancel
                   </button>
                   <button 
                     type="submit"
                     disabled={formState === "submitting"}
                     className="relative w-full sm:w-auto px-8 py-3.5 bg-kairo-blue text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-kairo-blue/20 active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group"
                   >
                     {formState === "submitting" ? (
                       <>
                         <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         Transmitting...
                       </>
                     ) : (
                       <>
                         Submit Inquiry
                         <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                         <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20 pointer-events-none" />
                       </>
                     )}
                   </button>
                 </div>
               </motion.form>
             )}
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

