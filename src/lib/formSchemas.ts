import { z } from "zod";

export const invoiceSchema = z.object({
  clientName: z.string().trim().min(1, "Client name is required").max(100, "Client name must be less than 100 characters"),
  clientEmail: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  providerName: z.string().trim().max(100, "Business name must be less than 100 characters").optional(),
  providerEmail: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters").optional().or(z.literal("")),
  providerAddress: z.string().trim().max(500, "Address must be less than 500 characters").optional(),
  invoiceNumber: z.string().trim().min(1, "Invoice number is required").max(50, "Invoice number must be less than 50 characters"),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().max(2000, "Notes must be less than 2000 characters").optional(),
  items: z.array(z.object({
    description: z.string().trim().min(1, "Item description is required").max(500, "Description must be less than 500 characters"),
    quantity: z.number().int().positive("Quantity must be positive").max(999999, "Quantity is too large"),
    rate: z.number().nonnegative("Rate must be non-negative").max(999999999, "Rate is too large"),
  })).min(1, "At least one item is required"),
});

export const quoteSchema = z.object({
  clientName: z.string().trim().min(1, "Client name is required").max(100, "Client name must be less than 100 characters"),
  clientEmail: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  providerName: z.string().trim().max(100, "Business name must be less than 100 characters").optional(),
  providerEmail: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters").optional().or(z.literal("")),
  providerAddress: z.string().trim().max(500, "Address must be less than 500 characters").optional(),
  title: z.string().trim().min(1, "Quote title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
  items: z.array(z.object({
    description: z.string().trim().min(1, "Item description is required").max(500, "Description must be less than 500 characters"),
    quantity: z.number().int().positive("Quantity must be positive").max(999999, "Quantity is too large"),
    rate: z.number().nonnegative("Rate must be non-negative").max(999999999, "Rate is too large"),
  })).min(1, "At least one item is required"),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type QuoteFormData = z.infer<typeof quoteSchema>;
