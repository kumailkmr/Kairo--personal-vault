import { MeetingRepository, DBMeetingData } from "@/repositories/MeetingRepository";
import { CRMRepository } from "@/repositories/CRMRepository";
import { NotificationRepository } from "@/repositories/NotificationRepository";
import { logger } from "@/lib/logger";

export const MeetingService = {
  async getMeetings() {
    return await MeetingRepository.getMeetings();
  },

  async createMeeting(data: DBMeetingData & { id?: string }, creatorId: string) {
    const meeting = await MeetingRepository.createMeeting(data);

    // 1. Log CRM activity
    if (data.client_id) {
      await CRMRepository.logActivity(
        data.client_id,
        "MEETING_SCHEDULED",
        { title: data.title, date: data.start_time },
        creatorId
      );
    }

    // 2. Trigger notification
    await NotificationRepository.createNotification({
      user_id: creatorId,
      title: "Executive Session Scheduled",
      message: `Calendar invite registered for '${data.title}' starting ${new Date(data.start_time).toLocaleString()}.`,
      priority: "MEDIUM",
      is_read: false
    });

    return meeting;
  },

  async updateMeeting(id: string, data: Partial<DBMeetingData>, modifierId: string) {
    const meeting = await MeetingRepository.updateMeeting(id, data);

    if (data.start_time) {
      await NotificationRepository.createNotification({
        user_id: modifierId,
        title: "Session Rescheduled",
        message: `Meeting '${meeting.title}' has been moved to ${new Date(data.start_time).toLocaleString()}.`,
        priority: "HIGH",
        is_read: false
      });
    }

    return meeting;
  },

  async deleteMeeting(id: string, operatorId: string) {
    await MeetingRepository.deleteMeeting(id);
    return true;
  },

  // Save notes + automatically generate critical follow-up tasks for each action item
  async saveMeetingNotes(meetingId: string, content: string, actionItems: string[], authorId: string) {
    // 1. Save notes
    const notes = await MeetingRepository.saveMeetingNotes(meetingId, content, actionItems, authorId);

    // 2. Log activity
    await NotificationRepository.createNotification({
      user_id: authorId,
      title: "Meeting Debrief Compiled",
      message: `Action points and debrief notes saved successfully.`,
      priority: "LOW",
      is_read: false
    });

    // 3. For each action item, automatically provision a follow-up task
    // First, let's find the client_id for this meeting
    const meetings = await MeetingRepository.getMeetings();
    const currentMeeting = meetings.find((m: any) => m.id === meetingId);
    
    if (currentMeeting && (currentMeeting as any).client_id) {
      const clientId = (currentMeeting as any).client_id;
      
      for (const item of actionItems) {
        try {
          await MeetingRepository.createFollowUpTask({
            client_id: clientId,
            title: `[Follow-Up] ${item}`,
            due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Default 3 days deadline
            is_completed: false
          });
          logger.info("MEETING", `Provisioned follow-up task: ${item}`);
        } catch (err: any) {
          logger.error("MEETING", "Failed to automatically spawn follow-up task:", err);
        }
      }
    }

    return notes;
  },

  async getClosingPipeline() {
    return await MeetingRepository.getClosingPipeline();
  },

  async updateDealStage(dealId: string, stage: string, operatorId: string) {
    const deal = await MeetingRepository.updateDealStage(dealId, stage);

    await NotificationRepository.createNotification({
      user_id: operatorId,
      title: "Pipeline Transaction update",
      message: `Deal status updated to '${stage}'.`,
      priority: "MEDIUM",
      is_read: false
    });

    return deal;
  },

  async getFollowUpTasks() {
    return await MeetingRepository.getFollowUpTasks();
  },

  async createFollowUpTask(data: any) {
    return await MeetingRepository.createFollowUpTask(data);
  },

  async toggleFollowUpTask(taskId: string) {
    return await MeetingRepository.toggleFollowUpTask(taskId);
  }
};
