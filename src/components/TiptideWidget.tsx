import { useState, useEffect } from 'react';
import { useNostrData } from '@/hooks/useNostrData';
import { PaymentStatsDisplay } from './PaymentStatsDisplay';
import { SocialProofMessage } from './SocialProofMessage';
import { RealtimeActivity } from './RealtimeActivity';
import { LoadingSpinner } from './LoadingSpinner';
import { TiptideConfig, PaymentData } from '@/types/nostr';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface TiptideWidgetProps extends TiptideConfig {
  className?: string;
}

// Demo data for testing
const DEMO_PAYMENTS: PaymentData[] = [
  {
    amount: 21000, // 21 sats in millisats
    timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
    message: "Great content! ⚡"
  },
  {
    amount: 100000, // 100 sats
    timestamp: Date.now() - 15 * 60 * 1000, // 15 minutes ago
    message: "This deserves more attention"
  },
  {
    amount: 5000, // 5 sats
    timestamp: Date.now() - 30 * 60 * 1000, // 30 minutes ago
    message: "Small tip but big support 🙏"
  },
  {
    amount: 50000, // 50 sats
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
  },
  {
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

  // Use demo data if in demo mode
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
      description: "Lightning payments integration coming soon. This demo shows real Nostr payment data.",
    });
  };

  const toggleDemo = () => {
    setShowDemo(!showDemo);
    toast({
      title: showDemo ? "Live Mode" : "Demo Mode",
      description: showDemo ? "Connecting to Nostr relays..." : "Showing demo payment data",
    });
  };

  if (compactMode) {
    return (
      <Card className={`p-3 bg-card/80 backdrop-blur-sm border-border/50 ${className}`}>
        <div className="flex items-center justify-between">
          <PaymentStatsDisplay stats={displayStats} loading={loading && !showDemo} compact />
          <Button 
            size="sm" 
            className="bg-gradient-lightning text-primary-foreground hover:opacity-90 shadow-glow"
            onClick={handleTipClick}
          >
            Tip ⚡
          </Button>
        </div>
        {!isConnected && !showDemo && (
          <div className="mt-2 text-xs text-warning">
            Connecting to Nostr...
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className={`p-4 bg-card/90 backdrop-blur-sm border-border/50 shadow-bitcoin ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-lg bg-gradient-bitcoin bg-clip-text text-transparent">
              Tiptide
            </h3>
            <Badge 
              variant="secondary" 
              className={`text-xs ${isConnected ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}
            >
              {isConnected ? '⚡ Live' : '🔄 Connecting'}
            </Badge>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDemo}
            className="text-xs"
          >
            {showDemo ? 'Live Mode' : 'Demo Mode'}
          </Button>
        </div>

        {/* Loading State */}
        {loading && !showDemo && (
          <div className="py-8">
            <LoadingSpinner size="lg" message="Connecting to Nostr relays..." />
          </div>
        )}

        {/* Error State */}
        {error && !showDemo && (
          <div className="text-center py-6 space-y-3">
            <div className="text-destructive text-sm">{error}</div>
            <Button variant="outline" size="sm" onClick={reconnect}>
              Retry Connection
            </Button>
          </div>
        )}

        {/* Main Content */}
        {(!loading || showDemo) && !error && (
          <>
            {/* Social Proof Message */}
            <div className="text-center py-2">
              <SocialProofMessage stats={displayStats} loading={loading && !showDemo} />
            </div>

            {/* Payment Stats */}
            <div className="bg-muted/30 rounded-lg p-4">
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
            <div className="flex justify-center pt-2">
              <Button 
                className="bg-gradient-lightning text-primary-foreground hover:opacity-90 shadow-glow animate-pulse-glow"
                onClick={handleTipClick}
              >
                {displayStats.totalCount > 0 ? 'Join the tips! ⚡' : 'Be the first to tip! ⚡'}
              </Button>
            </div>

            {/* Connection Status */}
            {!showDemo && (
              <div className="text-xs text-muted-foreground text-center">
                Connected to {connections.filter(c => c.connected).length}/{connections.length} relays
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}