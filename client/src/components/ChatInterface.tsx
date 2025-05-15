import { useState, useRef, useEffect, RefObject } from "react";
import { Message } from "@/types/chat";
import ChatMessage from "@/components/ChatMessage";
import WelcomeMessage from "@/components/WelcomeMessage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  messageInputRef: RefObject<HTMLTextAreaElement>;
}

export default function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
  messageInputRef,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const translations = {
    english: {
      placeholder: "Ask about Ayurvedic wellness...",
      disclaimer: "WellVeda AI is designed for educational purposes and should not replace professional medical advice.",
      sendButton: "Send message"
    },
    hindi: {
      placeholder: "आयुर्वेदिक स्वास्थ्य के बारे में पूछें...",
      disclaimer: "वेलवेदा एआई शैक्षिक उद्देश्यों के लिए डिज़ाइन किया गया है और पेशेवर चिकित्सा सलाह की जगह नहीं लेना चाहिए।",
      sendButton: "संदेश भेजें"
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
      
      // Reset textarea height
      if (messageInputRef.current) {
        messageInputRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <main className="flex-1 overflow-hidden relative">
      <div 
        ref={chatContainerRef}
        className="chat-container overflow-y-auto px-4 lg:px-0 pt-8 pb-32 space-y-8 custom-scrollbar"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <WelcomeMessage onQuestionSelect={(q) => setMessage(q)} />
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatMessage message={msg} />
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-white" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                      <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
                      <path d="M12 14v4" />
                      <path d="M12 6v4" />
                    </svg>
                  </div>
                  <div className="bg-white dark:bg-card rounded-xl rounded-tl-none shadow-sm p-4 max-w-[85%]">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
      
      {/* Language Toggle */}
      <div className="absolute bottom-[7.5rem] right-4 z-10 lg:right-8">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setLanguage('english')}
            className={`px-3 py-1 text-xs font-medium border rounded-l-lg ${
              language === 'english'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hindi')}
            className={`px-3 py-1 text-xs font-medium border rounded-r-lg ${
              language === 'hindi'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>
      
      {/* Input Area */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background to-transparent pt-16 pb-4">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative">
            <div className="bg-white dark:bg-card rounded-xl shadow-md flex items-end">
              <Textarea
                ref={messageInputRef}
                placeholder={translations[language].placeholder}
                value={message}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                className="resize-none rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-primary overflow-auto max-h-36 min-h-[44px]"
                rows={1}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={message.trim() === "" || isLoading}
                className="p-3 text-white rounded-r-xl bg-primary hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center mr-1 mb-1"
                aria-label={translations[language].sendButton}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-2">
              {translations[language].disclaimer}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
