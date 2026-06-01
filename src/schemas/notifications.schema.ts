import { z } from "zod";

export const notificationSchema = z.object({
  userId: z.string().uuid({ message: "Invalid user relationship UUID." }).optional(),
  title: z.string()
    .min(2, { message: "Notification title must contain at least 2 characters." })
    .max(100, { message: "Notification title must not exceed 100 characters." }),
  message: z.string()
    .min(1, { message: "Notification message cannot be empty." })
    .max(500, { message: "Notification message must not exceed 500 characters." }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM")
});

export type NotificationInput = z.infer<typeof notificationSchema>;
