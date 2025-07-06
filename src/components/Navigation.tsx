import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold gradient-text-bitcoin font-space">
              Tiptide
            </h1>
            <Badge variant="accent" className="font-jetbrains font-semibold">
              ⚡ Live
            </Badge>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2">
            <Button
              variant={activeTab === 'widget' ? 'bitcoin' : 'outline'}
              onClick={() => onTabChange('widget')}
              className="font-jetbrains"
            >
              Widget Demo
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'bitcoin' : 'outline'}
              onClick={() => onTabChange('analytics')}
              className="font-jetbrains"
            >
              Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}