import "server-only";
import { supabase } from "@/lib/supabase";
import { createKairoServerClient } from "@/lib/supabase/server";

export interface DBNotificationData {
  user_id: string;
  title: string;
  message: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "low" | "medium" | "high" | "critical";
  is_read: boolean;
}

export const NotificationRepository = {
  async getNotifications(userId: string) {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(item => ({
      id: item.id,
      title: item.title,
      message: item.message,
      time: "Just now",
      read: item.is_read,
      type: (item.priority === "CRITICAL" ? "alert" : "activity") as any,
      priority: item.priority.toLowerCase() as any,
      created_at: item.created_at
    }));
  },

  async createNotification(data: DBNotificationData) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("notifications")
      .insert({
        user_id: data.user_id,
        title: data.title,
        message: data.message,
        priority: data.priority.toUpperCase(),
        is_read: data.is_read
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async markRead(id: string) {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async markAllRead(userId: string) {
    const client = await createKairoServerClient();
    const { error } = await client
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return true;
  }
};
