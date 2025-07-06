import { useState, useEffect, useCallback, useRef } from 'react';
import { PaymentData, AggregatedStats, RelayConnection } from '@/types/nostr';
import { NostrClient } from '@/lib/nostr';
import { nip19 } from 'nostr-tools';

// Prioritized list of reliable Nostr relays
const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://relay.snort.social',
  'wss://nostr-01.yakihonne.com',
  'wss://nostr-02.yakihonne.com',
  'wss://nos.lol',
  'wss://relay.nostr.band',
  'wss://purplepag.es',
  'wss://nostr.wine',
  'wss://relay.mostr.pub',
  'wss://relay.nostrgraph.net',
  'wss://nostr.oxtr.dev',
  'wss://relay.nostrich.de',
  'wss://nostr-pub.wellorder.net',
  'wss://relay.orangepill.dev',
  'wss://brb.io',
  'wss://offchain.pub',
  'wss://relay.nostr.info',
  'wss://relay.nostr.wirednet.jp',
  'wss://relay.nostr.bg',
  'wss://nostr.mom',
  'wss://relay.nostrati.com',
  'wss://relay.bitcoiner.social'
];

// Fixed normalization function
function normalizeNoteId(noteId: string): string {
  if (!noteId || typeof noteId !== 'string') {
    throw new Error('Note ID must be a non-empty string');
  }

  const trimmed = noteId.trim();
  
  // If it starts with 'note1', it's bech32 encoded - decode it
  if (trimmed.startsWith('note1')) {
    try {
      const decoded = nip19.decode(trimmed);
      
      // Check if it's a note (event) type
      if (decoded.type !== 'note') {
        throw new Error(`Expected note type, got ${decoded.type}`);
      }
      
      // Return the hex data
      const hexId = decoded.data as string;
      
      // Validate hex format
      if (!/^[0-9a-fA-F]{64}$/.test(hexId)) {
        throw new Error(`Invalid hex format after decoding: ${hexId}`);
      }
      
      return hexId;
    } catch (error) {
      throw new Error(`Failed to decode bech32 note ID: ${error.message}`);
    }
  }
  
  // If it's already hex, validate and return
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    return trimmed;
  }
  
  // If it's hex with odd length, pad with leading zero
  if (/^[0-9a-fA-F]+$/.test(trimmed)) {
    const paddedHex = trimmed.length % 2 === 0 ? trimmed : '0' + trimmed;
    if (paddedHex.length === 64) {
      return paddedHex;
    }
  }
  
  throw new Error(`Invalid note ID format: ${trimmed}`);
}

// Fixed validation function
function isValidNostrNoteId(noteId: string): boolean {
  if (!noteId || typeof noteId !== 'string') {
    return false;
  }

  const trimmed = noteId.trim();
  
  // Check if it's bech32 format
  if (trimmed.startsWith('note1')) {
    try {
      const decoded = nip19.decode(trimmed);
      return decoded.type === 'note' && typeof decoded.data === 'string';
    } catch {
      return false;
    }
  }
  
  // Check if it's hex format (64 characters)
  return /^[0-9a-fA-F]{64}$/.test(trimmed);
}

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

      // Debug logging
      console.log('Debug - Original postId:', postId);

      // Validate post ID
      if (!postId || typeof postId !== 'string' || postId.trim() === '') {
        throw new Error('Post ID is required and must be a non-empty string');
      }

      // Skip validation for demo or test IDs
      if (postId.includes('demo') || postId.includes('test')) {
        console.log('Debug - Using demo mode');
        setLoading(false);
        return;
      }

      if (!isValidNostrNoteId(postId)) {
        throw new Error(`Invalid Nostr note ID format: ${postId}`);
      }

      let normalizedPostId;
      try {
        normalizedPostId = normalizeNoteId(postId);
        console.log('Debug - Normalized postId:', normalizedPostId);
        console.log('Debug - Normalized length:', normalizedPostId.length);
        
        // Double check the result
        if (normalizedPostId === postId) {
          console.warn('Warning: normalizeNoteId returned the same value - normalization may have failed');
        }
      } catch (normalizeError) {
        console.error('Debug - Normalization error:', normalizeError);
        throw new Error(`Failed to normalize note ID: ${normalizeError.message}`);
      }

      // Final validation - must be 64 characters for a valid Nostr event ID
      if (normalizedPostId.length !== 64) {
        throw new Error(`Invalid note ID length: expected 64 characters, got ${normalizedPostId.length}`);
      }

      console.log('Connecting to Nostr for post:', normalizedPostId);
      console.log('Using relays:', relays);

      // Use more relays for better data coverage
      const testRelays = relays.slice(0, 10);
      console.log('Testing with first 10 relays:', testRelays);

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
          new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 20000))
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
            setTimeout(() => reject(new Error('Historical fetch timeout')), 25000)
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