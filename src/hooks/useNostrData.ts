import { useState, useEffect, useCallback } from 'react';
import { PaymentData, AggregatedStats, RelayConnection } from '@/types/nostr';

const DEFAULT_RELAYS = [
  'wss://relay.damus.io', 
  'wss://nos.lol'
];

export function useNostrData(postId: string, relays: string[] = DEFAULT_RELAYS) {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [stats, setStats] = useState<AggregatedStats>({
    totalAmount: 0,
    totalCount: 0,
    recentCount: 0,
    averageAmount: 0
  });
  const [connections, setConnections] = useState<RelayConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateStats = useCallback((payments: PaymentData[]): AggregatedStats => {
    if (payments.length === 0) {
      return {
        totalAmount: 0,
        totalCount: 0,
        recentCount: 0,
        averageAmount: 0
      };
    }

    const totalAmount = Math.round(payments.reduce((sum, p) => sum + p.amount, 0) / 1000); // Convert to sats
    const totalCount = payments.length;
    
    // Count payments in last hour
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recentCount = payments.filter(p => p.timestamp > oneHourAgo).length;
    
    const averageAmount = Math.round(totalAmount / totalCount);
    const lastPaymentTime = Math.max(...payments.map(p => p.timestamp));

    return {
      totalAmount,
      totalCount,
      recentCount,
      averageAmount,
      lastPaymentTime
    };
  }, []);

  useEffect(() => {
    if (!postId) return;

    setLoading(true);
    setError(null);

    // Initialize connection tracking
    setConnections(relays.map(url => ({ url, connected: false })));

    // Simulate Nostr connection for demo
    const simulateConnection = async () => {
      try {
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update connection status
        setConnections(prev => 
          prev.map(conn => ({
            ...conn,
            connected: true
          }))
        );

        setLoading(false);

        // For now, we'll rely on demo mode for payment data
        // Real Nostr integration can be added once the API is properly configured
        if (postId === 'demo-post-id') {
          setError(null);
        } else {
          setError('Real Nostr integration - use Demo Mode to see widget functionality');
        }
        
      } catch (err) {
        console.error('Connection error:', err);
        setError('Failed to connect to Nostr relays');
        setLoading(false);
      }
    };

    simulateConnection();

    const timeout = setTimeout(() => {
      setLoading(false);
      if (payments.length === 0 && postId !== 'demo-post-id') {
        setError('No payment data found - try Demo Mode');
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [postId, relays.join(',')]);

  // Update stats when payments change
  useEffect(() => {
    setStats(calculateStats(payments));
  }, [payments, calculateStats]);

  return {
    payments,
    stats,
    connections,
    loading,
    error,
    reconnect: () => {
      setError(null);
      setLoading(true);
    }
  };
}