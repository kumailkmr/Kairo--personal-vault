"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Prevent QueryClient re-creation on component re-renders
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute stale buffer
            gcTime: 5 * 60 * 1000,  // 5 minutes garbage collection
            refetchOnWindowFocus: false, // Prevent aggressive focus refetches
            retry: 1 // Limit retry attempts
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
