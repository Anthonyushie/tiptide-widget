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
      <div className="flex items-center space-x-2">
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (stats.totalCount === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        No tips yet - be the first! ⚡
      </div>
    );
  }

  const formatAmount = (sats: number) => {
    if (sats >= 1000000) {
      return `${(sats / 1000000).toFixed(1)}M`;
    } else if (sats >= 1000) {
      return `${(sats / 1000).toFixed(1)}k`;
    }
    return sats.toString();
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-3 text-sm">
        <div className="flex items-center space-x-1">
          <span className="font-bold text-bitcoin animate-counter-up">
            {stats.totalCount}
          </span>
          <span className="text-muted-foreground">
            {stats.totalCount === 1 ? 'tip' : 'tips'}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="font-bold text-bitcoin animate-counter-up">
            {formatAmount(stats.totalAmount)}
          </span>
          <span className="text-muted-foreground">sats</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="text-2xl font-bold text-bitcoin animate-counter-up">
            {stats.totalCount}
          </div>
          <div className="text-sm text-muted-foreground">
            {stats.totalCount === 1 ? 'Person' : 'People'}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-lightning animate-counter-up">
            {formatAmount(stats.totalAmount)}
          </div>
          <div className="text-sm text-muted-foreground">
            Sats Total
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-teal animate-counter-up">
            {formatAmount(stats.averageAmount)}
          </div>
          <div className="text-sm text-muted-foreground">
            Avg Tip
          </div>
        </div>
      </div>
      
      {stats.recentCount > 0 && (
        <div className="text-center text-sm text-success">
          <span className="animate-pulse-glow">
            {stats.recentCount} tip{stats.recentCount === 1 ? '' : 's'} in the last hour
          </span>
        </div>
      )}
      
      {stats.lastPaymentTime && (
        <div className="text-center text-xs text-muted-foreground">
          Last tip {formatDistanceToNow(new Date(stats.lastPaymentTime), { addSuffix: true })}
        </div>
      )}
    </div>
  );
}