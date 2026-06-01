"use server";

import { NotificationRepository } from "@/repositories/NotificationRepository";
import { requireServerAuth, requireOperatorAuth } from "@/actions/auth";
import { notificationSchema } from "@/schemas/notifications.schema";
import { ActionResult } from "@/actions/crm";
import { logger } from "@/lib/logger";
import { AuditService } from "@/services/AuditService";

export async function createNotificationAction(input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const validated = notificationSchema.parse(input);

    const notification = await NotificationRepository.createNotification({
      user_id: validated.userId || actor.id,
      title: validated.title,
      message: validated.message,
      priority: validated.priority as any,
      is_read: false
    });

    await AuditService.log({
      userId: actor.id,
      action: "CREATE_NOTIFICATION",
      tableName: "notifications",
      recordId: notification.id || "new"
    });
    logger.info("NOTIFICATION", "Workspace notification issued", { notificationId: notification.id });

    return { success: true, data: notification };
  } catch (error: any) {
    logger.error("NOTIFICATION", "Failed to issue workspace notification", { input }, error);
    return { success: false, error: error.message || "Failed to issue workspace notification." };
  }
}

export async function markNotificationReadAction(id: string): Promise<ActionResult<any>> {
  try {
    const actor = await requireServerAuth();
    const notif = await NotificationRepository.markRead(id);
    
    // We don't need a full audit log for just reading a notification, but we'll log it
    logger.info("NOTIFICATION", "Notification marked read", { notificationId: id, userId: actor.id });

    return { success: true, data: notif };
  } catch (error: any) {
    logger.error("NOTIFICATION", "Failed to mark notification as read", { notificationId: id }, error);
    return { success: false, error: error.message || "Failed to mark notification as read." };
  }
}

export async function markAllNotificationsReadAction(): Promise<ActionResult<boolean>> {
  try {
    const actor = await requireServerAuth();
    await NotificationRepository.markAllRead(actor.id);
    
    logger.info("NOTIFICATION", "All notifications marked read", { userId: actor.id });

    return { success: true, data: true };
  } catch (error: any) {
    logger.error("NOTIFICATION", "Failed to mark notifications as read", { userId: "current" }, error);
    return { success: false, error: error.message || "Failed to mark notifications as read." };
  }
}
