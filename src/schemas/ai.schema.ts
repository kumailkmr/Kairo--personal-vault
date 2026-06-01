import { z } from "zod";

export const aiAgentSchema = z.object({
  name: z.string()
    .min(2, { message: "AI Agent name must contain at least 2 characters." })
    .max(80, { message: "AI Agent name must not exceed 80 characters." }),
  agentType: z.string()
    .min(2, { message: "Agent type must be specified." })
    .max(50, { message: "Agent type must not exceed 50 characters." }),
  description: z.string().optional().nullable(),
  status: z.enum(["active", "inactive", "running"]).default("inactive")
});

export const aiTaskSchema = z.object({
  agentId: z.string().uuid({ message: "Invalid agent relationship UUID." }),
  taskName: z.string()
    .min(2, { message: "Task name must contain at least 2 characters." }),
  inputParams: z.record(z.string(), z.any()).default({}),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM")
});

export type AIAgentInput = z.infer<typeof aiAgentSchema>;
export type AITaskInput = z.infer<typeof aiTaskSchema>;
