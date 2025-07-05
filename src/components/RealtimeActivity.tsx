import { PaymentData } from '@/types/nostr';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';

interface RealtimeActivityProps {
  payments: PaymentData[];
  showActivity: boolean;
  limit?: number;
}

export function RealtimeActivity({ payments, showActivity, limit = 3 }: RealtimeActivityProps) {
  const [visiblePayments, setVisiblePayments] = useState<PaymentData[]>([]);
  const [newPaymentIndex, setNewPaymentIndex] = useState(-1);

  useEffect(() => {
    if (!showActivity) return;

    const recentPayments = payments
      .slice(0, limit)
      .sort((a, b) => b.timestamp - a.timestamp);

    // Check if there's a new payment
    if (recentPayments.length > visiblePayments.length && visiblePayments.length > 0) {
      setNewPaymentIndex(0);
      setTimeout(() => setNewPaymentIndex(-1), 3000);
    }

    setVisiblePayments(recentPayments);
  }, [payments, showActivity, limit, visiblePayments.length]);

  if (!showActivity || visiblePayments.length === 0) {
    return null;
  }

  const formatAmount = (millisats: number) => {
    const sats = Math.round(millisats / 1000);
    if (sats >= 1000000) {
      return `${(sats / 1000000).toFixed(1)}M`;
    } else if (sats >= 1000) {
      return `${(sats / 1000).toFixed(1)}K`;
    }
    return sats.toString();
  };

  const truncateMessage = (message: string | undefined, maxLength: number = 25) => {
    if (!message) return '';
    return message.length > maxLength ? `${message.slice(0, maxLength)}...` : message;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between brutal-border bg-card p-3 brutal-shadow rounded-md">
        <h4 className="text-lg font-bold text-foreground font-space">
          Recent Activity
        </h4>
        <div className="h-4 w-4 bg-accent brutal-border brutal-shadow-sm animate-subtle-bounce rounded-sm" />
      </div>
      
      <div className="space-y-3 max-h-40 overflow-y-auto">
        {visiblePayments.map((payment, index) => (
          <div
            key={`${payment.timestamp}-${index}`}
            className={`flex items-center justify-between p-4 brutal-border transition-all duration-500 rounded-md ${
              index === newPaymentIndex
                ? 'bg-accent text-accent-foreground brutal-shadow-accent animate-pulse-glow'
                : 'bg-card brutal-shadow'
            }`}
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center space-x-3">
                <div className="font-jetbrains font-bold text-lg">
                  {formatAmount(payment.amount)} sats
                </div>
                <div className="text-sm font-semibold text-muted-foreground">
                  {formatDistanceToNow(new Date(payment.timestamp), { addSuffix: true })}
                </div>
              </div>
              {payment.message && (
                <div className="text-sm font-medium truncate bg-black/10 p-2 brutal-border brutal-shadow-sm rounded-md">
                  "{truncateMessage(payment.message)}"
                </div>
              )}
            </div>
            
            <div className="ml-4">
              {index === newPaymentIndex ? (
                <div className="text-sm font-bold brutal-border bg-accent text-accent-foreground px-2 py-1 brutal-shadow-sm rounded-md">
                  New!
                </div>
              ) : (
                <div className="h-6 w-6 bg-gradient-bitcoin brutal-border brutal-shadow-sm rounded-md" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {payments.length > limit && (
        <div className="text-center brutal-border bg-muted/30 p-3 brutal-shadow-sm rounded-md">
          <div className="text-sm font-semibold text-muted-foreground font-jetbrains">
            +{payments.length - limit} more tips
          </div>
        </div>
      )}
    </div>
  );
}