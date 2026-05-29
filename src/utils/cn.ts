import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard utility to combine tailwind CSS classes dynamically
 * with deduplication and conflict merging.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
