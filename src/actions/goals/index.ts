"use server";

import { GoalService } from "@/services/GoalService";
import { requireOperatorAuth } from "@/actions/auth";
import { goalSchema, goalProgressSchema, roadmapSchema } from "@/schemas/goals.schema";
import { ActionResult } from "@/actions/crm";
import { logger } from "@/lib/logger";
import { AuditService } from "@/services/AuditService";

export async function getGoalsAction() {
  try {
    return await GoalService.getGoals();
  } catch (error) {
    return [];
  }
}

export async function createGoalAction(input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const validated = goalSchema.parse(input);

    const goal = await GoalService.createGoal({
      owner_id: actor.id,
      objective: validated.objective,
      description: validated.description || undefined,
      time_horizon: validated.timeHorizon,
      progress: validated.progress,
      status: validated.status
    }, actor.id);

    await AuditService.log({
      userId: actor.id,
      action: "CREATE_GOAL",
      tableName: "goals",
      recordId: goal.id || "new"
    });
    logger.info("CRUD", "Goal created", { goalId: goal.id });

    return { success: true, data: goal };
  } catch (error: any) {
    logger.error("CRUD", "Failed to create objective", { input }, error);
    return { success: false, error: error.message || "Failed to create objective." };
  }
}

export async function updateGoalProgressAction(input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const validated = goalProgressSchema.parse(input);

    const goal = await GoalService.updateGoalProgress(validated.goalId, validated.progress, undefined, actor.id);
    
    await AuditService.logMutation(actor.id, "UPDATE_GOAL_PROGRESS", "goals", validated.goalId, undefined, { progress: validated.progress });
    logger.info("CRUD", "Goal progress updated", { goalId: validated.goalId, progress: validated.progress });

    return { success: true, data: goal };
  } catch (error: any) {
    logger.error("CRUD", "Failed to track goal progress", { input }, error);
    return { success: false, error: error.message || "Failed to track goal progress." };
  }
}

export async function createRoadmapItemAction(input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const validated = roadmapSchema.parse(input);

    const road = await GoalService.createRoadmapItem({
      goal_id: validated.goalId,
      title: validated.title,
      due_date: validated.dueDate,
      status: validated.status
    });

    await AuditService.log({
      userId: actor.id,
      action: "CREATE_ROADMAP_ITEM",
      tableName: "goal_roadmaps",
      recordId: road?.id || "new"
    });
    logger.info("CRUD", "Roadmap checkpoint added", { roadmapId: road?.id });

    return { success: true, data: road };
  } catch (error: any) {
    logger.error("CRUD", "Failed to add roadmap checkpoint", { input }, error);
    return { success: false, error: error.message || "Failed to add roadmap checkpoint." };
  }
}

export async function createExecutionTaskAction(goalId: string, title: string): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const task = await GoalService.createExecutionTask({
      goal_id: goalId,
      title,
      status: "PENDING"
    });
    
    await AuditService.log({
      userId: actor.id,
      action: "CREATE_EXECUTION_TASK",
      tableName: "execution_tasks",
      recordId: task?.id || "new"
    });
    logger.info("CRUD", "Execution task cataloged", { taskId: task?.id });

    return { success: true, data: task };
  } catch (error: any) {
    logger.error("CRUD", "Failed to catalog execution task", { goalId, title }, error);
    return { success: false, error: error.message || "Failed to catalog execution task." };
  }
}

export async function toggleExecutionTaskAction(taskId: string): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const task = await GoalService.toggleExecutionTask(taskId);
    
    await AuditService.logMutation(actor.id, "TOGGLE_EXECUTION_TASK", "execution_tasks", taskId);
    logger.info("CRUD", "Execution task toggled", { taskId });

    return { success: true, data: task };
  } catch (error: any) {
    logger.error("CRUD", "Failed to toggle execution task", { taskId }, error);
    return { success: false, error: error.message || "Failed to toggle execution task." };
  }
}
