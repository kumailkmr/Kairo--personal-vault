import { z } from "zod";

// Zod validation model for project milestones
export const projectMilestoneSchema = z.object({
  title: z.string()
    .min(2, { message: "Milestone title must be at least 2 characters." })
    .max(100, { message: "Milestone title must not exceed 100 characters." }),
  description: z.string().optional(),
  targetDate: z.string().datetime({ message: "Invalid ISO date-time string." }),
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED"]).default("PENDING")
});

// Zod validation model for project tasks
export const projectTaskSchema = z.object({
  title: z.string()
    .min(2, { message: "Task title must be at least 2 characters." })
    .max(120, { message: "Task title must not exceed 120 characters." }),
  description: z.string().optional(),
  dueDate: z.string().datetime({ message: "Invalid ISO date-time string." }).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  assigneeId: z.string().uuid({ message: "Invalid assignee user ID." }).optional(),
  milestoneId: z.string().uuid({ message: "Invalid milestone relationship UUID." }).optional()
});

// Master validation model for project creation and updates
export const projectSchema = z.object({
  clientId: z.string().uuid({ message: "Invalid client relationship UUID." }),
  name: z.string()
    .min(2, { message: "Project name must be at least 2 characters." })
    .max(100, { message: "Project name must not exceed 100 characters." }),
  description: z.string().optional(),
  status: z.enum(["PLANNING", "IN_PROGRESS", "REVIEW", "COMPLETED", "ARCHIVED"]).default("PLANNING"),
  progress: z.number()
    .min(0, { message: "Progress percentage cannot be less than 0." })
    .max(100, { message: "Progress percentage cannot exceed 100." })
    .default(0),
  budget: z.number()
    .nonnegative({ message: "Budget amount must be a positive number." })
    .default(0),
  dueDate: z.string().datetime({ message: "Due date must be a valid ISO date-time string." }),
  milestones: z.array(projectMilestoneSchema).default([]),
  tasks: z.array(projectTaskSchema).default([])
});

export type ProjectMilestoneInput = z.infer<typeof projectMilestoneSchema>;
export type ProjectTaskInput = z.infer<typeof projectTaskSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
