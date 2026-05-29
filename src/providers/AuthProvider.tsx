"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "OPERATOR" | "CLIENT" | "ADMIN";

export interface UserSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  } | null;
  isAuthenticated: boolean;
  isLocked: boolean;
  isLoading: boolean;
  isReconnecting: boolean;
}

interface AuthContextType extends UserSession {
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  lockWorkspace: () => void;
  unlockWorkspace: (passcode: string) => Promise<{ success: boolean; error: string | null }>;
  simulateSessionExpiry: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "kairo_jwt_session";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession>({
    user: null,
    isAuthenticated: false,
    isLocked: false,
    isLoading: true,
    isReconnecting: false,
  });

  // Hydrate session on mount from localStorage
  useEffect(() => {
    const hydrateSession = () => {
      try {
        const stored = localStorage.getItem(SESSION_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSession({
            user: parsed.user,
            isAuthenticated: true,
            isLocked: parsed.isLocked || false,
            isLoading: false,
            isReconnecting: false,
          });
          return;
        }
      } catch (err) {
        console.error("Failed to restore secure auth session:", err);
      }
      setSession(prev => ({ ...prev, isLoading: false }));
    };

    const timer = setTimeout(hydrateSession, 800); // Cinematic latency simulation
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    return new Promise<{ error: string | null }>((resolve) => {
      setTimeout(() => {
        // Operator validation
        if (email === "kumail@kairo.co" && password === "kairo2026") {
          const newUser = { id: "u-1", email: "kumail@kairo.co", name: "Kumail Kmr", role: "OPERATOR" as const };
          const newSession = {
            user: newUser,
            isAuthenticated: true,
            isLocked: false,
            isLoading: false,
            isReconnecting: false,
          };
          setSession(newSession);
          localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
          resolve({ error: null });
          return;
        } 
        
        // Client validation
        if (email === "client@acme.com" && password === "acme2026") {
          const newUser = { id: "u-2", email: "client@acme.com", name: "Sarah Jenkins (Acme Corp)", role: "CLIENT" as const };
          const newSession = {
            user: newUser,
            isAuthenticated: true,
            isLocked: false,
            isLoading: false,
            isReconnecting: false,
          };
          setSession(newSession);
          localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
          resolve({ error: null });
          return;
        }

        resolve({ error: "Access denied. Invalid credentials." });
      }, 1000);
    });
  };

  const logout = async () => {
    setSession({
      user: null,
      isAuthenticated: false,
      isLocked: false,
      isLoading: false,
      isReconnecting: false,
    });
    localStorage.removeItem(SESSION_KEY);
  };

  const lockWorkspace = () => {
    setSession(prev => {
      const updated = { ...prev, isLocked: true };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const unlockWorkspace = async (passcode: string) => {
    return new Promise<{ success: boolean; error: string | null }>((resolve) => {
      setTimeout(() => {
        // Unlock matches standard operating password
        if (passcode === "kairo2026" || passcode === "2026") {
          setSession(prev => {
            const updated = { ...prev, isLocked: false };
            localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
            return updated;
          });
          resolve({ success: true, error: null });
        } else {
          resolve({ success: false, error: "Incorrect passcode." });
        }
      }, 800);
    });
  };

  const simulateSessionExpiry = () => {
    setSession({
      user: null,
      isAuthenticated: false,
      isLocked: false,
      isLoading: false,
      isReconnecting: false,
    });
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ ...session, login, logout, lockWorkspace, unlockWorkspace, simulateSessionExpiry }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
