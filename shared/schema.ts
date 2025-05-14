import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Thread model to store OpenAI thread IDs
export const threads = pgTable("threads", {
  id: serial("id").primaryKey(),
  threadId: text("thread_id").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
});

// Message model to store individual messages in threads
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  threadId: text("thread_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertThreadSchema = createInsertSchema(threads).pick({
  threadId: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  threadId: true,
  role: true,
  content: true,
});

export type InsertThread = z.infer<typeof insertThreadSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Thread = typeof threads.$inferSelect;
export type Message = typeof messages.$inferSelect;

// Request validation schemas
export const threadRequestSchema = z.object({});

export const messageRequestSchema = z.object({
  threadId: z.string().min(1, "Thread ID is required"),
  message: z.string().min(1, "Message is required"),
});
