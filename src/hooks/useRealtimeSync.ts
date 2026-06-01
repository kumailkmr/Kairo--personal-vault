import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRealtime } from "@/providers/RealtimeProvider";

/**
 * Custom hook to bind PostgreSQL table changes directly to TanStack Query cache lifecycle.
 * Intercepts insertions/updates/deletions and forces instant state invalidations.
 */
export function useRealtimeSync(tableName: string, queryKeysToInvalidate: Array<string | string[] | any>) {
  const queryClient = useQueryClient();
  const { subscribeToTable } = useRealtime();
  
  // Use a ref to keep the latest query keys, preventing subscription churn if array literals change references
  const keysRef = useRef(queryKeysToInvalidate);
  useEffect(() => {
    keysRef.current = queryKeysToInvalidate;
  }, [queryKeysToInvalidate]);

  useEffect(() => {
    const unsubscribe = subscribeToTable(tableName, (payload) => {
      // Invalidate all configured TanStack Query keys to trigger live fetches
      keysRef.current.forEach((queryKey) => {
        queryClient.invalidateQueries({
          queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
          exact: false
        });
      });
    });

    return () => {
      unsubscribe();
    };
  }, [tableName, queryClient, subscribeToTable]); // Re-subscribe if tableName or queryClient or subscribeToTable changes
}
