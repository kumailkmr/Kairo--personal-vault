import { supabase } from "@/lib/supabase";
import { MeetingRepository } from "@/repositories/MeetingRepository";
import { MeetingInput } from "@/schemas/meeting.schema";
import { 
  createMeetingAction, 
  saveMeetingNotesAction, 
  updateDealStageAction, 
  createFollowUpTaskAction 
} from "@/actions/meetings";

export const meetingsService = {

  // A. MEETINGS CRUD INFRASTRUCTURE
  async getMeetings(): Promise<any[]> {

    const { data, error } = await supabase
      .from("meetings")
      .select("*, clients(company_name, contact_name)")
      .order("start_time", { ascending: true });

    if (error) throw new Error(error.message);

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      client_name: (item.clients as any)?.company_name || "Client Representative",
      start_time: item.start_time,
      end_time: item.end_time,
      platform: item.platform,
      platform_link: item.platform_link,
      hasMeet: item.platform === "google_meet"
    }));
  },

  async createMeeting(input: MeetingInput): Promise<any> {
    // Delegate to secure, validated Server Action
    const res = await createMeetingAction(input);
    if (!res.success) {
      throw new Error(res.error);
    }
    const data = res.data;
    return {
      id: data.id,
      title: data.title,
      client_name: data.client || "Client Partner",
      start_time: data.date || data.start_time,
      end_time: data.end_time,
      platform: data.platform || "google_meet",
      platform_link: data.platform_link || data.platformLink,
      hasMeet: data.hasMeet !== undefined ? data.hasMeet : data.platform === "google_meet"
    };
  },

  async getMeetingNotes(meetingId: string): Promise<any> {

    const { data, error } = await supabase
      .from("meeting_notes")
      .select("*")
      .eq("meeting_id", meetingId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  async saveMeetingNotes(meetingId: string, content: string, actionItems: string[]): Promise<any> {
    // Delegate to secure, validated Server Action
    const res = await saveMeetingNotesAction(meetingId, content, actionItems);
    if (!res.success) {
      throw new Error(res.error);
    }
    return res.data;
  },

  // C. SALES & CLOSINGS PIPELINE Flow
  async getClosingPipeline(): Promise<any[]> {

    try {
      const { data: pipeline, error } = await supabase
        .from("closing_pipeline")
        .select("*, clients(company_name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (!pipeline || pipeline.length === 0) {
        return [];
      }

      return pipeline.map((item: any) => ({
        id: item.id,
        client: (item.clients as any)?.company_name || "Stark Labs",
        value: parseFloat(item.projected_revenue as any),
        stage: item.stage as any,
        lastContact: "Just now"
      }));
    } catch (err: any) {
      console.warn("Pipeline database query failure, falling back to seeder: ", err.message);
      return [];
    }
  },

  async updateDealStage(dealId: string, stage: string, value?: number): Promise<any> {
    // Delegate to secure, validated Server Action
    const res = await updateDealStageAction(dealId, stage);
    if (!res.success) {
      throw new Error(res.error);
    }
    return res.data;
  },

  // D. FOLLOW-UP TASKS
  async getFollowUpTasks(): Promise<any[]> {

    const { data, error } = await supabase
      .from("follow_up_tasks")
      .select("*, clients(company_name)")
      .order("due_date", { ascending: true });

    if (error) throw new Error(error.message);

    return data.map((item: any) => ({
      id: item.id,
      client: (item.clients as any)?.company_name || "Executive Task",
      title: item.title,
      due_date: item.due_date || new Date().toISOString(),
      is_completed: item.is_completed
    }));
  },

  async createFollowUpTask(input: { clientId: string; title: string; dueDate: string }): Promise<any> {
    // Delegate to secure, validated Server Action
    const res = await createFollowUpTaskAction({
      client_id: input.clientId,
      title: input.title,
      due_date: new Date(input.dueDate).toISOString(),
      is_completed: false
    });
    if (!res.success) {
      throw new Error(res.error);
    }
    return res.data;
  }
};
