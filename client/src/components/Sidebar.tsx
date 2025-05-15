import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  onNewChat: () => void;
  onClose: () => void;
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

export default function Sidebar({ 
  isOpen, 
  onNewChat, 
  onClose, 
  language = "en", 
  onLanguageChange 
}: SidebarProps) {
  const [currentLang, setCurrentLang] = useState<string>(language);
  
  // Handle language changes
  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };
  
  // Update internal state when prop changes
  useEffect(() => {
    setCurrentLang(language);
  }, [language]);
  
  const handleNewChat = () => {
    onNewChat();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/20 z-30"
            onClick={onClose}
          />

          {/* Sidebar content */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed lg:relative h-full w-72 bg-sidebar shadow-md z-40 flex flex-col"
          >
            <div className="p-4 border-b border-sidebar-border">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
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
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
                  </svg>
                </div>
                <h1 className="font-bold text-xl text-sidebar-primary">WellVeda AI</h1>
              </div>
              <p className="text-sm text-sidebar-foreground/60 mt-2">
                Your personal Ayurvedic wellness guide
              </p>
            </div>
            
            <div className="p-4">
              <Button
                onClick={handleNewChat}
                className="w-full bg-sidebar-primary hover:bg-primary-dark text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1 0 4H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8Z" />
                  <line x1="12" y1="11" x2="12" y2="11.01" />
                  <line x1="8" y1="11" x2="8" y2="11.01" />
                  <line x1="16" y1="11" x2="16" y2="11.01" />
                </svg>
                <span className={currentLang === "hi" ? "font-hindi" : ""}>
                  {currentLang === "en" ? "New Conversation" : "नई बातचीत"}
                </span>
              </Button>
            </div>
            
            <div className="flex-grow p-4 overflow-auto custom-scrollbar">
              <h2 className="font-medium text-sm uppercase text-sidebar-foreground/50 mb-2">
                {currentLang === "en" ? "About Ayurveda" : "आयुर्वेद के बारे में"}
              </h2>
              <div className="space-y-3">
                <Card className="bg-sidebar-accent hover:shadow-sm cursor-pointer transition-all p-3">
                  <h3 className={`font-medium ${currentLang === "hi" ? "font-hindi" : ""}`}>
                    {currentLang === "en" ? "Discover Doshas" : "दोषों को जानें"}
                  </h3>
                  <p className={`text-xs text-sidebar-foreground/60 ${currentLang === "hi" ? "font-hindi" : ""}`}>
                    {currentLang === "en" ? "Learn about Vata, Pitta, and Kapha" : "वात, पित्त और कफ के बारे में जानें"}
                  </p>
                </Card>
                <Card className="bg-sidebar-accent hover:shadow-sm cursor-pointer transition-all p-3">
                  <h3 className={`font-medium ${currentLang === "hi" ? "font-hindi" : ""}`}>
                    {currentLang === "en" ? "Seasonal Wellness" : "मौसमी स्वास्थ्य"}
                  </h3>
                  <p className={`text-xs text-sidebar-foreground/60 ${currentLang === "hi" ? "font-hindi" : ""}`}>
                    {currentLang === "en" ? "Adapt your routine with the seasons" : "मौसम के अनुसार अपनी दिनचर्या अपनाएं"}
                  </p>
                </Card>
                <Card className="bg-sidebar-accent hover:shadow-sm cursor-pointer transition-all p-3">
                  <h3 className={`font-medium ${currentLang === "hi" ? "font-hindi" : ""}`}>
                    {currentLang === "en" ? "Daily Practices" : "दैनिक अभ्यास"}
                  </h3>
                  <p className={`text-xs text-sidebar-foreground/60 ${currentLang === "hi" ? "font-hindi" : ""}`}>
                    {currentLang === "en" ? "Simple routines for balance" : "संतुलन के लिए सरल दिनचर्या"}
                  </p>
                </Card>
              </div>
            </div>
            
            {/* Language selector */}
            <div className="p-3 border-t border-sidebar-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-sidebar-foreground/70">Language</span>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant={currentLang === "en" ? "default" : "outline"}
                    onClick={() => handleLanguageChange("en")}
                    className={`px-3 py-1 text-xs ${currentLang === "en" ? 'bg-sidebar-primary' : ''}`}
                  >
                    English
                  </Button>
                  <Button 
                    size="sm" 
                    variant={currentLang === "hi" ? "default" : "outline"}
                    onClick={() => handleLanguageChange("hi")}
                    className={`px-3 py-1 text-xs ${currentLang === "hi" ? 'bg-sidebar-primary' : ''} font-hindi`}
                  >
                    हिंदी
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-sidebar-border">
              <div className="text-xs text-sidebar-foreground/50">
                <p>{currentLang === "en" ? "WellVeda AI uses OpenAI's assistant technology" : "वेलवेदा एआई ओपनएआई की सहायक तकनीक का उपयोग करता है"}</p>
                <p className="mt-1">
                  {currentLang === "en" ? "Powered by assistant ID" : "सहायक आईडी द्वारा संचालित"}: asst_NXGBmeSbyaBdsWNjGzSG467R
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
