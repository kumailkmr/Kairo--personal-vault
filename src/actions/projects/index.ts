"use server";

import { ProjectService } from "@/services/ProjectService";
import { ProjectRepository } from "@/repositories/ProjectRepository";
import { requireOperatorAuth } from "@/actions/auth";
import { projectSchema, projectMilestoneSchema, projectTaskSchema } from "@/schemas/project.schema";
import { ActionResult } from "@/actions/crm";
import { logger } from "@/lib/logger";
import { AuditService } from "@/services/AuditService";

export async function createProjectAction(input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    
    const validated = projectSchema.parse(input);

    const project = await ProjectService.createProject({
      client_id: validated.clientId,
      name: validated.name,
      description: validated.description || "",
      status: validated.status,
      progress: validated.progress,
      budget: validated.budget,
      due_date: validated.dueDate
    }, actor.id);

    await AuditService.log({
      userId: actor.id,
      action: "CREATE_PROJECT",
      tableName: "projects",
      recordId: project.id || "new"
    });
    logger.info("CRUD", "Project created", { projectId: project.id });

    return { success: true, data: project };
  } catch (error: any) {
    logger.error("CRUD", "Failed to create project", { input }, error);
    return { success: false, error: error.message || "Failed to create project." };
  }
}

export async function updateProjectAction(id: string, input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const validated = projectSchema.partial().parse(input);

    const projectPayload: any = {};
    if (validated.clientId) projectPayload.client_id = validated.clientId;
    if (validated.name) projectPayload.name = validated.name;
    if (validated.description !== undefined) projectPayload.description = validated.description;
    if (validated.status) projectPayload.status = validated.status;
    if (validated.progress !== undefined) projectPayload.progress = validated.progress;
    if (validated.budget !== undefined) projectPayload.budget = validated.budget;
    if (validated.dueDate) projectPayload.due_date = validated.dueDate;

    const project = await ProjectService.updateProject(id, projectPayload, actor.id);
    
    await AuditService.logMutation(actor.id, "UPDATE_PROJECT", "projects", id, undefined, projectPayload);
    logger.info("CRUD", "Project updated", { projectId: id });

    return { success: true, data: project };
  } catch (error: any) {
    logger.error("CRUD", "Failed to update project", { projectId: id }, error);
    return { success: false, error: error.message || "Failed to update project." };
  }
}

export async function deleteProjectAction(id: string): Promise<ActionResult<boolean>> {
  try {
    const actor = await requireOperatorAuth();
    await ProjectService.deleteProject(id, actor.id);
    
    await AuditService.log({
      userId: actor.id,
      action: "DELETE_PROJECT",
      tableName: "projects",
      recordId: id,
      severity: "WARNING"
    });
    logger.info("CRUD", "Project deleted", { projectId: id });

    return { success: true, data: true };
  } catch (error: any) {
    logger.error("CRUD", "Failed to delete project", { projectId: id }, error);
    return { success: false, error: error.message || "Failed to delete project." };
  }
}

// Milestones
export async function createMilestoneAction(projectId: string, input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const validated = projectMilestoneSchema.parse(input);

    const milestone = await ProjectRepository.createMilestone({
      project_id: projectId,
      title: validated.title,
      description: validated.description || "",
      target_date: validated.targetDate,
      status: validated.status
    });

    await AuditService.log({
      userId: actor.id,
      action: "CREATE_MILESTONE",
      tableName: "project_milestones",
      recordId: milestone?.id || "new"
    });
    logger.info("CRUD", "Milestone created", { milestoneId: milestone?.id });

    return { success: true, data: milestone };
  } catch (error: any) {
    logger.error("CRUD", "Failed to create milestone", { projectId }, error);
    return { success: false, error: error.message || "Failed to create milestone." };
  }
}

export async function completeMilestoneAction(id: string): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const milestone = await ProjectRepository.updateMilestone(id, { status: "COMPLETED" });
    
    await AuditService.logMutation(actor.id, "COMPLETE_MILESTONE", "project_milestones", id);
    logger.info("CRUD", "Milestone completed", { milestoneId: id });

    return { success: true, data: milestone };
  } catch (error: any) {
    logger.error("CRUD", "Failed to complete milestone", { milestoneId: id }, error);
    return { success: false, error: error.message || "Failed to complete milestone." };
  }
}

// Tasks
export async function createTaskAction(projectId: string, input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const validated = projectTaskSchema.parse(input);

    const task = await ProjectService.createTask(projectId, {
      milestone_id: validated.milestoneId,
      assignee_id: validated.assigneeId,
      title: validated.title,
      description: validated.description || "",
      due_date: validated.dueDate,
      status: validated.status,
      priority: validated.priority
    }, actor.id);

    await AuditService.log({
      userId: actor.id,
      action: "CREATE_TASK",
      tableName: "project_tasks",
      recordId: task.id || "new"
    });
    logger.info("CRUD", "Task created", { taskId: task.id });

    return { success: true, data: task };
  } catch (error: any) {
    logger.error("CRUD", "Failed to create task", { projectId }, error);
    return { success: false, error: error.message || "Failed to create task." };
  }
}

export async function updateTaskAction(projectId: string, taskId: string, input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const validated = projectTaskSchema.partial().parse(input);

    const task = await ProjectService.updateTask(projectId, taskId, {
      milestone_id: validated.milestoneId,
      assignee_id: validated.assigneeId,
      title: validated.title,
      description: validated.description,
      due_date: validated.dueDate,
      status: validated.status,
      priority: validated.priority
    }, actor.id);

    await AuditService.logMutation(actor.id, "UPDATE_TASK", "project_tasks", taskId);
    logger.info("CRUD", "Task updated", { taskId });

    return { success: true, data: task };
  } catch (error: any) {
    logger.error("CRUD", "Failed to update task", { taskId }, error);
    return { success: false, error: error.message || "Failed to update task." };
  }
}

export async function deleteTaskAction(projectId: string, taskId: string): Promise<ActionResult<boolean>> {
  try {
    const actor = await requireOperatorAuth();
    await ProjectRepository.deleteTask(taskId);
    
    // Recalculate progress dynamically
    await ProjectService.calculateAndSyncProjectProgress(projectId);

    await AuditService.log({
      userId: actor.id,
      action: "DELETE_TASK",
      tableName: "project_tasks",
      recordId: taskId,
      severity: "WARNING"
    });
    logger.info("CRUD", "Task deleted", { taskId });

    return { success: true, data: true };
  } catch (error: any) {
    logger.error("CRUD", "Failed to delete task", { taskId }, error);
    return { success: false, error: error.message || "Failed to delete task." };
  }
}
