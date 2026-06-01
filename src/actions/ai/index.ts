"use server";

import { AIRepository } from "@/repositories/AIRepository";
import { requireOperatorAuth } from "@/actions/auth";
import { aiAgentSchema } from "@/schemas/ai.schema";
import { ActionResult } from "@/actions/crm";
import { logger } from "@/lib/logger";
import { AuditService } from "@/services/AuditService";

export async function createAIAgentAction(input: any): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    const validated = aiAgentSchema.parse(input);

    const agent = await AIRepository.createAIAgent({
      name: validated.name,
      agent_type: validated.agentType,
      description: validated.description || undefined,
      status: validated.status,
      success_rate: 100.0
    });

    await AuditService.log({
      userId: actor.id,
      action: "CREATE_AI_AGENT",
      tableName: "ai_agents",
      recordId: agent?.id || "new"
    });
    logger.info("AI", "AI agent provisioned", { agentId: agent?.id });

    return { success: true, data: agent };
  } catch (error: any) {
    logger.error("AI", "Failed to provision AI agent", { input }, error);
    return { success: false, error: error.message || "Failed to provision AI agent." };
  }
}

export async function runWorkflowAction(workflowId: string): Promise<ActionResult<any>> {
  try {
    const actor = await requireOperatorAuth();
    
    // Simulate Edge run time
    const startTime = Date.now();
    const isSuccess = Math.random() > 0.05; // 95% success rate simulation
    
    const runTime = Math.floor(Math.random() * 400) + 100; // 100-500ms

    const run = await AIRepository.createWorkflowRun({
      workflow_id: workflowId,
      status: isSuccess ? "success" : "failed",
      execution_time_ms: runTime,
      metadata: { trigger: "operator_manual_click" }
    });

    await AuditService.log({
      userId: actor.id,
      action: "RUN_WORKFLOW",
      tableName: "workflow_runs",
      recordId: run?.id || "new"
    });
    logger.info("AI", "Workflow executed", { workflowId, status: isSuccess ? "success" : "failed" });

    return { success: true, data: run };
  } catch (error: any) {
    logger.error("AI", "Failed to execute workflow", { workflowId }, error);
    return { success: false, error: error.message || "Failed to execute workflow." };
  }
}
