import { z } from "zod";

// Zod validation model for public client onboarding requests / leads
export const onboardingRequestSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must not exceed 100 characters." }),
  company: z.string()
    .min(2, { message: "Company name must be at least 2 characters." })
    .max(100, { message: "Company name must not exceed 100 characters." }),
  email: z.string()
    .email({ message: "Invalid email format." }),
  phone: z.string()
    .min(5, { message: "Phone number is too short." })
    .optional()
    .nullable()
    .or(z.literal("")),
  projectType: z.string()
    .min(2, { message: "Project type description is required." }),
  budgetRange: z.string()
    .min(2, { message: "Budget range is required." }),
  goals: z.string()
    .min(10, { message: "Strategic goals must be at least 10 characters." }),
  notes: z.string()
    .max(1000, { message: "Notes must not exceed 1000 characters." })
    .optional()
    .nullable()
    .or(z.literal("")),
  status: z.enum(["PENDING", "UNDER_REVIEW", "ACCEPTED", "DECLINED", "pending", "under_review", "accepted", "declined"]).default("PENDING")
});

// Zod validation model for communication timeline events
export const communicationLogSchema = z.object({
  clientId: z.string().uuid({ message: "Invalid client relationship UUID." }).optional().nullable(),
  channel: z.enum(["whatsapp", "email", "slack", "automated"]),
  direction: z.enum(["inbound", "outbound"]),
  subject: z.string().max(250, { message: "Subject is too long." }).optional().nullable(),
  body: z.string().min(1, { message: "Message body cannot be empty." }),
  status: z.enum(["sent", "delivered", "read", "failed", "bounce", "opened"]).default("sent")
});

export type OnboardingRequestInput = z.infer<typeof onboardingRequestSchema>;
export type CommunicationLogInput = z.infer<typeof communicationLogSchema>;
