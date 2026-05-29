import { z } from "zod";

// Zod validation model for public project proposals submitted via InquiryModal
export const requestSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must contain at least 2 characters." })
    .max(100),
  company: z.string()
    .min(1, { message: "Company name cannot be left blank." }),
  email: z.string()
    .email({ message: "Invalid email address pattern." }),
  phone: z.string()
    .min(6, { message: "WhatsApp verification number is required." }),
  projectType: z.enum([
    "Custom SaaS Dashboard", 
    "Internal Operations System", 
    "AI Automation Workspace", 
    "Mobile Application", 
    "Other"
  ], {
    error: "Please select a valid project classification."
  }),
  budgetRange: z.enum([
    "$10,000 - $25,000", 
    "$25,000 - $50,000", 
    "$50,000+"
  ], {
    error: "Please select a valid budget bracket."
  }),
  goals: z.string()
    .min(10, { message: "Project goals description must be at least 10 characters." }),
  notes: z.string().optional()
});

export type RequestInput = z.infer<typeof requestSchema>;
