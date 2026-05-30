import { supabase, isMockMode, localDb } from "@/lib/supabase";
import { MOCK_CALENDAR_EVENTS, MOCK_PIPELINE_DEALS, PipelineStage } from "@/mock/meetings";
import { meetingSchema, MeetingInput } from "@/schemas/meeting.schema";
import { z } from "zod";

// Initialize mock data collections inside localDb if they are missing
if (!(localDb as any).meetingsCollection) {
  (localDb as any).meetingsCollection = MOCK_CALENDAR_EVENTS.map(evt => ({
    id: evt.id,
    title: evt.title,
    client_name: evt.client,
    start_time: evt.date,
    end_time: new Date(new Date(evt.date).getTime() + 60 * 60 * 1000).toISOString(),
    platform: "google_meet",
    platform_link: "https://meet.google.com/abc-defg-hij",
    type: evt.type,
    status: "scheduled",
    hasMeet: evt.hasMeet
  }));
}

if (!(localDb as any).closingPipeline) {
  (localDb as any).closingPipeline = [...MOCK_PIPELINE_DEALS];
}

if (!(localDb as any).meetingNotes) {
  (localDb as any).meetingNotes = [
    {
      id: "note-1",
      meeting_id: "evt-1",
      content: "Acme Corp requested focus on Next.js 16 App Router deployment cycles. Staged transition planned.",
      action_items: ["Review bundle compilers", "Provision Supabase credentials"]
    }
  ];
}

if (!(localDb as any).followUpTasks) {
  (localDb as any).followUpTasks = [
    {
      id: "task-101",
      client_id: "cli-001",
      title: "Deliver Q3 Technical Spec Review Packets",
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      is_completed: false
    },
    {
      id: "task-102",
      client_id: "cli-002",
      title: "Schedule Brand Guidelines Kickoff Session",
      due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      is_completed: false
    }
  ];
}

// Activity Logging helper specifically for Meetings
async function logMeetingActivity(meetingId: string | null, action: string, details: Record<string, unknown>) {
  const currentUserId = "c76fb973-ec63-41c4-b816-56be794c483d";
  const logEntry = {
    id: `act-${Math.random().toString(36).substr(2, 9)}`,
    meeting_id: meetingId || "global",
    user_id: currentUserId,
    action,
    details,
    created_at: new Date().toISOString()
  };

  if (isMockMode) {
    localDb.activityLogs.push({
      id: logEntry.id,
      client_id: "c-1",
      user_id: currentUserId,
      action,
      details,
      created_at: logEntry.created_at
    });
  } else {
    try {
      if (meetingId) {
        await supabase.from("meeting_activity_logs").insert({
          meeting_id: meetingId,
          user_id: currentUserId,
          action
        });
      }
    } catch (err) {
      console.error("Failed to persist meeting audit log:", err);
    }
  }
}

// Global System Notifications helper
async function triggerMeetingsNotification(title: string, message: string, priority = "MEDIUM") {
  if (isMockMode) {
    localDb.notifications.unshift({
      id: `not-${Date.now()}`,
      title,
      message,
      priority,
      read: false,
      timestamp: "Just now"
    } as any);
  } else {
    try {
      await supabase.from("notifications").insert({
        user_id: "c76fb973-ec63-41c4-b816-56be794c483d",
        title,
        message,
        priority: priority.toUpperCase()
      });
    } catch (err) {
      console.error("Failed to generate meeting notification:", err);
    }
  }
}

