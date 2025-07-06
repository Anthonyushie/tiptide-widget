import { useState, useEffect, useCallback, useRef } from 'react';
import { PaymentData, AggregatedStats, RelayConnection } from '@/types/nostr';
import { NostrClient } from '@/lib/nostr';
import { nip19 } from 'nostr-tools';

// Enhanced relay list with Yakihonne relays prioritized and more reliable relays
const DEFAULT_RELAYS = [
  // Yakihonne relays (highest priority)
  'wss://nostr-01.yakihonne.com',
  'wss://nostr-02.yakihonne.com',
  'wss://nostr-03.yakihonne.com',
  'wss://nostr-04.yakihonne.com',
  
  // High-performance relays
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://relay.snort.social',
  'wss://nos.lol',
  'wss://relay.nostr.band',
  'wss://purplepag.es',
  'wss://nostr.wine',
  'wss://relay.mostr.pub',
  
  // Additional reliable relays
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
  'wss://relay.bitcoiner.social',
  'wss://relay.current.fyi',
  'wss://eden.nostr.land',
  'wss://nostr.fmt.wiz.biz',
  'wss://relay.nostr.ch',
  'wss://nostr-relay.wlvs.space'
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

      console.log('🚀 Enhanced Nostr connection starting...');
      console.log('📍 Prioritizing Yakihonne relays:', relays.filter(r => r.includes('yakihonne')));

      // Validate post ID
      if (!postId || typeof postId !== 'string' || postId.trim() === '') {
        throw new Error('Post ID is required and must be a non-empty string');
      }

      // Skip validation for demo or test IDs
      if (postId.includes('demo') || postId.includes('test')) {
        console.log('🎭 Demo mode activated');
        setLoading(false);
        return;
      }

      if (!isValidNostrNoteId(postId)) {
        throw new Error(`Invalid Nostr note ID format: ${postId}`);
      }

      let normalizedPostId;
      try {
        normalizedPostId = normalizeNoteId(postId);
        console.log('✅ Normalized note ID:', normalizedPostId);
      } catch (normalizeError) {
        console.error('❌ Normalization error:', normalizeError);
        throw new Error(`Failed to normalize note ID: ${normalizeError.message}`);
      }

      // Use more relays for better coverage, prioritizing Yakihonne
      const prioritizedRelays = [
        ...relays.filter(r => r.includes('yakihonne')), // Yakihonne first
        ...relays.filter(r => !r.includes('yakihonne')).slice(0, 15) // Then others
      ];
      
      console.log('🔗 Using prioritized relays:', prioritizedRelays.length);
      console.log('⚡ Yakihonne relays:', prioritizedRelays.filter(r => r.includes('yakihonne')).length);

      // Initialize connection tracking
      setConnections(prioritizedRelays.map(url => ({ url, connected: false })));

      // Create enhanced Nostr client
      const client = new NostrClient(prioritizedRelays);
      clientRef.current = client;

      // Connect with extended timeout for better reliability
      console.log('🔌 Connecting to relays...');
      try {
        await Promise.race([
          client.connect(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 30000))
        ]);
        console.log('✅ Relay connection phase completed');
      } catch (connectError) {
        console.warn('⚠️ Some relays failed to connect:', connectError);
        // Continue anyway - the pool might still work
      }

      // Update connection status
      const relayStatus = client.getRelayStatus();
      setConnections(relayStatus);

      const connectedRelays = relayStatus.filter(r => r.connected);
      const yakihonneConnected = connectedRelays.filter(r => r.url.includes('yakihonne'));
      
      console.log(`📊 Connection Status:`);
      console.log(`   Total: ${connectedRelays.length}/${prioritizedRelays.length} relays`);
      console.log(`   Yakihonne: ${yakihonneConnected.length}/4 relays`);
      console.log(`   Other: ${connectedRelays.length - yakihonneConnected.length} relays`);

      // Fetch historical zaps with extended timeout and better error handling
      console.log('📚 Fetching historical zap data...');
      try {
        const historicalPayments = await Promise.race([
          client.getHistoricalZaps(normalizedPostId),
          new Promise<PaymentData[]>((_, reject) => 
            setTimeout(() => reject(new Error('Historical fetch timeout')), 35000)
          )
        ]);
        
        console.log(`💰 Historical zaps found: ${historicalPayments.length}`);
        
        if (historicalPayments.length > 0) {
          // Log relay sources for the data
          const yakihonneData = historicalPayments.filter(p => p.source?.includes('yakihonne'));
          console.log(`⚡ Yakihonne zaps: ${yakihonneData.length}/${historicalPayments.length}`);
        }
        
        setPayments(historicalPayments);
        
        if (historicalPayments.length > 0) {
          console.log('🎉 Successfully fetched real zap data!');
        } else {
          console.log('ℹ️ No historical zaps found for this post');
        }
      } catch (fetchError) {
        console.error('❌ Historical fetch failed:', fetchError);
        setPayments([]);
      }

      // Subscribe to new zaps with enhanced handling
      console.log('🔔 Setting up real-time zap subscription...');
      const cleanup = client.subscribeToZaps(
        normalizedPostId,
        (newPayment: PaymentData) => {
          console.log('⚡ New zap received:', {
            amount: Math.round(newPayment.amount / 1000),
            source: newPayment.source || 'unknown',
            message: newPayment.message ? newPayment.message.substring(0, 20) + '...' : 'no message'
          });
          
          setPayments(prev => {
            // Enhanced duplicate detection
            const exists = prev.some(p => 
              Math.abs(p.timestamp - newPayment.timestamp) < 1000 && // Within 1 second
              p.amount === newPayment.amount &&
              p.sender === newPayment.sender
            );
            
            if (exists) {
              console.log('🔄 Duplicate zap filtered out');
              return prev;
            }
            
            // Add new payment and sort by timestamp
            const updated = [newPayment, ...prev].sort((a, b) => b.timestamp - a.timestamp);
            console.log(`📈 Total zaps now: ${updated.length}`);
            return updated;
          });
        },
        (error: string) => {
          console.error('🚨 Subscription error:', error);
          // Don't set error state for subscription issues - just log them
        }
      );

      cleanupRef.current = cleanup;
      setLoading(false);

      // Log final status
      console.log('🏁 Nostr integration setup complete');
      console.log('🔄 Monitoring for real-time zaps...');

    } catch (err) {
      console.error('💥 Nostr connection error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  const reconnect = useCallback(() => {
    if (postId && relays.length > 0) {
      console.log('🔄 Reconnecting to Nostr...');
      
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

  // Enhanced periodic connection status update
  useEffect(() => {
    if (!clientRef.current || postId === 'demo-post-id') return;

    const interval = setInterval(() => {
      if (clientRef.current) {
        const relayStatus = clientRef.current.getRelayStatus();
        setConnections(relayStatus);
        
        // Log Yakihonne status periodically
        const yakihonneStatus = relayStatus.filter(r => r.url.includes('yakihonne'));
        const yakihonneConnected = yakihonneStatus.filter(r => r.connected).length;
        
        if (yakihonneConnected !== yakihonneStatus.length) {
          console.log(`⚡ Yakihonne status: ${yakihonneConnected}/${yakihonneStatus.length} connected`);
        }
      }
    }, 15000); // Check every 15 seconds

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