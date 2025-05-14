import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Welcome component
    'welcome.title': 'Welcome to WellVeda AI',
    'welcome.description': 'I\'m your personal Ayurvedic wellness assistant, here to answer your questions about traditional Ayurvedic practices, herbs, remedies, and wellness routines.',
    'welcome.card1.title': 'Natural Balance',
    'welcome.card1.description': 'Learn how Ayurveda helps maintain harmony with nature',
    'welcome.card2.title': 'Herbal Wisdom',
    'welcome.card2.description': 'Discover powerful herbs used in Ayurvedic traditions',
    'welcome.card3.title': 'Modern Wellness',
    'welcome.card3.description': 'Integrate ancient wisdom into contemporary lifestyles',
    'welcome.greeting': 'Namaste! I\'m WellVeda AI, your Ayurvedic wellness assistant. I can help you explore Ayurvedic practices, remedies, and lifestyle recommendations for better health and well-being. Feel free to ask me anything about Ayurveda!',
    
    // Chat interface
    'chat.placeholder': 'Ask about Ayurvedic wellness...',
    'chat.disclaimer': 'WellVeda AI is designed for educational purposes and should not replace professional medical advice.',
    
    // Suggested questions
    'question.dosha': 'What is my dosha type?',
    'question.stress': 'Remedies for stress',
    'question.routine': 'Daily Ayurvedic routine',
    'question.immunity': 'Herbs for immunity',
    
    // Sidebar
    'sidebar.title': 'WellVeda AI',
    'sidebar.description': 'Your personal Ayurvedic wellness guide',
    'sidebar.newChat': 'New Conversation',
    'sidebar.about': 'About Ayurveda',
    'sidebar.discover': 'Discover Doshas',
    'sidebar.seasonal': 'Seasonal Wellness',
    'sidebar.daily': 'Daily Practices',
    'sidebar.footer1': 'WellVeda AI uses OpenAI\'s assistant technology',
    'sidebar.footer2': 'Powered by assistant ID: asst_NXGBmeSbyaBdsWNjGzSG467R',
    
    // Header
    'header.search': 'Search conversations...',
    'header.about': 'About WellVeda AI',
  },
  hi: {
    // Welcome component
    'welcome.title': 'वेलवेदा एआई में आपका स्वागत है',
    'welcome.description': 'मैं आपका व्यक्तिगत आयुर्वेदिक स्वास्थ्य सहायक हूं, जो पारंपरिक आयुर्वेदिक प्रथाओं, जड़ी-बूटियों, उपचारों और स्वास्थ्य दिनचर्या के बारे में आपके सवालों के जवाब देने के लिए यहां हूं।',
    'welcome.card1.title': 'प्राकृतिक संतुलन',
    'welcome.card1.description': 'जानें कि आयुर्वेद प्रकृति के साथ सामंजस्य बनाए रखने में कैसे मदद करता है',
    'welcome.card2.title': 'औषधीय ज्ञान',
    'welcome.card2.description': 'आयुर्वेदिक परंपराओं में उपयोग की जाने वाली शक्तिशाली जड़ी-बूटियों के बारे में जानें',
    'welcome.card3.title': 'आधुनिक स्वास्थ्य',
    'welcome.card3.description': 'प्राचीन ज्ञान को समकालीन जीवनशैली में शामिल करें',
    'welcome.greeting': 'नमस्ते! मैं वेलवेदा एआई, आपका आयुर्वेदिक स्वास्थ्य सहायक हूं। मैं आपको आयुर्वेदिक प्रथाओं, उपचारों और बेहतर स्वास्थ्य और कल्याण के लिए जीवनशैली की सिफारिशों का पता लगाने में मदद कर सकता हूं। आयुर्वेद के बारे में कोई भी प्रश्न पूछने के लिए स्वतंत्र महसूस करें!',
    
    // Chat interface
    'chat.placeholder': 'आयुर्वेदिक स्वास्थ्य के बारे में पूछें...',
    'chat.disclaimer': 'वेलवेदा एआई शैक्षिक उद्देश्यों के लिए डिज़ाइन किया गया है और इसे पेशेवर चिकित्सा सलाह की जगह नहीं लेनी चाहिए।',
    
    // Suggested questions
    'question.dosha': 'मेरा दोष प्रकार क्या है?',
    'question.stress': 'तनाव के लिए उपचार',
    'question.routine': 'दैनिक आयुर्वेदिक दिनचर्या',
    'question.immunity': 'प्रतिरक्षा के लिए जड़ी-बूटियां',
    
    // Sidebar
    'sidebar.title': 'वेलवेदा एआई',
    'sidebar.description': 'आपका व्यक्तिगत आयुर्वेदिक स्वास्थ्य मार्गदर्शक',
    'sidebar.newChat': 'नई बातचीत',
    'sidebar.about': 'आयुर्वेद के बारे में',
    'sidebar.discover': 'दोषों की खोज करें',
    'sidebar.seasonal': 'मौसमी स्वास्थ्य',
    'sidebar.daily': 'दैनिक अभ्यास',
    'sidebar.footer1': 'वेलवेदा एआई OpenAI की सहायक तकनीक का उपयोग करता है',
    'sidebar.footer2': 'सहायक आईडी द्वारा संचालित: asst_NXGBmeSbyaBdsWNjGzSG467R',
    
    // Header
    'header.search': 'बातचीत खोजें...',
    'header.about': 'वेलवेदा एआई के बारे में',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('wellveda-language');
    return (savedLanguage === 'en' || savedLanguage === 'hi') 
      ? savedLanguage 
      : 'en';
  });

  useEffect(() => {
    localStorage.setItem('wellveda-language', language);
    // Optionally update html lang attribute
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};