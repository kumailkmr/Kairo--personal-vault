import { z } from "zod";

// Zod validation model for proposal generation inputs
export const proposalSchema = z.object({
  clientId: z.string().uuid({ message: "Invalid client relationship UUID." }),
  projectName: z.string()
    .min(3, { message: "Project name is required (min 3 characters)." })
    .max(100, { message: "Project name must not exceed 100 characters." }),
  summary: z.string()
    .min(10, { message: "Executive summary must be at least 10 characters." }),
  deliverables: z.array(z.string().min(1, { message: "Deliverable description cannot be empty." }))
    .min(1, { message: "Provide at least one deliverable." }),
  price: z.number()
    .positive({ message: "Pricing structure must have a positive amount." })
});

// Zod validation model for contract/agreement generation inputs
export const contractSchema = z.object({
  clientId: z.string().uuid({ message: "Invalid client relationship UUID." }),
  type: z.enum(["MSA", "NDA", "SOW", "SLA", "Contract"]),
  governingLaw: z.string().default("Delaware"),
  confidentialityPeriod: z.string().optional().default("5 years"),
  liquidatedDamages: z.string().optional(),
  clauses: z.array(z.string()).min(1, { message: "Legal document must select at least one active clause." })
});

// Zod validation model for generic documents
export const documentSchema = z.object({
  clientId: z.string().uuid({ message: "Invalid client relationship UUID." }).optional().nullable(),
  fileName: z.string().min(1, { message: "File name is required." }),
  filePath: z.string().min(1, { message: "Storage file path is required." }),
  fileHash: z.string().optional(),
  docType: z.enum(["proposal", "contract", "sow", "nda", "onboarding", "invoice", "template"]),
  status: z.enum(["DRAFT", "SENT", "SIGNED", "COMPLETED", "VOID", "ARCHIVED", "ACTIVE", "IN_REVIEW"]).default("DRAFT")
});

export type ProposalInput = z.infer<typeof proposalSchema>;
export type ContractInput = z.infer<typeof contractSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
