"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldAlert } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/useToast";

export const LoginForm: React.FC<{ onAccessGranted: () => void }> = ({ onAccessGranted }) => {
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("kumail@kairo.co");
  const [password, setPassword] = useState("kairo2026");
  const [status, setStatus] = useState<"idle" | "authenticating" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("authenticating");
    setErrorMsg("");

    const { error } = await login(email, password);

    if (error) {
      setStatus("error");
      setErrorMsg(error);
      toast({
        title: "Access Denied",
        description: error,
        type: "alert"
      });
      return;
    }

    setStatus("success");
    toast({
      title: "Workspace Authorized",
      description: "Welcome back, Kumail. Synchronizing systems...",
      type: "activity"
    });

    // Cinematic pause before transitioning to the intro sequence
    setTimeout(() => {
      onAccessGranted();
    }, 1200);
  };

  const inputClasses = "w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans text-gray-900 placeholder-slate-400 focus:bg-white focus:border-kairo-blue focus:ring-4 focus:ring-kairo-blue/10 outline-none transition-all";
  const labelClasses = "block text-[10px] font-semibold font-heading text-gray-500 mb-1.5 uppercase tracking-widest ml-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full flex flex-col"
    >
      <div className="mb-10 lg:hidden">
        <h2 className="text-2xl font-heading font-bold text-gray-900">Kairo OS</h2>
        <p className="text-sm text-gray-500 mt-1">Private Executive Access</p>
      </div>

      <div className="hidden lg:block mb-8">
        <h2 className="text-2xl font-heading font-bold text-gray-900">Secure Access</h2>
        <p className="text-sm text-gray-500 mt-1">Authenticate to initialize workspace.</p>
      </div>

      <AnimatePresence mode="wait">
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm overflow-hidden"
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className={labelClasses}>Executive Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="email" 
              required 
              placeholder="name@kairo.co" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "authenticating" || status === "success"}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>Passcode</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={status === "authenticating" || status === "success"}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center w-4 h-4 rounded border border-slate-300 bg-white group-hover:border-kairo-blue transition-colors">
              <input type="checkbox" defaultChecked className="peer opacity-0 absolute inset-0 cursor-pointer" />
              <svg className="w-3 h-3 text-white peer-checked:text-kairo-blue transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <span className="text-xs text-gray-500 font-medium select-none group-hover:text-gray-700 transition-colors">Persist session</span>
          </label>
        </div>

        <button 
          type="submit"
          disabled={status === "authenticating" || status === "success"}
          className="group relative w-full h-14 mt-4 bg-gray-900 text-white rounded-xl font-heading font-bold text-sm tracking-wide hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed overflow-hidden flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {status === "authenticating" ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying...</span>
              </motion.div>
            ) : status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-green-400"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span>Authorized</span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <span>Initialize Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </form>
    </motion.div>
  );
};
