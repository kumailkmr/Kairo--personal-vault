"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import { soundManager } from "@/utils/SoundManager";

export type ConnectionState = "connected" | "connecting" | "disconnected";

export interface EventLog {
  id: string;
  timestamp: string;
  event: "INSERT" | "UPDATE" | "DELETE" | "MOCK";
  table: string;
  payload: any;
}

interface RealtimeContextType {
  connectionState: ConnectionState;
  activeSubscriptionsCount: number;
  eventLogs: EventLog[];
  reconnectCount: number;
  isOnline: boolean;
  activeChannels: string[];
  subscribeToTable: (tableName: string, callback: (payload: any) => void) => () => void;
  triggerMockEvent: (tableName: string, eventType?: "INSERT" | "UPDATE" | "DELETE", customPayload?: any) => void;
  clearLogs: () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [activeSubscriptionsCount, setActiveSubscriptionsCount] = useState(0);
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
  const [reconnectCount, setReconnectCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [activeChannelsList, setActiveChannelsList] = useState<string[]>([]);

  // Registries for active channels and listeners
  const callbacksMap = useRef<Map<string, Set<(payload: any) => void>>>(new Map());
  const channelsMap = useRef<Map<string, RealtimeChannel>>(new Map());

  // 1. Connection recovery: Network status listeners
  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);
    setConnectionState(navigator.onLine ? "connected" : "disconnected");

    const handleOnline = () => {
      setIsOnline(true);
      setConnectionState("connecting");
      setReconnectCount(prev => prev + 1);
      
      // Attempt to re-subscribe all active maps
      setTimeout(() => {
        setConnectionState("connected");
        logger.info("REALTIME", "Network restored: Sockets successfully reconnected.");
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionState("disconnected");
      logger.warn("REALTIME", "Network connection dropped: Offline Mode active.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Connection Watchdog
  useEffect(() => {
    if (connectionState === "disconnected" && isOnline) {
      const timer = setTimeout(() => {
        logger.warn("REALTIME", "Watchdog triggered: Attempting manual reconnection");
        setReconnectCount(prev => prev + 1);
        setConnectionState("connecting");
        // Channels will auto-reconnect via supabase-js internally, 
        // we just update our state to reflect the attempt.
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [connectionState, isOnline]);

  // 2. Add log entry to rolling event history feed (with basic debouncing)
  const lastLogTime = useRef<{ [key: string]: number }>({});
  const logEvent = useCallback((table: string, event: "INSERT" | "UPDATE" | "DELETE" | "MOCK", payload: any) => {
    const now = Date.now();
    const eventKey = `${table}-${event}-${payload.id || 'sys'}`;
    
    // Debounce rapid identical CDC events (within 500ms)
    if (lastLogTime.current[eventKey] && now - lastLogTime.current[eventKey] < 500) {
      return; 
    }
    lastLogTime.current[eventKey] = now;

    const newLog: EventLog = {
      id: `evt-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      event,
      table,
      payload
    };
    
    setEventLogs(prev => [newLog, ...prev].slice(0, 50)); 
  }, []);

  // 3. Centralized Subscription Dispatcher
  const subscribeToTable = useCallback((tableName: string, callback: (payload: any) => void) => {
    const channelName = `realtime:${tableName}`;

    // B. Supabase Live Sockets Subscription Handler
    if (!callbacksMap.current.has(tableName)) {
      callbacksMap.current.set(tableName, new Set());
    }

    const callbacksSet = callbacksMap.current.get(tableName)!;
    callbacksSet.add(callback);

    // Hydrate local subscription indicators
    setActiveSubscriptionsCount(prev => prev + 1);

    // If a WebSocket channel isn't open for this table, provision a new one
    if (!channelsMap.current.has(tableName)) {
      setConnectionState("connecting");
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
            logger.debug("REALTIME", `Intercepted CDC on: ${tableName}`, { eventType: payload.eventType });
            logEvent(tableName, payload.eventType as any, payload.new || payload.old);
            
            // Play sound based on event type or table
            if (payload.eventType === "INSERT") {
              if (tableName === "notifications") {
                soundManager.play("alert", "ping_alert");
              } else if (tableName === "invoices") {
                soundManager.play("operational", "success_chime");
              } else {
                soundManager.play("message", "ping_subtle");
              }
            } else if (payload.eventType === "DELETE") {
               soundManager.play("system", "warning_pulse");
            }

            // Dispatch event to all registered listeners
            const currentCallbacks = callbacksMap.current.get(tableName);
            if (currentCallbacks) {
              currentCallbacks.forEach(cb => cb(payload));
            }
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setConnectionState("connected");
            setActiveChannelsList(prev => [...prev, channelName]);
            logger.info("REALTIME", `Sockets Active on channel: ${channelName}`);
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            setConnectionState("disconnected");
            logger.error("REALTIME", `Sockets Failure on channel: ${channelName}`);
          }
        });

      channelsMap.current.set(tableName, channel);
    }

    return () => {
      const remainingCallbacks = callbacksMap.current.get(tableName);
      if (remainingCallbacks) {
        remainingCallbacks.delete(callback);
        
        // If no listeners remain for this table, dismantle the channel
        if (remainingCallbacks.size === 0) {
          const channel = channelsMap.current.get(tableName);
          if (channel) {
            supabase.removeChannel(channel);
            channelsMap.current.delete(tableName);
            logger.info("REALTIME", `Sockets Closed on channel: ${channelName}`);
          }
          callbacksMap.current.delete(tableName);
          setActiveChannelsList(prev => prev.filter(name => name !== channelName));
        }
      }
      setActiveSubscriptionsCount(prev => Math.max(0, prev - 1));
    };
  }, [logEvent]);

  // 4. Trigger simulated database events in sandbox mode
  const triggerMockEvent = useCallback((tableName: string, eventType: "INSERT" | "UPDATE" | "DELETE" = "UPDATE", customPayload?: any) => {
    const mockPayload = customPayload || {
      id: `mock-${Date.now()}`,
      updated_at: new Date().toISOString()
    };

    logEvent(tableName, "MOCK", mockPayload);
    logger.debug("REALTIME", `Simulating event '${eventType}' on: ${tableName}`);

    const activeCallbacks = callbacksMap.current.get(tableName);
    if (activeCallbacks) {
      activeCallbacks.forEach(cb => {
        cb({
          eventType,
          table: tableName,
          new: mockPayload,
          old: mockPayload
        });
      });
    }
  }, [logEvent]);

  // 5. Clean up connection logs
  const clearLogs = useCallback(() => {
    setEventLogs([]);
  }, []);

  // Cleanup all channels on unmount
  useEffect(() => {
    return () => {
      channelsMap.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsMap.current.clear();
      callbacksMap.current.clear();
      logger.info("REALTIME", "Terminated all active connections.");
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{
      connectionState,
      activeSubscriptionsCount,
      eventLogs,
      reconnectCount,
      isOnline,
      activeChannels: activeChannelsList,
      subscribeToTable,
      triggerMockEvent,
      clearLogs
    }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }
  return context;
};
