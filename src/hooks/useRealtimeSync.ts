import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { realtimeEngine } from "@/services/realtime";

/**
   * Custom hook to bind PostgreSQL table changes directly to TanStack Query cache lifecycle.
   * Intercepts insertions/updates/deletions and forces instant state invalidations.
   */
export function useRealtimeSync(tableName: string, queryKeysToInvalidate: Array<string | string[] | any>) {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(`[Realtime Hook] Activating replication listener for table: ${tableName}`);

    const subscription = realtimeEngine.subscribeToTable(tableName, (payload) => {
      console.log(
        `[Realtime Hook] Mutation received: ${payload.event} on table: ${tableName}. Re-syncing caches...`
      );

      // Invalidate all configured TanStack Query keys to trigger live fetches
      queryKeysToInvalidate.forEach((queryKey) => {
        queryClient.invalidateQueries({
          queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
          exact: false
        });
      });
    });

    return () => {
      console.log(`[Realtime Hook] Dismantling replication listener for table: ${tableName}`);
      subscription.unsubscribe();
    };
  }, [tableName, queryClient]); // Re-subscribe if tableName or queryClient changes
}
