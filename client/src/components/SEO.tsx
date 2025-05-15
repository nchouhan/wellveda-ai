import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/pages/home';

/**
 * SEO component that manages semantic structure and dynamic meta tags
 * This component adds proper semantic HTML elements to improve accessibility and SEO
 */
export default function SEO() {
  const [location] = useLocation();
  const { language } = useLanguage();
  
  // Update meta tags dynamically based on current route and language
  useEffect(() => {
    // Update language attribute on html element
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
    
    // Update page-specific meta tags
    const title = language === 'hi' 
      ? 'वेलवेडा AI | आयुर्वेदिक स्वास्थ्य सहायक'
      : 'WellVeda AI | Ayurvedic Wellness Assistant';
    
    const description = language === 'hi'
      ? 'वेलवेडा AI के साथ व्यक्तिगत आयुर्वेदिक स्वास्थ्य जानकारी प्राप्त करें। अपने दोष प्रकार, आहार, जीवनशैली और होलिस्टिक स्वास्थ्य अभ्यासों के लिए प्राकृतिक कल्याण समाधान खोजें।'
      : 'Get personalized Ayurvedic health insights with WellVeda AI. Discover natural wellness solutions for your dosha type, diet, lifestyle, and holistic health practices.';
    
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update canonical URL
    const canonicalURL = `https://wellveda-health-ncailab.replit.app${location}`;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', canonicalURL);
    }
    
    // Update Open Graph and Twitter meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    
    if (ogTitle) ogTitle.setAttribute('content', title);
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    
    if (ogDescription) ogDescription.setAttribute('content', description);
    if (twitterDescription) twitterDescription.setAttribute('content', description);
    
  }, [location, language]);
  
  return null; // This component doesn't render anything visible
}