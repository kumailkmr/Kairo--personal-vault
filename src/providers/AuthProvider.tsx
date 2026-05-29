"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserSession {
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends UserSession {
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Mock checking session on mount (Simulating Supabase getSession)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSession({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    return new Promise<{ error: string | null }>((resolve) => {
      setTimeout(() => {
        if (email === "kumail@kairo.co" && password === "kairo2026") {
          setSession({
            user: { id: "u-1", email: "kumail@kairo.co", name: "Kumail Kmr" },
            isAuthenticated: true,
            isLoading: false,
          });
          resolve({ error: null });
        } else {
          resolve({ error: "Invalid executive credentials." });
        }
      }, 1200); // Simulate network latency
    });
  };

  const logout = async () => {
    setSession({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...session, login, logout }}>
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
