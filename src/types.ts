import { z } from "zod";

export const ContentSchema = z.object({
  text: z.string().optional(),
  visual: z.record(z.any()).optional(),
  sources: z.array(z.string()).optional(),
});

export type Content = z.infer<typeof ContentSchema>;

export const UniversalMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: ContentSchema,
});
export type UniversalMessage = z.infer<typeof UniversalMessageSchema>;

export const EntrySchema = z.object({
  id: z.number().optional(),
  entryId: z.string().uuid(),
  threadId: z.string().uuid(),
  category: z.enum(["request", "response"]),
  data: UniversalMessageSchema,
  createdAt: z.string().datetime(),
});
export type Entry = z.infer<typeof EntrySchema>;

export const ThreadSchema = z.object({
  id: z.number().optional(),
  threadId: z.string().uuid(),
  userId: z.string(),
  createdAt: z.string().datetime(),
  entries: z.array(EntrySchema),
});
export type Thread = z.infer<typeof ThreadSchema>;

// Request payload for POST /threads
export const ThreadRequestSchema = z.object({
  threadId: z.string().uuid().optional(),
  userId: z.string(),
  message: UniversalMessageSchema,
});
export type ThreadRequest = z.infer<typeof ThreadRequestSchema>;

// User schemas
export const UserSchema = z.object({
  id: z.number().optional(),
  userId: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
});
export type User = z.infer<typeof UserSchema>;

// Feedback schemas
export const FeedbackSchema = z.object({
  id: z.number().optional(),
  feedbackId: z.string().uuid(),
  entryId: z.string().uuid(),
  threadId: z.string().uuid(),
  userId: z.string(),
  rating: z.enum(["thumbs_up", "thumbs_down"]),
  comment: z.string().optional(),
  createdAt: z.string().datetime(),
});
export type Feedback = z.infer<typeof FeedbackSchema>;

// Request payload for POST /feedback
export const FeedbackRequestSchema = z.object({
  entryId: z.string().uuid(),
  threadId: z.string().uuid(),
  userId: z.string(),
  rating: z.enum(["thumbs_up", "thumbs_down"]),
  comment: z.string().optional(),
});
export type FeedbackRequest = z.infer<typeof FeedbackRequestSchema>;

// OpenAPI Item alias (role + content) to match spec
export const ItemSchema = UniversalMessageSchema;
export type Item = UniversalMessage;
