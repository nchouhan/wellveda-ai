import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="text-xs h-7 px-2"
      >
        English
      </Button>
      <Button
        variant={language === 'hi' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('hi')}
        className="text-xs h-7 px-2"
      >
        हिंदी
      </Button>
    </div>
  );
}