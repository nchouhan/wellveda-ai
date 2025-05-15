import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface FAQAccordionProps {
  language: 'english' | 'hindi';
  onSelectQuestion: (question: string) => void;
}

export default function FAQAccordion({ language, onSelectQuestion }: FAQAccordionProps) {
  // Define FAQ questions in both languages
  const faqQuestions = {
    english: [
      "What is my dosha type and how does it affect my health?",
      "How can I balance my Vata dosha during winter?",
      "What Ayurvedic herbs boost immunity naturally?",
      "Can Ayurveda help with stress and anxiety?",
      "What is the ideal Ayurvedic morning routine?",
      "How do I detox according to Ayurvedic principles?",
      "What foods should I avoid for my Pitta constitution?",
      "How can Ayurveda help with digestive issues?",
      "What are the benefits of oil pulling?",
      "Which Ayurvedic practices improve sleep quality?",
      "What is Panchakarma and how does it work?",
      "How can I reduce inflammation naturally according to Ayurveda?",
      "What Ayurvedic remedies help with skin problems?",
      "How does Ayurveda view mental health?",
      "What are rasayanas and how do they promote longevity?",
      "How can I balance hormones naturally with Ayurveda?",
      "What is the connection between Ayurveda and yoga?",
      "How should I adjust my diet seasonally according to Ayurveda?",
      "What are the benefits of drinking warm water?",
      "How can I improve my meditation practice using Ayurvedic principles?",
      "What Ayurvedic herbs help with memory and focus?",
      "How does Ayurveda approach weight management?",
      "What is the role of taste (rasa) in Ayurvedic medicine?",
      "How can I use Ayurvedic principles for my child's health?",
      "What is the significance of marma points in Ayurveda?"
    ],
    hindi: [
      "मेरा दोष प्रकार क्या है और यह मेरे स्वास्थ्य को कैसे प्रभावित करता है?",
      "सर्दियों में अपने वात दोष को कैसे संतुलित कर सकते हैं?",
      "कौन से आयुर्वेदिक जड़ी-बूटियां प्राकृतिक रूप से प्रतिरक्षा बढ़ाती हैं?",
      "क्या आयुर्वेद तनाव और चिंता में मदद कर सकता है?",
      "आदर्श आयुर्वेदिक सुबह की दिनचर्या क्या है?",
      "आयुर्वेदिक सिद्धांतों के अनुसार मैं डिटॉक्स कैसे करूं?",
      "मेरे पित्त संविधान के लिए मुझे किन खाद्य पदार्थों से बचना चाहिए?",
      "आयुर्वेद पाचन संबंधी समस्याओं में कैसे मदद कर सकता है?",
      "तेल खींचने के क्या फायदे हैं?",
      "कौन से आयुर्वेदिक अभ्यास नींद की गुणवत्ता में सुधार करते हैं?",
      "पंचकर्म क्या है और यह कैसे काम करता है?",
      "आयुर्वेद के अनुसार प्राकृतिक रूप से सूजन को कैसे कम कर सकता हूं?",
      "त्वचा की समस्याओं में कौन से आयुर्वेदिक उपचार मदद करते हैं?",
      "आयुर्वेद मानसिक स्वास्थ्य को कैसे देखता है?",
      "रसायन क्या हैं और वे लंबी उम्र को कैसे बढ़ावा देते हैं?",
      "आयुर्वेद के साथ प्राकृतिक रूप से हार्मोन को कैसे संतुलित कर सकता हूं?",
      "आयुर्वेद और योग के बीच क्या संबंध है?",
      "आयुर्वेद के अनुसार मुझे मौसमी रूप से अपने आहार को कैसे समायोजित करना चाहिए?",
      "गर्म पानी पीने के क्या फायदे हैं?",
      "आयुर्वेदिक सिद्धांतों का उपयोग करके मैं अपने ध्यान अभ्यास में कैसे सुधार कर सकता हूं?",
      "कौन सी आयुर्वेदिक जड़ी-बूटियां स्मृति और एकाग्रता में मदद करती हैं?",
      "आयुर्वेद वजन प्रबंधन को कैसे संभालता है?",
      "आयुर्वेदिक चिकित्सा में स्वाद (रस) की क्या भूमिका है?",
      "मैं अपने बच्चे के स्वास्थ्य के लिए आयुर्वेदिक सिद्धांतों का उपयोग कैसे कर सकता हूं?",
      "आयुर्वेद में मर्म बिंदुओं का क्या महत्व है?"
    ]
  };

  return (
    <div className="w-full">
      <h3 className={`font-semibold mb-4 text-lg ${language === 'hindi' ? 'font-hindi' : ''}`}>
        {language === 'english' ? 'Commonly Asked Questions' : 'अक्सर पूछे जाने वाले प्रश्न'}
      </h3>
      <Accordion type="single" collapsible className="w-full">
        {faqQuestions[language].slice(0, 10).map((question, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className={`text-sm text-left ${language === 'hindi' ? 'font-hindi' : ''}`}>
              {question}
            </AccordionTrigger>
            <AccordionContent>
              <Button 
                variant="link" 
                onClick={() => onSelectQuestion(question)}
                className={`p-0 h-auto text-primary ${language === 'hindi' ? 'font-hindi' : ''}`}
              >
                {language === 'english' ? 'Ask this question' : 'यह प्रश्न पूछें'}
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}