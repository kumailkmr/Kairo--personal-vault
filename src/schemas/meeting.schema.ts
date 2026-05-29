import { z } from "zod";

// Zod validation model for meeting scheduling, platform settings, and time bounds
export const meetingSchema = z.object({
  clientId: z.string().uuid({ message: "Invalid client relationship UUID." }).optional().nullable(),
  title: z.string()
    .min(3, { message: "Meeting title must contain at least 3 characters." })
    .max(120, { message: "Meeting title must not exceed 120 characters." }),
  description: z.string().optional(),
  platform: z.enum(["google_meet", "zoom", "teams", "slack", "phone", "in_person"]).default("google_meet"),
  platformLink: z.string()
    .url({ message: "Platform link must be a valid HTTPS URL." })
    .or(z.string().min(1, { message: "Platform location detail is required." })),
  startTime: z.string().datetime({ message: "Start time must be a valid ISO date-time string." }),
  endTime: z.string().datetime({ message: "End time must be a valid ISO date-time string." }),
  reminders: z.array(z.string().datetime()).default([])
}).refine(
  (data) => {
    const start = new Date(data.startTime).getTime();
    const end = new Date(data.endTime).getTime();
    return end > start;
  },
  {
    message: "Meeting end time must occur strictly after the start time.",
    path: ["endTime"]
  }
);

export type MeetingInput = z.infer<typeof meetingSchema>;
