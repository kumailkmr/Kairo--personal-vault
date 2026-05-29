"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commsService } from "@/services/comms.service";
import { Cpu, ShieldCheck, CheckCircle2, ChevronRight, Upload, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientOnboardPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const requestId = params.id as string;

  // Onboarding Form States
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("Full Stack Application");
  const [budgetRange, setBudgetRange] = useState("$25,000 - $50,000");
  const [goals, setGoals] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formError, setFormError] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadProgress(20);
      // Simulate file upload loading sequence
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 20;
        });
      }, 150);
    }
  };

  // Submit Mutation
  const mutation = useMutation({
    mutationFn: async () => {
      // Inputs schema validation
      if (!name || !company || !email) {
        throw new Error("Contact name, company, and email are required fields.");
      }
      if (goals.length < 10) {
        throw new Error("Please describe your strategic goals in more detail (min 10 characters).");
      }

      return await commsService.createOnboardingRequest({
        name,
        company,
        email,
        phone,
        projectType,
        budgetRange,
        goals,
        notes,
        status: "PENDING"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboardingRequests"] });
      setStep(3); // Success Screen
    },
    onError: (err: any) => {
      setFormError(err.message || "Submission failed. Please verify your inputs.");
    }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience Glares */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Branded Header */}
      <header className="mb-10 text-center flex flex-col items-center gap-3 z-10 select-none">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
          <Cpu className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase font-heading">Kairo OS</h1>
          <span className="text-[10px] text-slate-400 mt-1 uppercase font-semibold tracking-widest flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Private Client Intake Gateway
          </span>
        </div>
      </header>

      {/* Main Form Box */}
      <div className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 overflow-hidden">
        {/* Form Error Banner */}
        {formError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-1">Step 1 of 2: Executive Representative</h2>
                <p className="text-xs font-medium text-slate-400">Please provide your corporate coordinates to initialize the secure intake token.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Wright"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company / Org</label>
                  <input
                    type="text"
                    placeholder="e.g. Stark Labs"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Corporate Email</label>
                  <input
                    type="email"
                    placeholder="alex@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 012-3456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!name || !company || !email) {
                    setFormError("All representative coordinates must be populated.");
                    return;
                  }
                  setFormError("");
                  setStep(2);
                }}
                className="mt-4 flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20"
              >
                Continue to Requirements <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-1">Step 2 of 2: Requirements Scope</h2>
                <p className="text-xs font-medium text-slate-400">Map your strategic project objectives and financial target cycles.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project Type</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all outline-none"
                  >
                    <option>Full Stack Application</option>
                    <option>AI Automation System</option>
                    <option>Enterprise CRM Integration</option>
                    <option>Financial Accounting Engine</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Financial Budget Range</label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all outline-none"
                  >
                    <option>$10,000 - $25,000</option>
                    <option>$25,000 - $50,000</option>
                    <option>$50,000 - $100,000</option>
                    <option>$100,000 +</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strategic Goals & Deliverables</label>
                <textarea
                  rows={4}
                  placeholder="Describe what success looks like for this integration... (min 10 characters)"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-slate-600 resize-none"
                />
              </div>

              {/* Asset Uploader */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Uploads (Guidelines/Briefs)</label>
                <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center bg-slate-950/20 hover:border-slate-700 transition-colors flex flex-col items-center justify-center cursor-pointer relative">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-slate-500 mb-2" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                    {uploadedFile ? uploadedFile.name : "Choose File or Drag Here"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 font-medium">Supports PDF, ZIP, PNG, docx (Max 50MB)</span>
                  
                  {uploadedFile && (
                    <div className="w-full bg-slate-900 rounded-full h-1 mt-4 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => mutation.mutate()}
                  disabled={mutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Transmitting...
                    </>
                  ) : (
                    <>
                      Submit Onboarding <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center flex flex-col items-center py-10"
            >
              <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 mb-6 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Onboarding Intake Successful</h2>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-8">
                Your coordinates and strategic goals have been successfully vaulted into the Kairo OS ledger. An executive advisor will review the details and initiate communications.
              </p>
              
              <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left font-mono text-[10px] text-slate-500 flex flex-col gap-1 select-all mb-4">
                <span>INTAKE TOKEN: ONB-{requestId.slice(-5).toUpperCase() || "ACTIVE"}</span>
                <span>LEDGER STATE: ARCHIVED & SYNCED</span>
                <span>SHA256 SECURE HANDSHAKE: VERIFIED</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-12 text-[10px] text-slate-600 tracking-wider uppercase font-sans font-medium">
        Kairo OS Operations Framework — Secured Session
      </footer>
    </div>
  );
}
