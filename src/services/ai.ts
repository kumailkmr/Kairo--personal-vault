import { AIWorkflow } from "@/types";

export interface AIService {
  triggerWorkflow: (workflowId: string) => Promise<{ success: boolean; durationMs: number }>;
  listActiveWorkflows: () => Promise<AIWorkflow[]>;
}

/**
 * Service to manage operational intelligence AI agents and LLM tasks.
 */
export const aiService: AIService = {
  triggerWorkflow: async (_workflowId) => {
    console.log(`[Mock] triggerWorkflow: ${_workflowId}`);
    return {
      success: true,
      durationMs: 1420 + Math.floor(Math.random() * 800),
    };
  },
  
  listActiveWorkflows: async () => {
    return [
      {
        id: "wf-1",
        name: "Client Revenue Forecasting model",
        status: "idle",
        successRate: 98.4,
        lastRun: "2 hours ago"
      },
      {
        id: "wf-2",
        name: "Daily Executive Meeting Brief summarization",
        status: "success",
        successRate: 99.1,
        lastRun: "34 mins ago"
      },
      {
        id: "wf-3",
        name: "Sentiment-based Lead Scoring analyzer",
        status: "running",
        successRate: 95.8,
        lastRun: "Just now"
      }
    ];
  }
};
