import { useState, useEffect, useCallback, useRef } from 'react';
import { PaymentData, AggregatedStats, RelayConnection } from '@/types/nostr';
import { NostrClient, isValidNostrNoteId, normalizeNoteId } from '@/lib/nostr';

const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol', 
  'wss://relay.snort.social',
  'wss://relay.nostr.band',
  'wss://relay.primal.net',
  'wss://relay.yakihonne.com',
  'wss://purplepag.es',
  'wss://relay.mostr.pub',
  'wss://relay.current.fyi',
  'wss://nostr.wine',
  'wss://relay.nostrgraph.net',
  'wss://nostr.oxtr.dev',
  'wss://relay.nostrich.de',
  'wss://nostr-pub.wellorder.net',
  'wss://relay.orangepill.dev',
  'wss://brb.io',
  'wss://offchain.pub',
  'wss://relay.nostr.info',
  'wss://nostr.fmt.wiz.biz'
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
      console.log('Using relays:', relays);

      // Use more relays for better data coverage
      const testRelays = relays.slice(0, 8);
      console.log('Testing with first 8 relays:', testRelays);

      // Initialize connection tracking
      setConnections(testRelays.map(url => ({ url, connected: false })));

      // Create Nostr client with subset of relays
      const client = new NostrClient(testRelays);
      clientRef.current = client;

      // Connect to relays with longer timeout for better reliability
      console.log('Attempting to connect to relays...');
      try {
        await Promise.race([
          client.connect(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 15000))
        ]);
        console.log('Successfully connected to relays');
      } catch (connectError) {
        console.error('Connection failed:', connectError);
        // Continue anyway - some relays might still work
      }

      // Update connection status
      const relayStatus = client.getRelayStatus();
      setConnections(relayStatus);

      // Continue even if no relays show as "connected" - the pool might still work
      const connectedRelays = relayStatus.filter(r => r.connected);
      console.log(`Relay status: ${connectedRelays.length}/${testRelays.length} relays report as connected`);
      
      // Don't throw error immediately - try to fetch data anyway

      // Fetch historical zaps with longer timeout for better data retrieval
      console.log('Fetching historical zaps...');
      try {
        const historicalPayments = await Promise.race([
          client.getHistoricalZaps(normalizedPostId),
          new Promise<PaymentData[]>((_, reject) => 
            setTimeout(() => reject(new Error('Historical fetch timeout')), 20000)
          )
        ]);
        console.log('Fetched historical payments:', historicalPayments.length);
        setPayments(historicalPayments);
        
        // If we got data, log success
        if (historicalPayments.length > 0) {
          console.log('✅ Successfully fetched real zap data from relays');
        } else {
          console.log('ℹ️ No historical zaps found for this post');
        }
      } catch (fetchError) {
        console.error('Historical fetch failed:', fetchError);
        // Continue with empty payments - subscription might still work
        setPayments([]);
      }

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
          // Don't set error state for subscription issues - just log them
          console.warn('Subscription failed, but continuing...');
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