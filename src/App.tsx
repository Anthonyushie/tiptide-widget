import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import { Navigation } from "@/components/Navigation";

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState('widget');

  // Listen for navigation events from Analytics page
  useEffect(() => {
    const handleNavigateToWidget = () => {
      setActiveTab('widget');
    };

    window.addEventListener('navigateToWidget', handleNavigateToWidget);
    
    return () => {
      window.removeEventListener('navigateToWidget', handleNavigateToWidget);
    };
  }, []);

  const handleBackToWidget = () => {
    setActiveTab('widget');
  };

  // Handle URL-based navigation
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/analytics') {
      setActiveTab('analytics');
    } else {
      setActiveTab('widget');
    }
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/analytics" element={<Analytics onBackToWidget={handleBackToWidget} />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;