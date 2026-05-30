import { createKairoBrowserClient } from "./client";
import { isMockMode } from "./env";

export const KAIRO_BUCKETS = {
  INVOICES: "invoices",
  AGREEMENTS: "agreements",
  ONBOARDING: "onboarding-files",
  PROPOSALS: "proposals",
  BRANDING: "branding-assets",
  UPLOADS: "uploads",
} as const;

export type KairoBucketName = typeof KAIRO_BUCKETS[keyof typeof KAIRO_BUCKETS];

/**
 * Enterprise-grade Storage Vault Client
 */
export const kairoStorage = {
  /**
   * Securely uploads a file to a specific storage bucket path.
   */
  async uploadFile(
    bucket: KairoBucketName,
    path: string,
    file: File,
    upsert = true
  ): Promise<{ path: string; url?: string }> {
    if (isMockMode) {
      console.warn("⚠️ Storage Sandbox Fallback Upload:", { bucket, path, name: file.name });
      return {
        path: `mock/${bucket}/${path}`,
        url: `https://mock-storage.kairo.os/${bucket}/${path}`,
      };
    }

    const client = createKairoBrowserClient();
    const { data, error } = await client.storage
      .from(bucket)
      .upload(path, file, { upsert });

    if (error) throw error;
    return { path: data.path };
  },

  /**
   * Generates a temporary, cryptographically signed URL for secure CDN file retrieval.
   */
  async getSignedDownloadUrl(
    bucket: KairoBucketName,
    path: string,
    expiresInSeconds = 3600
  ): Promise<string> {
    if (isMockMode) {
      return `https://mock-storage.kairo.os/${bucket}/${path}?signed=true`;
    }

    const client = createKairoBrowserClient();
    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds);

    if (error) throw error;
    return data.signedUrl;
  },

  /**
   * Deletes a file from the bucket registry.
   */
  async deleteFile(bucket: KairoBucketName, path: string): Promise<void> {
    if (isMockMode) {
      console.warn("⚠️ Storage Sandbox Fallback Delete:", { bucket, path });
      return;
    }

    const client = createKairoBrowserClient();
    const { error } = await client.storage.from(bucket).remove([path]);

    if (error) throw error;
  },
};
