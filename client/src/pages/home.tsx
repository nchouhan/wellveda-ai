import { useState, useEffect, createContext, useContext } from "react";
import { useChat } from "@/hooks/useChat";
import ChatInterface from "@/components/ChatInterface";
import Sidebar from "@/components/Sidebar";
import ChatHeader from "@/components/ChatHeader";
import { useIsMobile } from "@/hooks/use-mobile";

// Create language context
type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

// Hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [language, setLanguage] = useState<string>("en");
  const {
    messages,
    isLoading,
    sendMessage,
    startNewConversation,
    messageInputRef,
  } = useChat();

  useEffect(() => {
    // Close sidebar on mobile when navigating
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);
  
  // Handle language change
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    // Save language preference to localStorage
    localStorage.setItem("wellveda-language", lang);
  };
  
  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem("wellveda-language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Create the language context value
  const languageContextValue = {
    language,
    setLanguage: handleLanguageChange
  };

  return (
    <LanguageContext.Provider value={languageContextValue}>
      <div className="flex h-screen overflow-hidden">
        {/* Mobile menu toggle button */}
        <div className="fixed top-4 left-4 z-50 lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Sidebar with language support */}
        <Sidebar
          isOpen={sidebarOpen || !isMobile}
          onNewChat={startNewConversation}
          onClose={() => setSidebarOpen(false)}
          language={language}
          onLanguageChange={handleLanguageChange}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <ChatHeader />
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
            messageInputRef={messageInputRef}
            language={language}
          />
        </div>
      </div>
    </LanguageContext.Provider>
  );
}
