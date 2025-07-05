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
      setTimeout(() => setNewPaymentIndex(-1), 2000);
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
      return `${(sats / 1000).toFixed(1)}k`;
    }
    return sats.toString();
  };

  const truncateMessage = (message: string | undefined, maxLength: number = 30) => {
    if (!message) return '';
    return message.length > maxLength ? `${message.slice(0, maxLength)}...` : message;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">Recent Activity</h4>
        <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
      </div>
      
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {visiblePayments.map((payment, index) => (
          <div
            key={`${payment.timestamp}-${index}`}
            className={`flex items-center justify-between text-xs p-2 rounded-md border transition-all duration-500 ${
              index === newPaymentIndex
                ? 'bg-success/10 border-success animate-pulse-glow'
                : 'bg-card/50 border-border/50'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-bitcoin">
                  {formatAmount(payment.amount)} sats
                </span>
                <span className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(payment.timestamp), { addSuffix: true })}
                </span>
              </div>
              {payment.message && (
                <div className="text-muted-foreground text-xs mt-1 truncate">
                  "{truncateMessage(payment.message)}"
                </div>
              )}
            </div>
            
            <div className="ml-2">
              {index === newPaymentIndex ? (
                <span className="text-xs text-success font-medium">NEW</span>
              ) : (
                <div className="h-4 w-4 bg-gradient-lightning rounded-full opacity-60" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {payments.length > limit && (
        <div className="text-xs text-muted-foreground text-center pt-1">
          +{payments.length - limit} more tips
        </div>
      )}
    </div>
  );
}