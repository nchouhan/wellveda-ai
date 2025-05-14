import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/images";

interface WelcomeMessageProps {
  onQuestionSelect: (question: string) => void;
}

export default function WelcomeMessage({ onQuestionSelect }: WelcomeMessageProps) {
  const suggestedQuestions = [
    "What is my dosha type?",
    "Remedies for stress",
    "Daily Ayurvedic routine",
    "Herbs for immunity"
  ];

  return (
    <>
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
            <h2 className="font-bold text-xl text-primary mb-2">Welcome to WellVeda AI</h2>
            <p className="text-gray-600 mb-4">
              I'm your personal Ayurvedic wellness assistant, here to answer your questions about traditional Ayurvedic practices, herbs, remedies, and wellness routines.
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
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
            <h3 className="font-medium text-primary">Natural Balance</h3>
            <p className="text-xs text-gray-600 mt-1">
              Learn how Ayurveda helps maintain harmony with nature
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
            <h3 className="font-medium text-primary">Herbal Wisdom</h3>
            <p className="text-xs text-gray-600 mt-1">
              Discover powerful herbs used in Ayurvedic traditions
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
            <h3 className="font-medium text-primary">Modern Wellness</h3>
            <p className="text-xs text-gray-600 mt-1">
              Integrate ancient wisdom into contemporary lifestyles
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
            Namaste! I'm WellVeda AI, your Ayurvedic wellness assistant. I can help you explore Ayurvedic practices, remedies, and lifestyle recommendations for better health and well-being. Feel free to ask me anything about Ayurveda!
          </p>
        </Card>
      </div>
    </>
  );
}
