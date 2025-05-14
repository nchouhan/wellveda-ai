import { useState, useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Create a new thread on initial load
  useEffect(() => {
    createNewThread();
  }, []);

  // Create a new thread
  const createNewThread = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/chat/thread", null);
      const data = await response.json();
      setThreadId(data.threadId);
      setMessages([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new conversation. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to create thread:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message to the API
  const sendMessage = async (content: string) => {
    if (!threadId) {
      toast({
        title: "Error",
        description: "No active conversation. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add user message to the UI immediately
      const userMessage: Message = { role: "user", content };
      setMessages((prev) => [...prev, userMessage]);
      
      // Set loading state
      setIsLoading(true);
      
      // Send message to the API
      const response = await apiRequest("POST", "/api/chat/message", {
        threadId,
        message: content,
      });
      
      const data = await response.json();
      
      // Add AI response to the UI
      if (data.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new conversation
  const startNewConversation = () => {
    createNewThread();
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

  return {
    messages,
    threadId,
    isLoading,
    sendMessage,
    startNewConversation,
    messageInputRef,
  };
}
