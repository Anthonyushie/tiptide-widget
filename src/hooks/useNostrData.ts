import { useState, useEffect, useCallback, useRef } from 'react';
import { PaymentData, AggregatedStats, RelayConnection } from '@/types/nostr';
import { NostrClient, isValidNostrNoteId, normalizeNoteId } from '@/lib/nostr';

const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social',
  'wss://relay.nostr.band'
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
  
  const clientRef = useRef<NostrClient | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

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

  const connectToNostr = useCallback(async (postId: string, relays: string[]) => {
    try {
      setLoading(true);
      setError(null);

      // Validate post ID
      if (!isValidNostrNoteId(postId)) {
        throw new Error('Invalid Nostr note ID format');
      }

      const normalizedPostId = normalizeNoteId(postId);
      console.log('Connecting to Nostr for post:', normalizedPostId);

      // Initialize connection tracking
      setConnections(relays.map(url => ({ url, connected: false })));

      // Create Nostr client
      const client = new NostrClient(relays);
      clientRef.current = client;

      // Connect to relays
      await client.connect();

      // Update connection status
      const relayStatus = client.getRelayStatus();
      setConnections(relayStatus);

      // Check if any relays are connected
      const connectedRelays = relayStatus.filter(r => r.connected);
      if (connectedRelays.length === 0) {
        throw new Error('Failed to connect to any Nostr relays');
      }

      console.log(`Connected to ${connectedRelays.length}/${relays.length} relays`);

      // Fetch historical zaps
      console.log('Fetching historical zaps...');
      const historicalPayments = await client.getHistoricalZaps(normalizedPostId);
      setPayments(historicalPayments);

      // Subscribe to new zaps
      console.log('Subscribing to new zaps...');
      const cleanup = client.subscribeToZaps(
        normalizedPostId,
        (newPayment: PaymentData) => {
          console.log('New payment received:', newPayment);
          setPayments(prev => {
            // Check if payment already exists (prevent duplicates)
            const exists = prev.some(p => 
              p.timestamp === newPayment.timestamp && 
              p.amount === newPayment.amount &&
              p.sender === newPayment.sender
            );
            
            if (exists) {
              return prev;
            }
            
            // Add new payment and sort by timestamp
            const updated = [newPayment, ...prev].sort((a, b) => b.timestamp - a.timestamp);
            return updated;
          });
        },
        (error: string) => {
          console.error('Subscription error:', error);
          setError(error);
        }
      );

      cleanupRef.current = cleanup;
      setLoading(false);

    } catch (err) {
      console.error('Nostr connection error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  const reconnect = useCallback(() => {
    if (postId && relays.length > 0) {
      // Cleanup existing connection
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (clientRef.current) {
        clientRef.current.disconnect();
        clientRef.current = null;
      }
      
      // Reconnect
      connectToNostr(postId, relays);
    }
  }, [postId, relays.join(','), connectToNostr]);

  // Initial connection
  useEffect(() => {
    if (!postId) {
      setLoading(false);
      setError('No post ID provided');
      return;
    }

    // Skip connection for demo mode
    if (postId === 'demo-post-id') {
      setLoading(false);
      setError(null);
      setConnections(relays.map(url => ({ url, connected: true })));
      return;
    }

    connectToNostr(postId, relays);

    // Cleanup on unmount
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, [postId, relays.join(','), connectToNostr]);

  // Update stats when payments change
  useEffect(() => {
    setStats(calculateStats(payments));
  }, [payments, calculateStats]);

  // Periodic connection status update
  useEffect(() => {
    if (!clientRef.current || postId === 'demo-post-id') return;

    const interval = setInterval(() => {
      if (clientRef.current) {
        const relayStatus = clientRef.current.getRelayStatus();
        setConnections(relayStatus);
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [postId]);

  return {
    payments,
    stats,
    connections,
    loading,
    error,
    reconnect
  };
}