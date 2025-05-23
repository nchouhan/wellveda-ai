import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { messageRequestSchema, threadRequestSchema } from "@shared/schema";
import OpenAI from "openai";
import path from "path";
import fs from "fs";

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
  
  // SEO Routes - Serve SEO-related static files directly
  const publicDir = path.join(process.cwd(), 'client', 'public');
  
  // Serve sitemap.xml
  app.get("/sitemap.xml", (req, res) => {
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.contentType('application/xml');
      res.sendFile(sitemapPath);
    } else {
      res.status(404).send('Sitemap not found');
    }
  });
  
  // Serve robots.txt
  app.get("/robots.txt", (req, res) => {
    const robotsPath = path.join(publicDir, 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.contentType('text/plain');
      res.sendFile(robotsPath);
    } else {
      res.status(404).send('Robots.txt not found');
    }
  });
  
  // Serve favicon
  app.get("/favicon.ico", (req, res) => {
    const faviconPath = path.join(publicDir, 'favicon.svg');
    if (fs.existsSync(faviconPath)) {
      res.contentType('image/svg+xml');
      res.sendFile(faviconPath);
    } else {
      res.status(404).send('Favicon not found');
    }
  });
  
  // Serve og-image for social sharing
  app.get("/og-image.jpg", (req, res) => {
    const ogImagePath = path.join(publicDir, 'og-image.svg');
    if (fs.existsSync(ogImagePath)) {
      res.contentType('image/svg+xml');
      res.sendFile(ogImagePath);
    } else {
      res.status(404).send('OG Image not found');
    }
  });
  
  // Create a new thread
  app.post("/api/chat/thread", async (req, res) => {
    try {
      // Validate request
      const parseResult = threadRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.message });
      }
      
      // Create a thread with OpenAI
      const thread = await openai.beta.threads.create();
      
      // Store thread ID
      await storage.createThread({ threadId: thread.id });
      
      return res.json({ 
        threadId: thread.id,
        success: true
      });
    } catch (error) {
      console.error("Error creating thread:", error);
      return res.status(500).json({ error: "Failed to create thread" });
    }
  });
  
  // Send a message and get a response
  app.post("/api/chat/message", async (req, res) => {
    try {
      // Validate request
      const parseResult = messageRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.message });
      }
      
      const { threadId, message } = parseResult.data;
      
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
        return res.status(500).json({ error: "Assistant run failed" });
      }
      
      if (runStatus.status !== "completed") {
        return res.status(504).json({ error: "Assistant run timed out" });
      }
      
      // Get messages from the thread
      const messages = await openai.beta.threads.messages.list(threadId);
      
      // Find the latest assistant message
      const assistantMessages = messages.data.filter(msg => msg.role === "assistant");
      const latestAssistantMessage = assistantMessages[0];
      
      if (!latestAssistantMessage) {
        return res.status(404).json({ error: "No assistant response found" });
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
      
      return res.json({ 
        response: responseContent,
        success: true 
      });
    } catch (error) {
      console.error("Error processing message:", error);
      return res.status(500).json({ error: "Failed to process message" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
