import { z } from "zod";

// Zod validation model for Kairo OS client creation and updates
export const clientSchema = z.object({
  name: z.string()
    .min(2, { message: "Client name must contain at least 2 characters." })
    .max(80, { message: "Client name must not exceed 80 characters." }),
  company: z.string()
    .min(1, { message: "Company name cannot be empty." })
    .max(100, { message: "Company name must not exceed 100 characters." }),
  email: z.string()
    .email({ message: "Invalid email address format." }),
  phone: z.string()
    .min(5, { message: "Valid phone number token is required." }),
  status: z.enum(["active", "inactive", "onboarding"]),
  revenue: z.number()
    .nonnegative({ message: "Retainer revenue must be a positive number." })
    .default(0),
  tags: z.array(z.string()).default([])
});

export type ClientInput = z.infer<typeof clientSchema>;
