import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID = "asst_NXGBmeSbyaBdsWNjGzSG467R";

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Create a new thread
export async function createThread() {
  try {
    return await openai.beta.threads.create();
  } catch (error) {
    console.error("Error creating thread:", error);
    throw new Error("Failed to create thread");
  }
}

// Add a message to a thread
export async function addMessageToThread(threadId: string, content: string) {
  try {
    return await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content,
    });
  } catch (error) {
    console.error("Error adding message to thread:", error);
    throw new Error("Failed to add message to thread");
  }
}

// Run the assistant on a thread
export async function runAssistant(threadId: string) {
  try {
    return await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID,
    });
  } catch (error) {
    console.error("Error running assistant:", error);
    throw new Error("Failed to run assistant");
  }
}

// Check the status of a run
export async function checkRunStatus(threadId: string, runId: string) {
  try {
    return await openai.beta.threads.runs.retrieve(threadId, runId);
  } catch (error) {
    console.error("Error checking run status:", error);
    throw new Error("Failed to check run status");
  }
}

// Get messages from a thread
export async function getMessages(threadId: string) {
  try {
    return await openai.beta.threads.messages.list(threadId);
  } catch (error) {
    console.error("Error getting messages:", error);
    throw new Error("Failed to get messages");
  }
}
