import { AggregatedStats } from '@/types/nostr';
import { formatDistanceToNow } from 'date-fns';

interface PaymentStatsDisplayProps {
  stats: AggregatedStats;
  loading: boolean;
  compact?: boolean;
}

export function PaymentStatsDisplay({ stats, loading, compact = false }: PaymentStatsDisplayProps) {
  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="h-6 sm:h-8 w-16 sm:w-20 bg-muted brutal-border brutal-shadow animate-pulse rounded-md" />
        <div className="h-6 sm:h-8 w-20 sm:w-24 bg-muted brutal-border brutal-shadow animate-pulse rounded-md" />
      </div>
    );
  }

  if (stats.totalCount === 0) {
    return (
      <div className="text-center p-3 sm:p-4 brutal-border bg-accent/10 brutal-shadow-accent rounded-md">
        <div className="text-sm sm:text-base md:text-lg font-bold text-foreground">
          No tips yet - break the ice! ⚡
        </div>
      </div>
    );
  }

  const formatAmount = (sats: number) => {
    if (sats >= 1000000) {
      return `${(sats / 1000000).toFixed(1)}M`;
    } else if (sats >= 1000) {
      return `${(sats / 1000).toFixed(1)}K`;
    }
    return sats.toString();
  };

  if (compact) {
    return (
      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6 font-jetbrains font-semibold">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-accent animate-fade-in bg-card px-2 sm:px-3 py-1 rounded-md brutal-shadow-sm">
            {stats.totalCount}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {stats.totalCount === 1 ? 'Tip' : 'Tips'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-bitcoin animate-fade-in bg-card px-2 sm:px-3 py-1 rounded-md brutal-shadow-sm">
            {formatAmount(stats.totalAmount)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Sats
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="text-center brutal-card-accent p-3 sm:p-4">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent animate-fade-in font-jetbrains">
            {stats.totalCount}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground font-semibold mt-1 sm:mt-2">
            {stats.totalCount === 1 ? 'Person' : 'People'}
          </div>
        </div>
        
        <div className="text-center brutal-card p-3 sm:p-4">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-bitcoin animate-fade-in font-jetbrains">
            {formatAmount(stats.totalAmount)}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground font-semibold mt-1 sm:mt-2">
            Total Sats
          </div>
        </div>
        
        <div className="text-center brutal-card p-3 sm:p-4">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-success animate-fade-in font-jetbrains">
            {formatAmount(stats.averageAmount)}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground font-semibold mt-1 sm:mt-2">
            Avg Tip
          </div>
        </div>
      </div>
      
      {stats.recentCount > 0 && (
        <div className="text-center p-3 sm:p-4 brutal-border bg-accent/20 brutal-shadow-accent rounded-md">
          <div className="text-sm sm:text-base md:text-lg font-bold text-foreground animate-subtle-bounce">
            🔥 {stats.recentCount} tip{stats.recentCount === 1 ? '' : 's'} in last hour 🔥
          </div>
        </div>
      )}
      
      {stats.lastPaymentTime && (
        <div className="text-center text-xs sm:text-sm font-jetbrains text-muted-foreground">
          Last tip: {formatDistanceToNow(new Date(stats.lastPaymentTime), { addSuffix: true })}
        </div>
      )}
    </div>
  );
}