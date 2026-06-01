import { createKairoBrowserClient } from "./client";

import { logger } from "@/lib/logger";

// ═══════════════════════════════════════════════════════════════
// STORAGE CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const KAIRO_BUCKETS = {
  INVOICES: "invoices",
  AGREEMENTS: "agreements",
  ONBOARDING: "onboarding-files",
  PROPOSALS: "proposals",
  BRANDING: "branding-assets",
  UPLOADS: "uploads",
} as const;

export type KairoBucketName = typeof KAIRO_BUCKETS[keyof typeof KAIRO_BUCKETS];

// ─── Upload Validation Constraints ────────────────────────────
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = new Set([
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  // Images
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
]);

const FORBIDDEN_PATH_PATTERNS = [
  /\.\./,            // Directory traversal
  /\/\//,            // Double slashes
  /[<>:"|?*]/,       // Illegal path characters
  /^\//,             // Absolute paths
];

// ─── Validation Utilities ─────────────────────────────────────

function validateFileSize(file: File): void {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `File size (${sizeMB}MB) exceeds the maximum allowed size of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`
    );
  }
}

function validateFileType(file: File): void {
  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error(
      `File type "${file.type}" is not allowed. Accepted types: PDF, DOCX, XLSX, PPTX, TXT, CSV, PNG, JPG, WEBP, SVG, GIF.`
    );
  }
}

function sanitizePath(path: string): string {
  for (const pattern of FORBIDDEN_PATH_PATTERNS) {
    if (pattern.test(path)) {
      throw new Error(
        `Invalid file path detected. Path contains forbidden characters or patterns.`
      );
    }
  }
  // Normalize the path: trim whitespace, remove leading/trailing slashes
  return path.trim().replace(/^\/+|\/+$/g, "");
}

// ═══════════════════════════════════════════════════════════════
// ENTERPRISE STORAGE VAULT CLIENT
// ═══════════════════════════════════════════════════════════════

export const kairoStorage = {
  /**
   * Securely uploads a file to a specific storage bucket path.
   * Validates file size, type, and path before uploading.
   */
  async uploadFile(
    bucket: KairoBucketName,
    path: string,
    file: File,
    upsert = true
  ): Promise<{ path: string; url?: string }> {
    // Server-side validation before upload
    validateFileSize(file);
    validateFileType(file);
    const safePath = sanitizePath(path);



    const client = createKairoBrowserClient();
    const { data, error } = await client.storage
      .from(bucket)
      .upload(safePath, file, { upsert });

    if (error) {
      logger.error("STORAGE", "Upload failed", { bucket, path: safePath, name: file.name }, error);
      throw error;
    }

    logger.info("STORAGE", "File uploaded successfully", { bucket, path: data.path, name: file.name, size: file.size });
    return { path: data.path };
  },

  /**
   * Generates a temporary, cryptographically signed URL for secure CDN file retrieval.
   * Default expiry: 1 hour. Maximum: 7 days (604800 seconds).
   */
  async getSignedDownloadUrl(
    bucket: KairoBucketName,
    path: string,
    expiresInSeconds = 3600
  ): Promise<string> {
    // Clamp expiry to maximum 7 days
    const clampedExpiry = Math.min(expiresInSeconds, 604800);



    const client = createKairoBrowserClient();
    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUrl(path, clampedExpiry);

    if (error) {
      logger.error("STORAGE", "Signed URL generation failed", { bucket, path }, error);
      throw error;
    }

    return data.signedUrl;
  },

  /**
   * Deletes a file from the bucket registry.
   */
  async deleteFile(bucket: KairoBucketName, path: string): Promise<void> {


    const client = createKairoBrowserClient();
    const { error } = await client.storage.from(bucket).remove([path]);

    if (error) {
      logger.error("STORAGE", "File deletion failed", { bucket, path }, error);
      throw error;
    }

    logger.info("STORAGE", "File deleted successfully", { bucket, path });
  },
};
