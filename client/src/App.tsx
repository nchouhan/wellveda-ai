import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SEO from "@/components/SEO";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      {/* Add SEO component for dynamic meta tags and language handling */}
      <SEO />
      
      {/* Toast notifications */}
      <Toaster />
      
      {/* Main application structure with semantic HTML */}
      <div className="flex flex-col min-h-screen">
        <header className="sr-only">
          <h1>WellVeda AI - Ayurvedic Wellness Assistant</h1>
          <p>Get personalized Ayurvedic health insights with WellVeda AI.</p>
        </header>
        
        <main id="main" className="flex-1">
          <Router />
        </main>
        
        <footer className="sr-only">
          <p>WellVeda AI - Providing natural wellness solutions based on Ayurvedic principles.</p>
        </footer>
      </div>
    </TooltipProvider>
  );
}

export default App;
