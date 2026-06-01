/**
 * ═══════════════════════════════════════════════════════════════
 * KAIRO OS — ENTERPRISE STRUCTURED LOGGING SYSTEM
 * ═══════════════════════════════════════════════════════════════
 * 
 * Centralized logging utility with severity levels, categories,
 * and structured metadata. Replaces raw console.log/error calls
 * across the entire application.
 * 
 * In development: Pretty-prints with emojis and colors.
 * In production: Outputs structured JSON for log aggregation.
 */

export type LogSeverity = "DEBUG" | "INFO" | "WARN" | "ERROR" | "CRITICAL";

export type LogCategory =
  | "AUTH"
  | "CRUD"
  | "REALTIME"
  | "DOCUMENT"
  | "FINANCE"
  | "AI"
  | "SYSTEM"
  | "SECURITY"
  | "STORAGE"
  | "COMMUNICATION"
  | "MEETING"
  | "NOTIFICATION"
  | "PERFORMANCE";

export interface LogEntry {
  timestamp: string;
  severity: LogSeverity;
  category: LogCategory;
  message: string;
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const SEVERITY_LEVEL: Record<LogSeverity, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  CRITICAL: 4,
};

const SEVERITY_EMOJI: Record<LogSeverity, string> = {
  DEBUG: "🔍",
  INFO: "📋",
  WARN: "⚠️",
  ERROR: "❌",
  CRITICAL: "🚨",
};

const CATEGORY_EMOJI: Record<LogCategory, string> = {
  AUTH: "🔐",
  CRUD: "📝",
  REALTIME: "📶",
  DOCUMENT: "📄",
  FINANCE: "💰",
  AI: "🤖",
  SYSTEM: "⚙️",
  SECURITY: "🛡️",
  STORAGE: "📦",
  COMMUNICATION: "💬",
  MEETING: "📅",
  NOTIFICATION: "🔔",
  PERFORMANCE: "⚡",
};

// Minimum severity to output (DEBUG in dev, INFO in prod)
const MIN_SEVERITY: LogSeverity =
  typeof process !== "undefined" && process.env.NODE_ENV === "production" ? "INFO" : "DEBUG";

function shouldLog(severity: LogSeverity): boolean {
  return SEVERITY_LEVEL[severity] >= SEVERITY_LEVEL[MIN_SEVERITY];
}

function formatError(err: unknown): LogEntry["error"] | undefined {
  if (!err) return undefined;
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    };
  }
  return { name: "UnknownError", message: String(err) };
}

function createLogEntry(
  severity: LogSeverity,
  category: LogCategory,
  message: string,
  metadata?: Record<string, unknown>,
  error?: unknown
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    severity,
    category,
    message,
    metadata: metadata || undefined,
    error: formatError(error),
  };
}

function emit(entry: LogEntry): void {
  const isProduction =
    typeof process !== "undefined" && process.env.NODE_ENV === "production";

  if (isProduction) {
    // Structured JSON output for log aggregation services
    const output = JSON.stringify(entry);
    if (SEVERITY_LEVEL[entry.severity] >= SEVERITY_LEVEL.ERROR) {
      console.error(output);
    } else if (entry.severity === "WARN") {
      console.warn(output);
    } else {
      console.log(output);
    }
    return;
  }

  // Development: pretty-print with emojis
  const sevEmoji = SEVERITY_EMOJI[entry.severity];
  const catEmoji = CATEGORY_EMOJI[entry.category];
  const prefix = `${sevEmoji} [${entry.category}]`;
  const msg = `${prefix} ${catEmoji} ${entry.message}`;

  if (SEVERITY_LEVEL[entry.severity] >= SEVERITY_LEVEL.ERROR) {
    console.error(msg, entry.metadata || "", entry.error || "");
  } else if (entry.severity === "WARN") {
    console.warn(msg, entry.metadata || "");
  } else if (entry.severity === "DEBUG") {
    console.debug(msg, entry.metadata || "");
  } else {
    console.log(msg, entry.metadata || "");
  }
}

/**
 * Kairo OS structured logger.
 * 
 * Usage:
 *   logger.info("AUTH", "User signed in successfully", { userId: "u-1" });
 *   logger.error("CRUD", "Failed to create client", { clientId }, error);
 *   logger.critical("SECURITY", "RLS bypass attempt detected", { ip, path });
 */
export const logger = {
  debug(category: LogCategory, message: string, metadata?: Record<string, unknown>) {
    if (!shouldLog("DEBUG")) return;
    emit(createLogEntry("DEBUG", category, message, metadata));
  },

  info(category: LogCategory, message: string, metadata?: Record<string, unknown>) {
    if (!shouldLog("INFO")) return;
    emit(createLogEntry("INFO", category, message, metadata));
  },

  warn(category: LogCategory, message: string, metadata?: Record<string, unknown>) {
    if (!shouldLog("WARN")) return;
    emit(createLogEntry("WARN", category, message, metadata));
  },

  error(category: LogCategory, message: string, metadata?: Record<string, unknown>, error?: unknown) {
    if (!shouldLog("ERROR")) return;
    emit(createLogEntry("ERROR", category, message, metadata, error));
  },

  critical(category: LogCategory, message: string, metadata?: Record<string, unknown>, error?: unknown) {
    // Critical always logs regardless of min severity
    emit(createLogEntry("CRITICAL", category, message, metadata, error));
  },
};
