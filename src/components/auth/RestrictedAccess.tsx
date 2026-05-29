"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, 
  Lock, 
  Terminal, 
  ArrowRight, 
  UserCheck, 
  Unlock,
  LogOut
} from "lucide-react";
import { KairoCard } from "@/components/ui/KairoCard";
import { KairoButton } from "@/components/ui/KairoButton";
import { KairoBadge } from "@/components/ui/KairoBadge";
import { useAuth } from "@/providers/AuthProvider";

interface RestrictedAccessProps {
  requiredRole?: string;
  activeRole?: string;
  onNavigateBack: () => void;
}

export const RestrictedAccess: React.FC<RestrictedAccessProps> = ({ 
  requiredRole = "OPERATOR", 
  activeRole = "CLIENT", 
  onNavigateBack 
}) => {
  const { logout, unlockWorkspace } = useAuth();
  const [passcode, setPasscode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showOverride, setShowOverride] = useState(false);

  const handleOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setErrorMsg("");

    const res = await unlockWorkspace(passcode);
    setIsVerifying(false);

    if (res.success) {
      // Force page reload to re-hydrate the workspace session as operator
      window.location.reload();
    } else {
      setErrorMsg(res.error || "Override passcode rejected.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative">
      {/* Glow backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-red-500/5 blur-[120px] rounded-full pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl flex flex-col items-center"
      >
        <KairoCard className="bg-slate-900 border-slate-800 text-white p-8 w-full shadow-2xl relative overflow-hidden flex flex-col gap-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full pointer-events-none" />

          {/* Secure Headers */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest leading-none font-bold">
                Security Perimeter Breach
              </h3>
            </div>
            <KairoBadge variant="neutral" className="border-red-500/20 bg-red-500/10 text-red-400">
              Access Restricted
            </KairoBadge>
          </div>

          {/* Warning Narrative */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-heading font-extrabold text-white tracking-tight leading-tight">
              Scope Authorization Mismatch
            </h2>
            <p className="text-slate-400 text-xs md:text-sm font-sans leading-relaxed">
              This node is mapped strictly to administrative credentials. Your current authorization profile lacks the required execution scope.
            </p>
          </div>

          {/* Diagnostic Console */}
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl font-mono text-[10px] text-slate-350 flex flex-col gap-2 relative">
            <div className="flex items-center justify-between text-slate-500 border-b border-slate-850 pb-2 mb-1">
              <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3 text-red-400" /> SECURE_PERIMETER_LOGS</span>
              <span className="text-red-400 font-bold uppercase">FLAG_RESTRICTED</span>
            </div>
            <p className="leading-relaxed">
              <span className="text-red-500">AUTH:</span> Client session mapped to email scope.<br />
              <span className="text-red-500">RLS:</span> Select check blocked (owner_id mismatch).<br />
              <span className="text-red-500">GARD:</span> Route request on [/{requiredRole.toLowerCase()}] requires {requiredRole}.<br />
              <span className="text-slate-500">SYS:</span> Perimeter secure. Awaiting operator validation...
            </p>
          </div>

          {/* User Profile Context */}
          <div className="flex items-center justify-between p-3.5 bg-slate-850 border border-slate-800 rounded-xl text-xs">
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Active Profile Role</span>
              <span className="font-bold text-slate-200 mt-1">{activeRole}</span>
            </div>
            <div className="flex flex-col leading-none text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Required Scope</span>
              <span className="font-bold text-red-400 mt-1">{requiredRole}</span>
            </div>
          </div>

          {/* Override form or generic buttons */}
          <AnimatePresence mode="wait">
            {showOverride ? (
              <motion.form
                key="override-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleOverride}
                className="flex flex-col gap-4 border-t border-slate-800 pt-5 mt-1"
              >
                <div>
                  <label className="block text-[9px] font-bold font-mono text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    Enter Operator Bypass Key
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      disabled={isVerifying}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-650 focus:border-red-500 outline-none transition-colors"
                    />
                  </div>
                  {errorMsg && (
                    <span className="text-[10px] text-red-400 font-semibold font-sans mt-1.5 block ml-1">{errorMsg}</span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setShowOverride(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <KairoButton
                    type="submit"
                    disabled={isVerifying}
                    className="bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] uppercase tracking-widest py-2 px-5 h-9"
                  >
                    {isVerifying ? "Verifying..." : "Bypass Lock"}
                  </KairoButton>
                </div>
              </motion.form>
            ) : (
              <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-1 gap-4">
                <button
                  onClick={() => setShowOverride(true)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-semibold"
                >
                  <Unlock className="w-3.5 h-3.5" /> Operator Override
                </button>
                <div className="flex items-center gap-3">
                  <KairoButton
                    variant="outline"
                    size="sm"
                    className="border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 h-9"
                    onClick={onNavigateBack}
                  >
                    Return to Ingress
                  </KairoButton>
                  <KairoButton
                    variant="primary"
                    size="sm"
                    className="bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white h-9"
                    onClick={logout}
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" /> Log Out
                  </KairoButton>
                </div>
              </div>
            )}
          </AnimatePresence>
        </KairoCard>
      </motion.div>
    </div>
  );
};
