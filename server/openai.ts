import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file if present
dotenv.config();

// Get API key with fallback message
const getApiKey = () => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.error("WARNING: OPENAI_API_KEY is not set in environment variables");
  }
  return key;
};

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const ASSISTANT_ID = "asst_NXGBmeSbyaBdsWNjGzSG467R";

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: getApiKey(),
});

// Check OpenAI API key validity
export async function checkApiKey() {
  if (!process.env.OPENAI_API_KEY) {
    return { valid: false, message: "API key is not set" };
  }
  
  try {
    // Make a simple API call to verify the key
    await openai.models.list();
    return { valid: true };
  } catch (error: any) {
    console.error("OpenAI API key validation error:", error.message);
    return { 
      valid: false, 
      message: error.message || "Invalid API key"
    };
  }
}

// Create a new thread
export async function createThread() {
  try {
    // Check API key first
    const keyStatus = await checkApiKey();
    if (!keyStatus.valid) {
      throw new Error(`OpenAI API key issue: ${keyStatus.message}`);
    }
    
    return await openai.beta.threads.create();
  } catch (error: any) {
    console.error("Error creating thread:", error.message);
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

// Add a message to a thread
export async function addMessageToThread(threadId: string, content: string) {
  try {
    return await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content,
    });
  } catch (error: any) {
    console.error("Error adding message to thread:", error.message);
    throw new Error(`Failed to add message to thread: ${error.message}`);
  }
}

// Run the assistant on a thread
export async function runAssistant(threadId: string) {
  try {
    // Verify the thread exists
    try {
      await openai.beta.threads.retrieve(threadId);
    } catch (threadError: any) {
      throw new Error(`Thread ${threadId} not found: ${threadError.message}`);
    }
    
    return await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID,
    });
  } catch (error: any) {
    console.error("Error running assistant:", error.message);
    throw new Error(`Failed to run assistant: ${error.message}`);
  }
}

// Check the status of a run
export async function checkRunStatus(threadId: string, runId: string) {
  try {
    return await openai.beta.threads.runs.retrieve(threadId, runId);
  } catch (error: any) {
    console.error("Error checking run status:", error.message);
    throw new Error(`Failed to check run status: ${error.message}`);
  }
}

// Get messages from a thread
export async function getMessages(threadId: string) {
  try {
    return await openai.beta.threads.messages.list(threadId);
  } catch (error: any) {
    console.error("Error getting messages:", error.message);
    throw new Error(`Failed to get messages: ${error.message}`);
  }
}
