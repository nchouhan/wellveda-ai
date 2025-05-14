import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { messageRequestSchema, threadRequestSchema } from "@shared/schema";
import OpenAI from "openai";

const ASSISTANT_ID = "asst_NXGBmeSbyaBdsWNjGzSG467R";

// Initialize OpenAI with API key from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  
  // Create a new thread
  app.post("/api/chat/thread", async (req, res) => {
    try {
      // Validate request
      const parseResult = threadRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: parseResult.error.message,
          errorCode: "INVALID_REQUEST"
        });
      }
      
      // Create a thread with OpenAI
      let threadId;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          const thread = await openai.beta.threads.create();
          threadId = thread.id;
          break;
        } catch (threadError) {
          retryCount++;
          if (retryCount > maxRetries) {
            throw threadError;
          }
          // Wait briefly before retrying
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      if (!threadId) {
        throw new Error("Failed to create thread after multiple attempts");
      }
      
      // Store thread ID
      await storage.createThread({ threadId });
      
      return res.json({ 
        threadId,
        success: true
      });
    } catch (error) {
      console.error("Error creating thread:", error);
      return res.status(500).json({ 
        error: "Failed to create thread",
        errorCode: "THREAD_CREATION_FAILED" 
      });
    }
  });
  
  // Send a message and get a response
  app.post("/api/chat/message", async (req, res) => {
    try {
      // Validate request
      const parseResult = messageRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: parseResult.error.message,
          errorCode: "INVALID_REQUEST"
        });
      }
      
      const { threadId, message } = parseResult.data;
      
      // Verify the thread exists first
      try {
        await openai.beta.threads.retrieve(threadId);
      } catch (threadError) {
        console.error(`Thread with ID ${threadId} not found:`, threadError);
        return res.status(404).json({ 
          error: "Thread not found. A new conversation should be created.",
          errorCode: "THREAD_NOT_FOUND"
        });
      }
      
      // Add message to thread
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message,
      });
      
      // Store the user message
      await storage.createMessage({
        threadId,
        role: "user",
        content: message,
      });
      
      // Create a run with the assistant
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: ASSISTANT_ID,
      });
      
      // Poll for the run completion
      let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      
      // Simple timeout to prevent infinite loops
      let attempts = 0;
      const maxAttempts = 30; // 30 attempts with 1-second delay = 30 seconds max
      
      while (runStatus.status !== "completed" && runStatus.status !== "failed" && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
        attempts++;
      }
      
      if (runStatus.status === "failed") {
        console.error(`Run ${run.id} failed for thread ${threadId}`);
        return res.status(500).json({ 
          error: "Assistant run failed", 
          errorCode: "ASSISTANT_RUN_FAILED" 
        });
      }
      
      if (runStatus.status !== "completed") {
        console.error(`Run ${run.id} timed out after ${attempts} attempts for thread ${threadId}`);
        return res.status(504).json({ 
          error: "Assistant run timed out",
          errorCode: "ASSISTANT_RUN_TIMEOUT"
        });
      }
      
      let messages;
      try {
        // Get messages from the thread
        messages = await openai.beta.threads.messages.list(threadId);
      } catch (messagesError) {
        console.error(`Error retrieving messages for thread ${threadId}:`, messagesError);
        return res.status(500).json({ 
          error: "Failed to retrieve assistant messages",
          errorCode: "MESSAGE_RETRIEVAL_FAILED"
        });
      }
      
      // Find the latest assistant message
      const assistantMessages = messages.data.filter(msg => msg.role === "assistant");
      const latestAssistantMessage = assistantMessages[0];
      
      if (!latestAssistantMessage) {
        console.error(`No assistant message found for thread ${threadId}`);
        return res.status(404).json({ 
          error: "No assistant response found",
          errorCode: "NO_ASSISTANT_RESPONSE"
        });
      }
      
      // Process the message content
      let responseContent = "";
      
      if (latestAssistantMessage.content && latestAssistantMessage.content.length > 0) {
        const contentPart = latestAssistantMessage.content[0];
        
        if (contentPart.type === "text") {
          responseContent = contentPart.text.value;
          
          // Store the assistant message
          await storage.createMessage({
            threadId,
            role: "assistant",
            content: responseContent,
          });
        }
      }
      
      if (!responseContent) {
        console.error(`Empty response content for thread ${threadId}`);
        return res.status(500).json({ 
          error: "Empty assistant response",
          errorCode: "EMPTY_RESPONSE"
        });
      }
      
      return res.json({ 
        response: responseContent,
        success: true 
      });
    } catch (error) {
      console.error("Error processing message:", error);
      return res.status(500).json({ 
        error: "Failed to process message",
        errorCode: "MESSAGE_PROCESSING_FAILED"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
