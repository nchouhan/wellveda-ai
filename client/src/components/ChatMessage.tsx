import { Message } from "@/types/chat";
import { Card } from "@/components/ui/card";
import { images } from "@/lib/images";

// Define interfaces for complex message content
interface ImagePart {
  type: 'image';
  image: string;
  alt?: string;
}

interface TextPart {
  type: 'text';
  text: string;
}

type MessagePart = string | ImagePart | TextPart;

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { role, content } = message;
  
  // Detect language based on content
  // This is a simple heuristic - if the message contains Devanagari script, we consider it Hindi
  const isHindiContent = () => {
    if (typeof content === 'string') {
      // Devanagari Unicode range check
      return /[\u0900-\u097F]/.test(content);
    }
    return false;
  };
  
  // Add appropriate font class for Hindi content
  const languageClass = isHindiContent() ? "font-hindi" : "";
  
  if (role === "user") {
    return (
      <div className="flex items-start gap-3 justify-end">
        <div className="bg-primary rounded-xl rounded-tr-none p-4 text-white max-w-[85%]">
          <p className={`whitespace-pre-wrap ${languageClass}`}>{content}</p>
        </div>
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center shrink-0">
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
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>
    );
  }
  
  // Parse content for components
  const renderContent = () => {
    // Handle simple text
    if (typeof content === 'string') {
      // Check for Hindi text in string content
      const textIsHindi = /[\u0900-\u097F]/.test(content);
      const hindiClass = textIsHindi ? "font-hindi" : "";
      return <p className={`text-gray-700 whitespace-pre-wrap ${hindiClass}`}>{content}</p>;
    }
    
    // For more complex content structures from API
    if (typeof content === 'object' && content !== null) {
      // If the API returns a content array
      if (Array.isArray(content)) {
        return content.map((part, idx) => {
          if (typeof part === 'string') {
            // Check each part individually for Hindi content
            const partIsHindi = /[\u0900-\u097F]/.test(part);
            const hindiClass = partIsHindi ? "font-hindi" : "";
            return <p key={idx} className={`text-gray-700 whitespace-pre-wrap ${hindiClass}`}>{part}</p>;
          }
          // Handle image reference
          if (part.type === 'image' && part.image) {
            // Type assertion for part.image as keyof typeof images
            const imageKey = part.image as keyof typeof images;
            const imageUrl = imageKey in images ? images[imageKey] : part.image;
            return (
              <img 
                key={idx}
                src={imageUrl} 
                alt={part.alt || "Ayurvedic wellness image"} 
                className="rounded-lg w-full h-auto my-3"
              />
            );
          }
          return null;
        });
      }
      
      // If the API returns a text property
      if ('text' in content) {
        // Check for Hindi content in text property
        const textIsHindi = typeof content.text === 'string' && /[\u0900-\u097F]/.test(content.text);
        const hindiClass = textIsHindi ? "font-hindi" : "";
        return <p className={`text-gray-700 whitespace-pre-wrap ${hindiClass}`}>{content.text}</p>;
      }
    }
    
    // Fallback
    return <p className="text-gray-700">Unable to display this content</p>;
  };

  return (
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
      <Card className="bg-white dark:bg-card rounded-xl rounded-tl-none shadow-lg p-6 space-y-4 max-w-[85%] border-0">
        {renderContent()}
      </Card>
    </div>
  );
}
