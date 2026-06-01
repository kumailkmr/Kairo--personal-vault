import { z } from "zod";

export const goalSchema = z.object({
  objective: z.string()
    .min(2, { message: "Objective must be at least 2 characters." })
    .max(200, { message: "Objective must not exceed 200 characters." }),
  description: z.string().optional().nullable(),
  timeHorizon: z.string()
    .min(1, { message: "Time horizon cannot be empty." })
    .max(50, { message: "Time horizon must not exceed 50 characters." }),
  progress: z.number()
    .min(0, { message: "Progress percentage cannot be less than 0." })
    .max(100, { message: "Progress percentage cannot exceed 100." })
    .default(0),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).default("PENDING")
});

export const goalProgressSchema = z.object({
  goalId: z.string().uuid({ message: "Invalid goal ID." }),
  progress: z.number()
    .min(0, { message: "Progress percentage cannot be less than 0." })
    .max(100, { message: "Progress percentage cannot exceed 100." }),
  notes: z.string().optional().nullable()
});

export const roadmapSchema = z.object({
  goalId: z.string().uuid({ message: "Invalid goal ID." }),
  title: z.string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(100, { message: "Title must not exceed 100 characters." }),
  dueDate: z.string().datetime({ message: "Due date must be a valid ISO date-time string." }),
  status: z.enum(["PENDING", "COMPLETED"]).default("PENDING")
});

export type GoalInput = z.infer<typeof goalSchema>;
export type GoalProgressInput = z.infer<typeof goalProgressSchema>;
export type RoadmapInput = z.infer<typeof roadmapSchema>;
