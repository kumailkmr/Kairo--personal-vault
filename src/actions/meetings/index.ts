"use server";

import { MeetingService } from "@/services/MeetingService";
import { requireOperatorAuth } from "@/actions/auth";
import { meetingSchema } from "@/schemas/meeting.schema";
import { ActionResult } from "@/actions/crm";
import { logger } from "@/lib/logger";
import { AuditService } from "@/services/AuditService";

export async function createMeetingAction(input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    
    const validated = meetingSchema.parse(input);

    const meeting = await MeetingService.createMeeting({
      client_id: validated.clientId || undefined,
      title: validated.title,
      description: validated.description || "",
      platform: validated.platform,
      platform_link: validated.platformLink,
      start_time: validated.startTime,
      end_time: validated.endTime
    }, actor.id);

    await AuditService.log({
      userId: actor.id,
      action: "CREATE_MEETING",
      tableName: "meetings",
      recordId: meeting.id || "new"
    });
    logger.info("MEETING", "Meeting scheduled", { meetingId: meeting.id });

    return { success: true, data: meeting };
  } catch (error: any) {
    logger.error("MEETING", "Failed to schedule meeting", { input }, error);
    return { success: false, error: error.message || "Failed to schedule meeting." };
  }
}

export async function updateMeetingAction(id: string, input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const validated = meetingSchema.partial().parse(input);

    const meetingPayload: any = {};
    if (validated.clientId) meetingPayload.client_id = validated.clientId;
    if (validated.title) meetingPayload.title = validated.title;
    if (validated.description !== undefined) meetingPayload.description = validated.description;
    if (validated.platform) meetingPayload.platform = validated.platform;
    if (validated.platformLink) meetingPayload.platform_link = validated.platformLink;
    if (validated.startTime) meetingPayload.start_time = validated.startTime;
    if (validated.endTime) meetingPayload.end_time = validated.endTime;

    const meeting = await MeetingService.updateMeeting(id, meetingPayload, actor.id);
    
    await AuditService.logMutation(actor.id, "UPDATE_MEETING", "meetings", id, undefined, meetingPayload);
    logger.info("MEETING", "Meeting updated", { meetingId: id });

    return { success: true, data: meeting };
  } catch (error: any) {
    logger.error("MEETING", "Failed to update meeting", { meetingId: id }, error);
    return { success: false, error: error.message || "Failed to update meeting details." };
  }
}

export async function deleteMeetingAction(id: string): Promise<ActionResult<boolean>> {
  try {
    const actor = await requireOperatorAuth();
    await MeetingService.deleteMeeting(id, actor.id);
    
    await AuditService.log({
      userId: actor.id,
      action: "DELETE_MEETING",
      tableName: "meetings",
      recordId: id,
      severity: "WARNING"
    });
    logger.info("MEETING", "Meeting cancelled", { meetingId: id });

    return { success: true, data: true };
  } catch (error: any) {
    logger.error("MEETING", "Failed to cancel meeting", { meetingId: id }, error);
    return { success: false, error: error.message || "Failed to cancel meeting." };
  }
}

export async function saveMeetingNotesAction(meetingId: string, content: string, actionItems: string[]): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const notes = await MeetingService.saveMeetingNotes(meetingId, content, actionItems, actor.id);
    
    await AuditService.log({
      userId: actor.id,
      action: "SAVE_MEETING_NOTES",
      tableName: "meeting_notes",
      recordId: notes.id || "new"
    });
    logger.info("MEETING", "Meeting notes saved", { meetingId });

    return { success: true, data: notes };
  } catch (error: any) {
    logger.error("MEETING", "Failed to save meeting notes", { meetingId }, error);
    return { success: false, error: error.message || "Failed to save meeting notes." };
  }
}

export async function updateDealStageAction(dealId: string, stage: string): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const deal = await MeetingService.updateDealStage(dealId, stage, actor.id);
    
    await AuditService.logMutation(actor.id, "UPDATE_DEAL_STAGE", "deals", dealId, undefined, { stage });
    logger.info("MEETING", "Deal stage updated", { dealId, stage });

    return { success: true, data: deal };
  } catch (error: any) {
    logger.error("MEETING", "Failed to update deal pipeline stage", { dealId }, error);
    return { success: false, error: error.message || "Failed to update deal pipeline stage." };
  }
}

export async function createFollowUpTaskAction(input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const task = await MeetingService.createFollowUpTask(input);
    
    await AuditService.log({
      userId: actor.id,
      action: "CREATE_FOLLOW_UP_TASK",
      tableName: "meeting_follow_ups",
      recordId: task.id || "new"
    });
    logger.info("MEETING", "Follow-up task created", { taskId: task.id });

    return { success: true, data: task };
  } catch (error: any) {
    logger.error("MEETING", "Failed to create follow-up task", { input }, error);
    return { success: false, error: error.message || "Failed to create follow-up task." };
  }
}

export async function toggleFollowUpTaskAction(taskId: string): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const task = await MeetingService.toggleFollowUpTask(taskId);
    
    await AuditService.logMutation(actor.id, "TOGGLE_FOLLOW_UP_TASK", "meeting_follow_ups", taskId);
    logger.info("MEETING", "Follow-up task toggled", { taskId });

    return { success: true, data: task };
  } catch (error: any) {
    logger.error("MEETING", "Failed to toggle task completion status", { taskId }, error);
    return { success: false, error: error.message || "Failed to toggle task completion status." };
  }
}
