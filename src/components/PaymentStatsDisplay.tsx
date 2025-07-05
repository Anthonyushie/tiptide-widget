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
      <div className="flex items-center space-x-4">
        <div className="h-8 w-20 bg-muted brutal-border brutal-shadow animate-pulse" />
        <div className="h-8 w-24 bg-muted brutal-border brutal-shadow animate-pulse" />
      </div>
    );
  }

  if (stats.totalCount === 0) {
    return (
      <div className="text-center p-4 brutal-border bg-neon-green/10 brutal-shadow">
        <div className="text-lg font-bold uppercase tracking-wider text-foreground">
          NO TIPS YET - BREAK THE ICE! ⚡
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
      <div className="flex items-center space-x-6 font-jetbrains font-bold">
        <div className="text-center">
          <div className="text-2xl font-bold text-bitcoin animate-counter-brutal brutal-shadow-color bg-card px-3 py-1">
            {stats.totalCount}
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
            {stats.totalCount === 1 ? 'TIP' : 'TIPS'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-lightning animate-counter-brutal brutal-shadow-color bg-card px-3 py-1">
            {formatAmount(stats.totalAmount)}
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
            SATS
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center brutal-card bg-card p-4">
          <div className="text-4xl font-bold text-bitcoin animate-counter-brutal font-jetbrains">
            {stats.totalCount}
          </div>
          <div className="text-sm uppercase tracking-widest text-muted-foreground font-bold mt-2">
            {stats.totalCount === 1 ? 'PERSON' : 'PEOPLE'}
          </div>
        </div>
        
        <div className="text-center brutal-card bg-secondary/10 p-4">
          <div className="text-4xl font-bold text-lightning animate-counter-brutal font-jetbrains">
            {formatAmount(stats.totalAmount)}
          </div>
          <div className="text-sm uppercase tracking-widest text-muted-foreground font-bold mt-2">
            TOTAL SATS
          </div>
        </div>
        
        <div className="text-center brutal-card bg-brutal-purple/10 p-4">
          <div className="text-4xl font-bold text-brutal-purple animate-counter-brutal font-jetbrains">
            {formatAmount(stats.averageAmount)}
          </div>
          <div className="text-sm uppercase tracking-widest text-muted-foreground font-bold mt-2">
            AVG TIP
          </div>
        </div>
      </div>
      
      {stats.recentCount > 0 && (
        <div className="text-center p-4 brutal-border bg-neon-green/20 brutal-shadow-color">
          <div className="text-lg font-bold uppercase tracking-wider text-foreground animate-brutal-bounce">
            🔥 {stats.recentCount} TIP{stats.recentCount === 1 ? '' : 'S'} IN LAST HOUR 🔥
          </div>
        </div>
      )}
      
      {stats.lastPaymentTime && (
        <div className="text-center text-sm font-jetbrains text-muted-foreground uppercase tracking-wider">
          LAST TIP: {formatDistanceToNow(new Date(stats.lastPaymentTime), { addSuffix: true }).toUpperCase()}
        </div>
      )}
    </div>
  );
}