/**
 * ═══════════════════════════════════════════════════════════════
 * KAIRO OS — ENTERPRISE AUDIT TRAIL SERVICE
 * ═══════════════════════════════════════════════════════════════
 * 
 * Writes structured audit entries to the `audit_logs` table.
 * Tracks: who, when, what, previous value, new value, entity type, entity ID.
 * 
 * Used by all Server Actions for enterprise-grade operational traceability.
 */

import { logger } from "@/lib/logger";

export type AuditSeverity = "INFO" | "WARNING" | "CRITICAL";

export interface AuditEntry {
  userId: string;
  action: string;
  tableName: string;
  recordId: string;
  details?: Record<string, unknown>;
  severity?: AuditSeverity;
}

export const AuditService = {
  /**
   * Log an audit event to the audit_logs table.
   * Falls back to structured logger in mock mode.
   */
  async log(entry: AuditEntry): Promise<void> {
    const logData = {
      user_id: entry.userId,
      action: entry.action,
      table_name: entry.tableName,
      record_id: entry.recordId,
      details: entry.details || {},
      severity: entry.severity || "INFO",
    };

    try {
      // Dynamic import to avoid server-only module in client context
      const { createKairoServerClient } = await import("@/lib/supabase/server");
      const client = await createKairoServerClient();
      
      const { error } = await client.from("audit_logs").insert({
        id: crypto.randomUUID(),
        ...logData,
        created_at: new Date().toISOString(),
      });

      if (error) {
        logger.error("SECURITY", "Failed to persist audit log entry", { entry: logData }, error);
      }
    } catch (err) {
      // Audit logging should never crash the calling action
      logger.error("SECURITY", "Audit service exception", { entry: logData }, err);
    }
  },

  /**
   * Log a mutation event with before/after values.
   */
  async logMutation(
    userId: string,
    action: string,
    tableName: string,
    recordId: string,
    previousValue?: Record<string, unknown>,
    newValue?: Record<string, unknown>
  ): Promise<void> {
    await this.log({
      userId,
      action,
      tableName,
      recordId,
      details: {
        previous: previousValue || null,
        new: newValue || null,
        mutatedAt: new Date().toISOString(),
      },
      severity: "INFO",
    });
  },

  /**
   * Log a security-sensitive event.
   */
  async logSecurity(
    userId: string,
    action: string,
    details?: Record<string, unknown>
  ): Promise<void> {
    await this.log({
      userId,
      action,
      tableName: "security",
      recordId: "system",
      details: { ...details, timestamp: new Date().toISOString() },
      severity: "WARNING",
    });
  },
};
