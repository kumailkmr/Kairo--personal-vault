import { supabase, isMockMode } from "@/lib/supabase";

type RealtimeCallback = (payload: {
  event: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  new: Record<string, any>;
  old: Record<string, any>;
}) => void;

interface SubscriptionRegistry {
  [channelName: string]: {
    unsubscribe: () => void;
    callbacks: Set<RealtimeCallback>;
  };
}

// Keep track of active subscriptions to prevent memory leaks and duplicate channels
const activeSubscriptions: SubscriptionRegistry = {};

export const realtimeEngine = {
  /**
   * Subscribe to live PostgreSQL database alterations for a specific schema table.
   * Organizes channels centrally and handles dynamic lifecycle listeners.
   */
  subscribeToTable(tableName: string, callback: RealtimeCallback): { unsubscribe: () => void } {
    const channelName = `realtime-sync:${tableName}`;

    if (isMockMode) {
      console.log(`[Realtime Mock] Subscribed to changes on: ${tableName}`);
      
      // Simulate real-time database mutations periodically in sandbox/mock mode
      const intervalId = setInterval(() => {
        const triggers = ["INSERT", "UPDATE"];
        const randomTrigger = triggers[Math.floor(Math.random() * triggers.length)] as "INSERT" | "UPDATE";
        
        callback({
          event: randomTrigger,
          table: tableName,
          new: { id: `mock-${tableName}-${Math.random().toString(36).substr(2, 5)}`, updated_at: new Date().toISOString() },
          old: {}
        });
      }, 45000); // Triggers mock updates every 45s in local testing mode

      return {
        unsubscribe: () => {
          clearInterval(intervalId);
          console.log(`[Realtime Mock] Unsubscribed from changes on: ${tableName}`);
        }
      };
    }

    // 1. If channel already exists, append the callback to the listeners set
    if (activeSubscriptions[channelName]) {
      activeSubscriptions[channelName].callbacks.add(callback);
      return {
        unsubscribe: () => {
          activeSubscriptions[channelName].callbacks.delete(callback);
          if (activeSubscriptions[channelName].callbacks.size === 0) {
            activeSubscriptions[channelName].unsubscribe();
            delete activeSubscriptions[channelName];
          }
        }
      };
    }

    const callbacksSet = new Set<RealtimeCallback>();
    callbacksSet.add(callback);

    // 2. Initialize a secure Supabase Realtime Channel
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: tableName
        },
        (payload) => {
          console.log(`[Realtime Sync] Mutation intercepted on: ${tableName}`, payload.eventType);
          callbacksSet.forEach(cb => {
            cb({
              event: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
              table: tableName,
              new: payload.new,
              old: payload.old
            });
          });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(`[Realtime Sync] Connected to Supabase socket channel: ${channelName}`);
        } else if (status === "CHANNEL_ERROR") {
          console.error(`[Realtime Sync] Connection error on channel: ${channelName}`);
        } else if (status === "TIMED_OUT") {
          console.warn(`[Realtime Sync] Subscription connection timeout: ${channelName}`);
        }
      });

    activeSubscriptions[channelName] = {
      unsubscribe: () => {
        supabase.removeChannel(channel);
        console.log(`[Realtime Sync] Dismantled socket channel: ${channelName}`);
      },
      callbacks: callbacksSet
    };

    return {
      unsubscribe: () => {
        callbacksSet.delete(callback);
        if (callbacksSet.size === 0) {
          activeSubscriptions[channelName].unsubscribe();
          delete activeSubscriptions[channelName];
        }
      }
    };
  },

  /**
   * Disconnect all active subscriptions when logging out or locking the workspace shell
   */
  teardownAllChannels() {
    Object.keys(activeSubscriptions).forEach((channelName) => {
      activeSubscriptions[channelName].unsubscribe();
      delete activeSubscriptions[channelName];
    });
    console.log("[Realtime Sync] Teardown: Disconnected all active realtime channels.");
  }
};
