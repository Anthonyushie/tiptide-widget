import { useState, useEffect } from 'react';
import { useNostrData } from '@/hooks/useNostrData';
import { PaymentStatsDisplay } from './PaymentStatsDisplay';
import { SocialProofMessage } from './SocialProofMessage';
import { RealtimeActivity } from './RealtimeActivity';
import { LoadingSpinner } from './LoadingSpinner';
import { TiptideConfig, PaymentData } from '@/types/nostr';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface TiptideWidgetProps extends TiptideConfig {
  className?: string;
}

// Demo data for testing
const DEMO_PAYMENTS: PaymentData[] = [
  {
    id: 'demo-1',
    eventId: 'demo-event-1',
    amount: 21000, // 21 sats in millisats
    timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
    message: "Great content! ⚡"
  },
  {
    id: 'demo-2',
    eventId: 'demo-event-2',
    amount: 100000, // 100 sats
    timestamp: Date.now() - 15 * 60 * 1000, // 15 minutes ago
    message: "This is valuable"
  },
  {
    id: 'demo-3',
    eventId: 'demo-event-3',
    amount: 5000, // 5 sats
    timestamp: Date.now() - 30 * 60 * 1000, // 30 minutes ago
    message: "Small but mighty 🙏"
  },
  {
    id: 'demo-4',
    eventId: 'demo-event-4',
    amount: 50000, // 50 sats
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
  },
  {
    id: 'demo-5',
    eventId: 'demo-event-5',
    amount: 210000, // 210 sats
    timestamp: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
    message: "Excellent work!"
  }
];

export function TiptideWidget({ 
  postId, 
  relays, 
  demoMode = false, 
  showRealtimeActivity = true,
  compactMode = false,
  className = ""
}: TiptideWidgetProps) {
  const [showDemo, setShowDemo] = useState(demoMode);
  const { payments, stats, connections, loading, error, reconnect } = useNostrData(
    showDemo ? 'demo-post-id' : postId, 
    relays
  );

  // Use demo data if in demo mode, otherwise use real data
  const displayPayments = showDemo ? DEMO_PAYMENTS : payments;
  const displayStats = showDemo ? {
    totalAmount: 386, // Total sats from demo data
    totalCount: 5,
    recentCount: 3,
    averageAmount: 77,
    lastPaymentTime: Date.now() - 5 * 60 * 1000
  } : stats;

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connected = connections.some(conn => conn.connected);
    setIsConnected(connected || showDemo);
  }, [connections, showDemo]);

  const handleTipClick = () => {
    toast({
      title: "Ready to tip! ⚡",
      description: showDemo 
        ? "This is demo mode. In live mode, this would open a Lightning payment interface."
        : "Lightning payment integration would open here. Currently showing real Nostr zap data.",
    });
  };

  const toggleDemo = () => {
    const newDemoMode = !showDemo;
    setShowDemo(newDemoMode);
    
    toast({
      title: newDemoMode ? "Demo mode activated" : "Live mode activated",
      description: newDemoMode 
        ? "Showing demo payment data with simulated activity"
        : "Connecting to Nostr relays for real zap data...",
    });
  };

  if (compactMode) {
    return (
      <Card className={`bg-card/95 backdrop-blur-sm ${className}`}>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1 w-full">
              <PaymentStatsDisplay stats={displayStats} loading={loading && !showDemo} compact />
            </div>
            <Button 
              variant="accent"
              size="sm" 
              onClick={handleTipClick}
              className="font-jetbrains w-full sm:w-auto"
            >
              Tip ⚡
            </Button>
          </div>
          {!isConnected && !showDemo && (
            <div className="mt-3 text-center">
              <Badge variant="outline" className="font-jetbrains font-semibold text-xs">
                {loading ? 'Connecting to Nostr...' : 'Connection failed'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-card/95 backdrop-blur-sm ${className}`}>
      <CardHeader className="space-y-0 pb-3 sm:pb-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <CardTitle className="gradient-text-bitcoin font-space text-xl sm:text-2xl">
              Tiptide
            </CardTitle>
            <Badge 
              variant={isConnected ? 'success' : 'outline'}
              className="font-jetbrains font-semibold text-xs"
            >
              {showDemo ? '🎭 Demo' : isConnected ? '⚡ Live' : loading ? '🔄 Connecting' : '❌ Offline'}
            </Badge>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDemo}
            className="font-jetbrains text-xs sm:text-sm w-full sm:w-auto"
          >
            {showDemo ? 'Go Live' : 'Demo Mode'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6">
        {/* Loading State */}
        {loading && !showDemo && (
          <div className="py-8 sm:py-12 text-center">
            <LoadingSpinner size="lg" message="Connecting to Nostr relays..." />
          </div>
        )}

        {/* Error State */}
        {error && !showDemo && (
          <div className="text-center py-6 sm:py-8 space-y-4">
            <div className="brutal-border bg-destructive/20 p-3 sm:p-4 brutal-shadow rounded-md">
              <div className="text-sm sm:text-lg font-semibold text-foreground font-jetbrains">
                ⚠️ {error}
              </div>
            </div>
            <Button variant="outline" onClick={reconnect} className="font-jetbrains text-xs sm:text-sm">
              Retry Connection
            </Button>
          </div>
        )}

        {/* Main Content */}
        {(!loading || showDemo) && !error && (
          <>
            {/* Social Proof Message */}
            <div className="py-2 sm:py-4">
              <SocialProofMessage stats={displayStats} loading={loading && !showDemo} />
            </div>

            {/* Payment Stats */}
            <div className="brutal-border bg-muted/20 p-4 sm:p-6 brutal-shadow rounded-md">
              <PaymentStatsDisplay stats={displayStats} loading={loading && !showDemo} />
            </div>

            {/* Realtime Activity */}
            {showRealtimeActivity && (
              <RealtimeActivity 
                payments={displayPayments} 
                showActivity={displayStats.totalCount > 0} 
              />
            )}

            {/* Action Button */}
            <div className="flex justify-center pt-2 sm:pt-4">
              <Button 
                variant="accent"
                size="lg"
                onClick={handleTipClick}
                className="font-jetbrains text-base sm:text-lg animate-pulse-glow w-full sm:w-auto"
              >
                {displayStats.totalCount > 0 ? 'Join the tip frenzy! ⚡' : 'Break the silence! ⚡'}
              </Button>
            </div>

            {/* Connection Status */}
            {!showDemo && (
              <div className="text-center brutal-border bg-card/50 p-2 sm:p-3 brutal-shadow-sm rounded-md">
                <div className="text-xs font-semibold text-muted-foreground font-jetbrains">
                  Connected to {connections.filter(c => c.connected).length}/{connections.length} relays
                  {connections.length > 0 && (
                    <div className="mt-1 text-xs flex justify-center">
                      {connections.map(conn => (
                        <span key={conn.url} className={`inline-block w-2 h-2 rounded-full mr-1 ${conn.connected ? 'bg-success' : 'bg-destructive'}`} />
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground/70 mt-1">
                    Including yakihonne.com relays ⚡
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}