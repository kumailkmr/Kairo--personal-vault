import "server-only";
import { supabase } from "@/lib/supabase";
import { createKairoServerClient } from "@/lib/supabase/server";

export interface DBMeetingData {
  client_id?: string;
  title: string;
  description?: string;
  platform: string;
  platform_link: string;
  start_time: string;
  end_time: string;
}

export const MeetingRepository = {
  async getMeetings() {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("meetings")
      .select("*, clients(company_name)")
      .order("start_time", { ascending: true });

    if (error) throw new Error(error.message);
    return data.map(item => ({
      id: item.id,
      title: item.title,
      client: (item.clients as any)?.company_name || "Private Session",
      date: item.start_time,
      hasMeet: item.platform === "google_meet",
      type: "client",
      link: item.platform_link,
      description: item.description,
      end_time: item.end_time,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  },

  async createMeeting(data: DBMeetingData & { id?: string }) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("meetings")
      .insert({
        client_id: data.client_id,
        title: data.title,
        description: data.description || "",
        platform: data.platform,
        platform_link: data.platform_link,
        start_time: data.start_time,
        end_time: data.end_time
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async updateMeeting(id: string, data: Partial<DBMeetingData>) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("meetings")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async deleteMeeting(id: string) {
    const client = await createKairoServerClient();
    const { error } = await client
      .from("meetings")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
    return true;
  },

  // Notes
  async getMeetingNotes(meetingId: string) {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("meeting_notes")
      .select("*")
      .eq("meeting_id", meetingId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async saveMeetingNotes(meetingId: string, content: string, actionItems: string[], authorId: string) {
    const client = await createKairoServerClient();
    // In live PostgreSQL, look up if a note already exists
    const { data: existing } = await client
      .from("meeting_notes")
      .select("id")
      .eq("meeting_id", meetingId)
      .maybeSingle();

    let result;
    if (existing) {
      const { data, error } = await client
        .from("meeting_notes")
        .update({ content, action_items: actionItems })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await client
        .from("meeting_notes")
        .insert({ meeting_id: meetingId, author_id: authorId, content, action_items: actionItems })
        .select()
        .single();
      if (error) throw error;
      result = data;
    }
    return result;
  },

  // Deal Pipeline & Closings
  async getClosingPipeline() {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("closing_pipeline")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // If table closing_pipeline doesn't exist relationally, fail gracefully
      console.warn("Pipeline database tables not fully active, falling back to secure pipeline mocks.");
      return [];
    }
    return data;
  },

  async updateDealStage(dealId: string, stage: string) {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("closing_pipeline")
      .update({ stage })
      .eq("id", dealId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Follow-up tasks
  async getFollowUpTasks() {
    const client = await createKairoServerClient();
    const { data, error } = await client
      .from("follow_up_tasks")
      .select("*, clients(company_name)")
      .order("due_date", { ascending: true });

    if (error) throw new Error(error.message);
    return data.map(item => ({
      id: item.id,
      client: (item.clients as any)?.company_name || "Executive Task",
      title: item.title,
      due_date: item.due_date || new Date().toISOString(),
      is_completed: item.is_completed
    }));
  },

  async createFollowUpTask(data: { client_id: string; title: string; due_date: string; is_completed: boolean }) {
    const client = await createKairoServerClient();
    const { data: dbData, error } = await client
      .from("follow_up_tasks")
      .insert({
        client_id: data.client_id,
        title: data.title,
        is_completed: data.is_completed,
        due_date: data.due_date
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  },

  async toggleFollowUpTask(taskId: string) {
    const client = await createKairoServerClient();
    const { data: task } = await client
      .from("follow_up_tasks")
      .select("is_completed")
      .eq("id", taskId)
      .single();

    const nextStatus = !task?.is_completed;

    const { data: dbData, error } = await client
      .from("follow_up_tasks")
      .update({ is_completed: nextStatus })
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return dbData;
  }
};
