import { logger } from "@/lib/logger";

/**
 * centralizes error logging, mapping PostgREST codes (e.g., RLS violations, duplicates)
 * into premium operational logs.
 */
export interface KairoErrorResponse {
  code: string;
  message: string;
  originalError: any;
}

export const kairoErrors = {
  /**
   * Normalizes database and authentication payloads into structured responses.
   */
  normalize(err: any): KairoErrorResponse {
    if (!err) {
      return {
        code: "UNKNOWN",
        message: "An unspecified system anomaly occurred.",
        originalError: null,
      };
    }

    const code = err.code || err.status || "SYSTEM_ERROR";
    let message = err.message || "An unexpected operational exception was intercepted.";

    // Map strict PostgREST exception codes
    switch (code) {
      case "42P01":
        message = "Operational catalog lookup failed. Referenced relation was not found.";
        break;
      case "42P07":
        message = "Relation already exists inside the database catalog.";
        break;
      case "23505":
        message = "Unique constraint violation. A record with identical parameters already exists.";
        break;
      case "23503":
        message = "Referential integrity constraint failed. Missing parent key parameters.";
        break;
      case "42501":
        message = "Access restricted. PostgreSQL Row-Level Security (RLS) policies denied the operation.";
        break;
      case "PGRST116":
        message = "Query expected a single row matching target filters but returned zero results.";
        break;
      case "auth/invalid-email":
      case "invalid_credentials":
        message = "Security authorization failed. Check your credential parameters.";
        break;
    }

    return {
      code: String(code),
      message,
      originalError: err,
    };
  },

  /**
   * Safe logs diagnostic payload audits inside server actions.
   */
  audit(err: any, context?: string) {
    const normalized = this.normalize(err);
    logger.error("SECURITY", `Kairo Security Audit [${context || "System"}]`, {
      code: normalized.code,
      message: normalized.message,
      details: normalized.originalError,
    });
    return normalized;
  },
};
