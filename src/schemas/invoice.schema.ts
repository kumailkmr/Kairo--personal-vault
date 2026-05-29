import { z } from "zod";

// Zod validation model for invoice items
export const invoiceItemSchema = z.object({
  description: z.string()
    .min(1, { message: "Item description cannot be empty." })
    .max(250, { message: "Item description must not exceed 250 characters." }),
  quantity: z.number()
    .int({ message: "Quantity must be an integer." })
    .positive({ message: "Quantity must be greater than zero." })
    .default(1),
  unitPrice: z.number()
    .nonnegative({ message: "Unit price must be a positive number or zero." })
});

// Zod validation model for invoices
export const invoiceSchema = z.object({
  clientId: z.string().uuid({ message: "Invalid client relationship UUID." }),
  projectId: z.string().uuid({ message: "Invalid project relationship UUID." }).optional().nullable(),
  invoiceNumber: z.string()
    .min(3, { message: "Invoice number is required." })
    .max(50, { message: "Invoice number must not exceed 50 characters." }),
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "VOID"]).default("DRAFT"),
  tax: z.number()
    .nonnegative({ message: "Tax must be a positive number or zero." })
    .default(0),
  issueDate: z.string().datetime({ message: "Issue date must be a valid ISO date-time string." }),
  dueDate: z.string().datetime({ message: "Due date must be a valid ISO date-time string." }),
  items: z.array(invoiceItemSchema)
    .min(1, { message: "An invoice must contain at least one billing item." })
}).refine(
  (data) => {
    const issue = new Date(data.issueDate).getTime();
    const due = new Date(data.dueDate).getTime();
    return due >= issue;
  },
  {
    message: "Invoice due date must not precede the issue date.",
    path: ["dueDate"]
  }
);

export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