// =========================================================================
// 3. EXECUTIVE SCHEDULES & pipeline COORDINATION DATA ENGINE
// =========================================================================
export const meetingsService = {

  // A. MEETINGS CRUD INFRASTRUCTURE
  async getMeetings(): Promise<any[]> {
    if (isMockMode) {
      return (localDb as any).meetingsCollection;
    }

    const { data, error } = await supabase
      .from("meetings")
      .select("*, clients(company_name, contact_name)")
      .order("start_time", { ascending: true });

    if (error) throw new Error(error.message);

    return data.map(item => ({
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
    const validated = meetingSchema.parse(input);
    const currentUserId = "c76fb973-ec63-41c4-b816-56be794c483d";

    if (isMockMode) {
      const clientObj = localDb.clients.find(c => c.id === validated.clientId);
      const mockMeeting = {
        id: `evt-${Date.now()}`,
        title: validated.title,
        client_name: clientObj?.company || "Acme Corp",
        start_time: validated.startTime,
        end_time: validated.endTime,
        platform: validated.platform,
        platform_link: validated.platformLink,
        hasMeet: validated.platform === "google_meet"
      };

      (localDb as any).meetingsCollection.push(mockMeeting);

      // Create mock reminder
      localDb.activityLogs.push({
        id: `act-${Math.random().toString(36).substr(2, 9)}`,
        client_id: validated.clientId || "global",
        action: "MEETING_SCHEDULED",
        details: { title: validated.title },
        created_at: new Date().toISOString()
      });

      await triggerMeetingsNotification(
        "Meeting Scheduled Successfully",
        `Upcoming strategy session "${validated.title}" scheduled with ${clientObj?.company || "Representative"}.`,
        "MEDIUM"
      );

      return mockMeeting;
    }

    // 1. Write session event to meetings table
    const { data: meeting, error: dbError } = await supabase
      .from("meetings")
      .insert({
        client_id: validated.clientId,
        title: validated.title,
        description: validated.description || "",
        platform: validated.platform,
        platform_link: validated.platformLink,
        start_time: validated.startTime,
        end_time: validated.endTime
      })
      .select("*, clients(company_name)")
      .single();

    if (dbError) throw new Error(dbError.message);

    // 2. Cascade relational structures: reminders & activity logs
    const reminderTime = new Date(new Date(validated.startTime).getTime() - 15 * 60 * 1000).toISOString();
    await supabase.from("meeting_reminders").insert({
      meeting_id: meeting.id,
      remind_at: reminderTime,
      is_sent: false
    });

    await logMeetingActivity(meeting.id, "MEETING_SCHEDULED", { title: validated.title });

    await triggerMeetingsNotification(
      "Meeting Scheduled Successfully",
      `Upcoming strategy session "${validated.title}" scheduled with ${(meeting.clients as any)?.company_name || "Representative"}.`,
      "MEDIUM"
    );

    return {
      id: meeting.id,
      title: meeting.title,
      client_name: (meeting.clients as any)?.company_name || "Client Representative",
      start_time: meeting.start_time,
      end_time: meeting.end_time,
      platform: meeting.platform,
      platform_link: meeting.platform_link,
      hasMeet: meeting.platform === "google_meet"
    };
  },

  // B. MEETING NOTES & OUTCOMES
  async getMeetingNotes(meetingId: string): Promise<any> {
    if (isMockMode) {
      return (localDb as any).meetingNotes.find((n: any) => n.meeting_id === meetingId) || null;
    }

    const { data, error } = await supabase
      .from("meeting_notes")
      .select("*")
      .eq("meeting_id", meetingId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },

  async saveMeetingNotes(meetingId: string, content: string, actionItems: string[]): Promise<any> {
    const currentUserId = "c76fb973-ec63-41c4-b816-56be794c483d";

    if (isMockMode) {
      const idx = (localDb as any).meetingNotes.findIndex((n: any) => n.meeting_id === meetingId);
      const notePayload = {
        id: `note-${Date.now()}`,
        meeting_id: meetingId,
        content,
        action_items: actionItems
      };

      if (idx >= 0) {
        (localDb as any).meetingNotes[idx] = notePayload;
      } else {
        (localDb as any).meetingNotes.push(notePayload);
      }

      await logMeetingActivity(meetingId, "MEETING_NOTES_SAVED", { contentSnippet: content.slice(0, 50) });
      return notePayload;
    }

    const { data: existingNote } = await supabase
      .from("meeting_notes")
      .select("id")
      .eq("meeting_id", meetingId)
      .maybeSingle();

    let result;
    if (existingNote) {
      const { data, error } = await supabase
        .from("meeting_notes")
        .update({
          content,
          action_items: actionItems,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingNote.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      result = data;
    } else {
      const { data, error } = await supabase
        .from("meeting_notes")
        .insert({
          meeting_id: meetingId,
          author_id: currentUserId,
          content,
          action_items: actionItems
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      result = data;
    }

    await logMeetingActivity(meetingId, "MEETING_NOTES_SAVED", { contentSnippet: content.slice(0, 50) });
    return result;
  },

  // C. SALES & CLOSINGS PIPELINE Flow
  async getClosingPipeline(): Promise<any[]> {
    if (isMockMode) {
      return (localDb as any).closingPipeline;
    }

    // In Supabase, if the pipeline table does not exist or is empty,
    // compile it dynamically from the clients and proposals databases!
    try {
      const { data: pipeline, error } = await supabase
        .from("closing_pipeline")
        .select("*, clients(company_name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (!pipeline || pipeline.length === 0) {
        // Fallback to seeder mock roster
        return (localDb as any).closingPipeline;
      }

      return pipeline.map(item => ({
        id: item.id,
        client: (item.clients as any)?.company_name || "Stark Labs",
        value: parseFloat(item.projected_revenue),
        stage: item.stage as PipelineStage,
        lastContact: "Just now"
      }));
    } catch (err: any) {
      console.warn("Pipeline database query failure, falling back to seeder: ", err.message);
      return (localDb as any).closingPipeline;
    }
  },

  async updateDealStage(dealId: string, stage: string, value?: number): Promise<any> {
    const cleanStage = stage as PipelineStage;

    if (isMockMode) {
      const deal = (localDb as any).closingPipeline.find((d: any) => d.id === dealId);
      if (deal) {
        deal.stage = cleanStage;
        if (value !== undefined) deal.value = value;
        deal.lastContact = "Just now";

        await triggerMeetingsNotification(
          "Deal Pipeline Update",
          `Deal for ${deal.client} advanced to stage: ${cleanStage}.`,
          "MEDIUM"
        );
      }
      return deal;
    }

    try {
      const { data, error } = await supabase
        .from("closing_pipeline")
        .update({
          stage: cleanStage,
          projected_revenue: value !== undefined ? value : undefined,
          updated_at: new Date().toISOString()
        })
        .eq("id", dealId)
        .select("*, clients(company_name)")
        .single();

      if (error) throw error;

      await triggerMeetingsNotification(
        "Deal Pipeline Update",
        `Deal for ${(data.clients as any)?.company_name || "Representative"} advanced to stage: ${cleanStage}.`,
        "MEDIUM"
      );

      return {
        id: data.id,
        client: (data.clients as any)?.company_name || "Client Name",
        value: parseFloat(data.projected_revenue),
        stage: data.stage as PipelineStage,
        lastContact: "Just now"
      };
    } catch (err) {
      // Graceful fallback for localDb updates when tables aren't deployed
      const deal = (localDb as any).closingPipeline.find((d: any) => d.id === dealId);
      if (deal) {
        deal.stage = cleanStage;
        if (value !== undefined) deal.value = value;
      }
      return deal;
    }
  },

  // D. FOLLOW-UP & REMINDER ACTIONS
  async getFollowUpTasks(): Promise<any[]> {
    if (isMockMode) {
      return (localDb as any).followUpTasks.map((t: any) => {
        const clientObj = localDb.clients.find(c => c.id === t.client_id);
        return {
          ...t,
          clientName: clientObj?.company || "Wayne Enterprises"
        };
      });
    }

    try {
      const { data, error } = await supabase
        .from("follow_up_tasks")
        .select("*, clients(company_name)")
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data.map(item => ({
        id: item.id,
        clientId: item.client_id,
        clientName: (item.clients as any)?.company_name || "Wayne Enterprises",
        title: item.title,
        due_date: item.due_date,
        is_completed: item.is_completed
      }));
    } catch (err) {
      return (localDb as any).followUpTasks.map((t: any) => {
        const clientObj = localDb.clients.find(c => c.id === t.client_id);
        return {
          ...t,
          clientName: clientObj?.company || "Wayne Enterprises"
        };
      });
    }
  },

  async createFollowUpTask(input: { clientId: string; title: string; dueDate: string }): Promise<any> {
    if (isMockMode) {
      const newTask = {
        id: `task-${Date.now()}`,
        client_id: input.clientId,
        title: input.title,
        due_date: new Date(input.dueDate).toISOString(),
        is_completed: false
      };
      (localDb as any).followUpTasks.unshift(newTask);
      return newTask;
    }

    try {
      const { data, error } = await supabase
        .from("follow_up_tasks")
        .insert({
          client_id: input.clientId,
          title: input.title,
          due_date: new Date(input.dueDate).toISOString(),
          is_completed: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const newTask = {
        id: `task-${Date.now()}`,
        client_id: input.clientId,
        title: input.title,
        due_date: new Date(input.dueDate).toISOString(),
        is_completed: false
      };
      (localDb as any).followUpTasks.unshift(newTask);
      return newTask;
    }
  }
};
