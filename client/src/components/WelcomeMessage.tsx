import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/images";
import { useState } from "react";

interface WelcomeMessageProps {
  onQuestionSelect: (question: string) => void;
}

export default function WelcomeMessage({ onQuestionSelect }: WelcomeMessageProps) {
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');

  const suggestedQuestions = {
    english: [
      "What is my dosha type?",
      "Remedies for stress",
      "Daily Ayurvedic routine",
      "Herbs for immunity"
    ],
    hindi: [
      "मेरा दोष प्रकार क्या है?",
      "तनाव के लिए उपचार",
      "दैनिक आयुर्वेदिक दिनचर्या",
      "प्रतिरक्षा के लिए जड़ी-बूटियां"
    ]
  };

  const cardTitles = {
    english: {
      welcome: "Welcome to WellVeda AI",
      description: "I'm your personal Ayurvedic wellness assistant, here to answer your questions about traditional Ayurvedic practices, herbs, remedies, and wellness routines.",
      naturalBalance: "Natural Balance",
      naturalDesc: "Learn how Ayurveda helps maintain harmony with nature",
      herbalWisdom: "Herbal Wisdom",
      herbalDesc: "Discover powerful herbs used in Ayurvedic traditions",
      modernWellness: "Modern Wellness",
      modernDesc: "Integrate ancient wisdom into contemporary lifestyles",
      greeting: "Namaste! I'm WellVeda AI, your Ayurvedic wellness assistant. I can help you explore Ayurvedic practices, remedies, and lifestyle recommendations for better health and well-being. Feel free to ask me anything about Ayurveda!"
    },
    hindi: {
      welcome: "वेलवेदा AI में आपका स्वागत है",
      description: "मैं आपका निजी आयुर्वेदिक स्वास्थ्य सहायक हूं, यहां पारंपरिक आयुर्वेदिक प्रथाओं, जड़ी-बूटियों, उपचारों और कल्याण दिनचर्या के बारे में आपके प्रश्नों के उत्तर देने के लिए।",
      naturalBalance: "प्राकृतिक संतुलन",
      naturalDesc: "जानें कैसे आयुर्वेद प्रकृति के साथ सद्भाव बनाए रखने में मदद करता है",
      herbalWisdom: "औषधीय ज्ञान",
      herbalDesc: "आयुर्वेदिक परंपराओं में उपयोग की जाने वाली शक्तिशाली जड़ी-बूटियों की खोज करें",
      modernWellness: "आधुनिक कल्याण",
      modernDesc: "प्राचीन ज्ञान को समकालीन जीवनशैली में शामिल करें",
      greeting: "नमस्ते! मैं वेलवेदा AI हूं, आपका आयुर्वेदिक स्वास्थ्य सहायक। मैं आपको आयुर्वेदिक प्रथाओं, उपचारों और बेहतर स्वास्थ्य और कल्याण के लिए जीवनशैली की सिफारिशों का पता लगाने में मदद कर सकता हूं। आयुर्वेद के बारे में कुछ भी पूछने में संकोच न करें!"
    }
  };

  const currentQuestions = suggestedQuestions[language];
  const currentTitles = cardTitles[language];

  return (
    <>
      <div className="flex justify-end mb-3">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setLanguage('english')}
            className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
              language === 'english'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hindi')}
            className={`px-4 py-2 text-sm font-medium border rounded-r-lg ${
              language === 'hindi'
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      <Card className="bg-white dark:bg-card rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="shrink-0">
            <img 
              src={images.herbs1} 
              alt="Ayurvedic herbs collection" 
              className="rounded-lg h-40 w-40 object-cover"
            />
          </div>
          <div>
            <h2 className="font-bold text-xl text-primary mb-2">{currentTitles.welcome}</h2>
            <p className="text-gray-600 mb-4">
              {currentTitles.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {currentQuestions.map((question, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="bg-card hover:bg-muted px-3 py-1.5 rounded-full text-sm transition-colors"
                  onClick={() => onQuestionSelect(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white dark:bg-card rounded-xl shadow-sm overflow-hidden">
          <img 
            src={images.nature1} 
            alt="Calming forest landscape" 
            className="w-full h-32 object-cover"
          />
          <CardContent className="p-4">
            <h3 className="font-medium text-primary">{currentTitles.naturalBalance}</h3>
            <p className="text-xs text-gray-600 mt-1">
              {currentTitles.naturalDesc}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-card rounded-xl shadow-sm overflow-hidden">
          <img 
            src={images.herbs2} 
            alt="Ayurvedic herbs and powders display" 
            className="w-full h-32 object-cover"
          />
          <CardContent className="p-4">
            <h3 className="font-medium text-primary">{currentTitles.herbalWisdom}</h3>
            <p className="text-xs text-gray-600 mt-1">
              {currentTitles.herbalDesc}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-card rounded-xl shadow-sm overflow-hidden">
          <img 
            src={images.modern1} 
            alt="Modern wellness space" 
            className="w-full h-32 object-cover"
          />
          <CardContent className="p-4">
            <h3 className="font-medium text-primary">{currentTitles.modernWellness}</h3>
            <p className="text-xs text-gray-600 mt-1">
              {currentTitles.modernDesc}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-start gap-3">
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
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
          </svg>
        </div>
        <Card className="bg-white dark:bg-card rounded-xl rounded-tl-none shadow-sm p-4 max-w-[85%]">
          <p className="text-gray-700">
            {currentTitles.greeting}
          </p>
        </Card>
      </div>
    </>
  );
}
