import { createKairoBrowserClient } from "./client";
import { isMockMode } from "./env";

/**
 * Enterprise Realtime Sync Abstractions.
 * Handles socket connections, live invalidations, and reconnection parameters.
 */
export const kairoRealtime = {
  /**
   * Subscribes to a PostgreSQL table's CDC (Change Data Capture) broadcast events.
   * Invokes the callback reactively when mutations occur.
   */
  subscribeToTable(
    tableName: string,
    event: "INSERT" | "UPDATE" | "DELETE" | "*",
    callback: (payload: any) => void
  ) {
    if (isMockMode) {
      console.warn(`⚠️ Sandbox Mock Broadcast: Realtime listener wired on "${tableName}" for "${event}".`);
      return {
        unsubscribe: () => {
          console.log(`⚠️ Sandbox Mock Broadcast: Unsubscribed from "${tableName}".`);
        },
      };
    }

    const client = createKairoBrowserClient();

    const channel = client
      .channel(`realtime-sync:${tableName}`)
      .on(
        "postgres_changes",
        {
          event,
          schema: "public",
          table: tableName,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`📶 Supabase Realtime connected successfully to "${tableName}".`);
        } else if (status === "CLOSED" || status === "TIMED_OUT") {
          console.warn(`⚠️ Supabase Realtime connection dropped or closed for "${tableName}". Reconnecting...`);
        }
      });

    return {
      unsubscribe: () => {
        channel.unsubscribe();
      },
    };
  },
};
