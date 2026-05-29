"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/useToast";

export const LoginForm: React.FC<{ onAccessGranted: () => void }> = ({ onAccessGranted }) => {
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("kumail@kairo.co");
  const [password, setPassword] = useState("kairo2026");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "authenticating" | "success" | "error" | "biometric">("idle");
  const [biometricStep, setBiometricStep] = useState<"idle" | "scanning" | "matched" | "failed">("idle");
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

    setTimeout(() => {
      onAccessGranted();
    }, 1200);
  };

  const handleBiometricAuth = () => {
    setStatus("biometric");
    setBiometricStep("scanning");
    setErrorMsg("");

    setTimeout(async () => {
      // Simulate successful biometrics checking against operator's local device
      const { error } = await login("kumail@kairo.co", "kairo2026");
      
      if (error) {
        setBiometricStep("failed");
        setTimeout(() => setStatus("idle"), 2000);
        return;
      }

      setBiometricStep("matched");
      toast({
        title: "Keyless Access Approved",
        description: "Device signature match: Kumail Kmr. Hydrating local nodes...",
        type: "ai"
      });

      setTimeout(() => {
        onAccessGranted();
      }, 1200);
    }, 2000);
  };

  const inputClasses = "w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans text-gray-900 placeholder-slate-400 focus:bg-white focus:border-kairo-blue focus:ring-4 focus:ring-kairo-blue/10 outline-none transition-all";
  const labelClasses = "block text-[10px] font-semibold font-heading text-gray-500 mb-1.5 uppercase tracking-widest ml-1";

  return (
    <div className="w-full flex flex-col relative min-h-[420px]">
      
      {/* Visual Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-gray-900">Secure Access</h2>
        <p className="text-sm text-gray-500 mt-1">Authenticate to initialize workspace.</p>
      </div>

      {/* Main Authentication Core Form */}
      <AnimatePresence mode="wait">
        {status === "biometric" ? (
          <motion.div
            key="biometric-console"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center py-8 text-center flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden text-white"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
            
            {/* Interactive Scanning Circles */}
            <div className="relative mb-8 flex items-center justify-center">
              {biometricStep === "scanning" && (
                <>
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1] }} 
                    transition={{ repeat: Infinity, duration: 2 }} 
                    className="absolute w-20 h-20 rounded-full border border-blue-500/20" 
                  />
                  <motion.div 
                    animate={{ scale: [1.2, 1.6, 1.2] }} 
                    transition={{ repeat: Infinity, duration: 2, delay: 0.4 }} 
                    className="absolute w-20 h-20 rounded-full border border-blue-500/10" 
                  />
                </>
              )}
              
              <div className={`w-16 h-16 rounded-full border flex items-center justify-center relative shadow-inner z-10 transition-colors duration-500 ${
                biometricStep === "matched" 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                  : biometricStep === "failed" 
                    ? "bg-red-500/10 border-red-500/30 text-red-400" 
                    : "bg-slate-800 border-slate-700 text-blue-400"
              }`}>
                {biometricStep === "matched" ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : biometricStep === "failed" ? (
                  <AlertCircle className="w-8 h-8" />
                ) : (
                  <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Fingerprint className="w-8 h-8" />
                  </motion.div>
                )}
              </div>
            </div>

            <h4 className="text-base font-bold font-heading uppercase tracking-widest text-white mb-2">
              {biometricStep === "scanning" ? "Scanning Local Keys" : biometricStep === "matched" ? "TouchID Approved" : "Verification Failed"}
            </h4>
            <p className="text-xs text-slate-400 font-sans max-w-[220px] leading-relaxed">
              {biometricStep === "scanning" 
                ? "Validating hardware credentials & checking device trust indices..." 
                : biometricStep === "matched" 
                  ? "Ingress approved. Opening operational workspace." 
                  : "Invalid biometric signature."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="login-form-fields"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Error notifications */}
            <AnimatePresence mode="wait">
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold overflow-hidden"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={status === "authenticating" || status === "success"}
                    className={inputClasses}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-1.5 select-none">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 rounded border border-slate-300 bg-white group-hover:border-kairo-blue transition-colors">
                    <input type="checkbox" defaultChecked className="peer opacity-0 absolute inset-0 cursor-pointer" />
                    <svg className="w-3 h-3 text-white peer-checked:text-kairo-blue transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <span className="text-xs text-gray-500 font-medium group-hover:text-gray-700 transition-colors">Persist session</span>
                </label>
                
                {/* TouchID Trigger */}
                <button
                  type="button"
                  onClick={handleBiometricAuth}
                  className="flex items-center gap-1.5 text-xs text-kairo-blue font-semibold hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <Fingerprint className="w-3.5 h-3.5" /> Keyless Ingress
                </button>
              </div>

              <button 
                type="submit"
                disabled={status === "authenticating" || status === "success"}
                className="group relative w-full h-14 mt-4 bg-gray-900 text-white rounded-xl font-heading font-bold text-xs tracking-wider uppercase hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed overflow-hidden flex items-center justify-center"
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
                      <ShieldCheck className="w-4 h-4" />
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
        )}
      </AnimatePresence>
    </div>
  );
};
