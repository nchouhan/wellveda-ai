export interface Message {
  role: "user" | "assistant";
  content: any; // string | complex content from OpenAI
}

export interface Thread {
  id: string;
  createdAt: string;
}

export interface ChatStatus {
  id: string;
  status: "in_progress" | "completed" | "failed";
}
