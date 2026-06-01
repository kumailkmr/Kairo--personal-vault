"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Dashboard queries refresh every 30 seconds
            staleTime: 30 * 1000,
            // Keep unused data in memory for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Prevent aggressive focus refetches
            refetchOnWindowFocus: false,
            // Reconnect refetch for realtime reliability
            refetchOnReconnect: "always",
            // Limit retry attempts with backoff
            retry: 2,
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 10000),
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
