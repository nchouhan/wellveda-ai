import { useState, useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Key for localStorage
const THREAD_ID_KEY = "wellveda_thread_id";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string | null>(() => {
    // Try to retrieve threadId from localStorage on initial load
    return localStorage.getItem(THREAD_ID_KEY);
  });
  const [isLoading, setIsLoading] = useState(false);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const createThreadAttempts = useRef(0);

  // Create a new thread on initial load if needed
  useEffect(() => {
    if (!threadId) {
      createNewThread();
    }
  }, [threadId]);

  // Update local storage when threadId changes
  useEffect(() => {
    if (threadId) {
      localStorage.setItem(THREAD_ID_KEY, threadId);
    }
  }, [threadId]);

  // Create a new thread
  const createNewThread = async () => {
    // Limit the number of creation attempts to prevent infinite loops
    if (createThreadAttempts.current >= 3) {
      toast({
        title: "Error",
        description: "Failed to create conversation after multiple attempts. Please reload the page.",
        variant: "destructive",
      });
      return;
    }
    
    createThreadAttempts.current += 1;
    
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/chat/thread", null);
      const data = await response.json();
      
      if (data.threadId) {
        setThreadId(data.threadId);
        localStorage.setItem(THREAD_ID_KEY, data.threadId);
        setMessages([]);
        createThreadAttempts.current = 0; // Reset attempts counter on success
      } else {
        throw new Error("No threadId returned from server");
      }
    } catch (error: any) {
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
    // If no threadId, try to create one before sending
    if (!threadId) {
      await createNewThread();
      
      // If still no threadId after attempt, show error
      if (!threadId) {
        toast({
          title: "Error",
          description: "Could not create a conversation. Please refresh the page and try again.",
          variant: "destructive",
        });
        return;
      }
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
      
      if (!response.ok) {
        // If the response indicates the thread doesn't exist, create a new one
        if (response.status === 404 || response.status === 400) {
          // Clear the current threadId
          setThreadId(null);
          localStorage.removeItem(THREAD_ID_KEY);
          
          throw new Error("Thread not found. A new conversation will be created.");
        }
        
        throw new Error(`Request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add AI response to the UI
      if (data.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch (error: any) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new conversation
  const startNewConversation = () => {
    // Clear any existing thread ID
    setThreadId(null);
    localStorage.removeItem(THREAD_ID_KEY);
    setMessages([]);
    
    // Create a new thread
    createNewThread();
    
    // Focus the input field
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
