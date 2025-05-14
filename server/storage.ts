import { messages, threads, type InsertThread, type InsertMessage, type Thread, type Message } from "@shared/schema";

export interface IStorage {
  createThread(data: InsertThread): Promise<Thread>;
  getThreadById(threadId: string): Promise<Thread | undefined>;
  createMessage(data: InsertMessage): Promise<Message>;
  getMessagesByThreadId(threadId: string): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private threads: Map<string, Thread>;
  private messages: Map<number, Message>;
  private threadIdCounter: number;
  private messageIdCounter: number;

  constructor() {
    this.threads = new Map();
    this.messages = new Map();
    this.threadIdCounter = 1;
    this.messageIdCounter = 1;
  }

  async createThread(data: InsertThread): Promise<Thread> {
    const id = this.threadIdCounter++;
    const now = new Date();
    const thread: Thread = {
      id,
      threadId: data.threadId,
      createdAt: now,
      lastMessageAt: now,
    };
    this.threads.set(data.threadId, thread);
    return thread;
  }

  async getThreadById(threadId: string): Promise<Thread | undefined> {
    return this.threads.get(threadId);
  }

  async createMessage(data: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const now = new Date();
    const message: Message = {
      id,
      threadId: data.threadId,
      role: data.role,
      content: data.content,
      createdAt: now,
    };
    this.messages.set(id, message);
    
    // Update thread's lastMessageAt
    const thread = this.threads.get(data.threadId);
    if (thread) {
      thread.lastMessageAt = now;
      this.threads.set(data.threadId, thread);
    }
    
    return message;
  }

  async getMessagesByThreadId(threadId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.threadId === threadId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

export const storage = new MemStorage();
