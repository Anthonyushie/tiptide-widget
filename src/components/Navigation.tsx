import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    if (tab === 'analytics') {
      navigate('/analytics');
    } else {
      navigate('/');
    }
  };

  // Determine active tab based on current route
  const currentTab = location.pathname === '/analytics' ? 'analytics' : 'widget';

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-border">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text-bitcoin font-space">
              Tiptide
            </h1>
            <Badge variant="accent" className="font-jetbrains font-semibold text-xs sm:text-sm">
              ⚡ Live
            </Badge>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant={currentTab === 'widget' ? "bitcoin" : "outline"}
              onClick={() => handleTabChange('widget')}
              className="font-jetbrains text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
              size="sm"
            >
              <span className="hidden sm:inline">Widget Demo</span>
              <span className="sm:hidden">Widget</span>
            </Button>
            <Button
              variant={currentTab === 'analytics' ? "bitcoin" : "outline"}
              onClick={() => handleTabChange('analytics')}
              className="font-jetbrains text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
              size="sm"
            >
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}