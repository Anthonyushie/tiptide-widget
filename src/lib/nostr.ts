import { SimplePool, Event, Filter, Relay } from 'nostr-tools';
import { PaymentData, NostrEvent, ZapReceipt } from '@/types/nostr';

export class NostrClient {
  private pool: SimplePool;
  private relays: string[];
  private subscriptions: Map<string, any> = new Map();
  private relayConnections: Map<string, boolean> = new Map();
  private relayMetrics: Map<string, { events: number; errors: number; latency: number }> = new Map();

  constructor(relays: string[]) {
    this.pool = new SimplePool();
    this.relays = relays;
    
    // Initialize all relays as disconnected
    this.relays.forEach(relay => {
      this.relayConnections.set(relay, false);
      this.relayMetrics.set(relay, { events: 0, errors: 0, latency: 0 });
    });
  }

  async connect(): Promise<void> {
    console.log('🔗 NostrClient: Enhanced connection to relays...');
    console.log(`📊 Total relays: ${this.relays.length}`);
    
    const yakihonneRelays = this.relays.filter(r => r.includes('yakihonne'));
    console.log(`⚡ Yakihonne relays: ${yakihonneRelays.length}`);
    
    // Reset connection status
    this.relays.forEach(relay => this.relayConnections.set(relay, false));
    
    try {
      // Connect to relays with enhanced error handling and metrics
      const connectionPromises = this.relays.map(async (relay) => {
        const startTime = Date.now();
        try {
          console.log(`🔄 Connecting to ${relay}${relay.includes('yakihonne') ? ' ⚡' : ''}`);
          
          // Enhanced connection with timeout
          await Promise.race([
            this.pool.ensureRelay(relay),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Connection timeout')), 12000)
            )
          ]);
          
          const latency = Date.now() - startTime;
          this.relayConnections.set(relay, true);
          
          // Update metrics
          const metrics = this.relayMetrics.get(relay)!;
          metrics.latency = latency;
          this.relayMetrics.set(relay, metrics);
          
          console.log(`✅ Connected to ${relay} (${latency}ms)${relay.includes('yakihonne') ? ' ⚡' : ''}`);
          return { relay, success: true, latency };
        } catch (error) {
          const latency = Date.now() - startTime;
          console.error(`❌ Failed to connect to ${relay} (${latency}ms):`, error);
          this.relayConnections.set(relay, false);
          
          // Update error metrics
          const metrics = this.relayMetrics.get(relay)!;
          metrics.errors++;
          this.relayMetrics.set(relay, metrics);
          
          return { relay, success: false, error, latency };
        }
      });
      
      const results = await Promise.allSettled(connectionPromises);
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const yakihonneSuccessful = results.filter(r => 
        r.status === 'fulfilled' && 
        r.value.success && 
        r.value.relay.includes('yakihonne')
      ).length;
      
      console.log(`📊 Connection Results:`);
      console.log(`   ✅ Total connected: ${successful}/${this.relays.length}`);
      console.log(`   ⚡ Yakihonne connected: ${yakihonneSuccessful}/${yakihonneRelays.length}`);
      
      // Log detailed connection status for Yakihonne
      yakihonneRelays.forEach(relay => {
        const connected = this.relayConnections.get(relay);
        const metrics = this.relayMetrics.get(relay)!;
        console.log(`   📡 ${relay}: ${connected ? '✅' : '❌'} (${metrics.latency}ms)`);
      });
      
      if (successful === 0) {
        console.warn('⚠️ No relays connected individually, using fallback mode...');
        // Fallback: assume relays are available for pool operations
        this.relays.forEach(relay => this.relayConnections.set(relay, true));
      } else {
        console.log(`🎉 Successfully connected to ${successful} relay(s)`);
        if (yakihonneSuccessful > 0) {
          console.log(`⚡ Yakihonne integration active with ${yakihonneSuccessful} relay(s)`);
        }
      }
    } catch (error) {
      console.error('💥 NostrClient connection error:', error);
      // Don't throw - let the app continue with whatever connections work
    }
  }

  subscribeToZaps(
    postId: string, 
    onPayment: (payment: PaymentData) => void,
    onError: (error: string) => void
  ): () => void {
    try {
      // Enhanced filter for better zap detection
      const filter: Filter = {
        kinds: [9735], // Zap receipt events
        '#e': [postId], // Events that reference our post
        since: Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60), // Last 7 days for better coverage
        limit: 200 // Increased limit
      };

      console.log('🔔 Enhanced zap subscription starting...');
      console.log('🎯 Target post:', postId);
      console.log('📋 Filter:', filter);
      
      // Prioritize connected relays, especially Yakihonne
      const connectedRelays = this.relays.filter(relay => this.relayConnections.get(relay));
      const yakihonneConnected = connectedRelays.filter(r => r.includes('yakihonne'));
      
      console.log(`🔗 Using ${connectedRelays.length} connected relays`);
      console.log(`⚡ Including ${yakihonneConnected.length} Yakihonne relays`);
      
      // Use connected relays or fallback to all relays
      const relaysToUse = connectedRelays.length > 0 ? connectedRelays : this.relays;

      const sub = this.pool.subscribeMany(relaysToUse, [filter], {
        onevent: (event: Event) => {
          console.log('📨 Zap event received:', {
            id: event.id.substring(0, 8),
            kind: event.kind,
            created_at: new Date(event.created_at * 1000).toISOString()
          });
          
          try {
            const payment = this.parseZapReceipt(event as ZapReceipt);
            if (payment) {
              // Add source relay information if available
              payment.source = this.identifyEventSource(event);
              onPayment(payment);
              
              // Update relay metrics
              if (payment.source) {
                const metrics = this.relayMetrics.get(payment.source);
                if (metrics) {
                  metrics.events++;
                  this.relayMetrics.set(payment.source, metrics);
                }
              }
            }
          } catch (error) {
            console.error('❌ Error parsing zap receipt:', error);
          }
        },
        oneose: () => {
          console.log('📚 End of stored events for zap subscription');
        }
      });

      // Store subscription for cleanup
      this.subscriptions.set(postId, sub);

      // Return cleanup function
      return () => {
        console.log('🧹 Cleaning up zap subscription');
        sub.close();
        this.subscriptions.delete(postId);
      };
    } catch (error) {
      console.error('💥 Error subscribing to zaps:', error);
      onError(`Failed to subscribe to zaps: ${error}`);
      return () => {};
    }
  }

  private identifyEventSource(event: Event): string | undefined {
    // This is a simplified approach - in practice, you'd need to track which relay
    // the event came from during the subscription process
    // For now, we'll return undefined and let the pool handle it
    return undefined;
  }

  private parseZapReceipt(event: ZapReceipt): PaymentData | null {
    try {
      // Enhanced zap receipt parsing with better error handling
      const descriptionTag = event.tags.find(tag => tag[0] === 'description');
      if (!descriptionTag || !descriptionTag[1]) {
        console.warn('⚠️ No description tag found in zap receipt');
        return null;
      }

      // Parse the zap request from the description
      let zapRequest: any;
      try {
        zapRequest = JSON.parse(descriptionTag[1]);
      } catch {
        console.warn('⚠️ Invalid JSON in description tag');
        return null;
      }

      // Extract amount from bolt11 tag
      const bolt11Tag = event.tags.find(tag => tag[0] === 'bolt11');
      if (!bolt11Tag || !bolt11Tag[1]) {
        console.warn('⚠️ No bolt11 tag found in zap receipt');
        return null;
      }

      // Enhanced amount extraction
      const amount = this.extractAmountFromBolt11(bolt11Tag[1]);
      if (!amount || amount <= 0) {
        console.warn('⚠️ Could not extract valid amount from bolt11');
        return null;
      }

      // Extract message from zap request with better handling
      const message = zapRequest.content || '';

      // Extract sender pubkey
      const sender = zapRequest.pubkey || event.pubkey;

      // Enhanced payment data
      const payment: PaymentData = {
        id: event.id,
        amount: amount, // in millisats
        timestamp: event.created_at * 1000, // Convert to milliseconds
        sender: sender,
        message: message,
        bolt11: bolt11Tag[1],
        eventId: event.id,
        source: undefined // Will be set by caller if available
      };

      console.log('✅ Parsed zap:', {
        amount: Math.round(amount / 1000) + ' sats',
        message: message ? message.substring(0, 30) + '...' : 'no message',
        sender: sender.substring(0, 8) + '...'
      });

      return payment;
    } catch (error) {
      console.error('💥 Error parsing zap receipt:', error);
      return null;
    }
  }

  private extractAmountFromBolt11(bolt11: string): number | null {
    try {
      // Enhanced bolt11 amount extraction with better regex patterns
      
      // Try different patterns for amount extraction
      const patterns = [
        /lnbc(\d+)([munp]?)/i,  // Standard pattern
        /lnbc(\d+\.?\d*)([munp]?)/i,  // With decimals
        /(\d+)([munp]?)(?=.*lnbc)/i   // Amount before lnbc
      ];

      for (const pattern of patterns) {
        const match = bolt11.match(pattern);
        if (match) {
          const amount = parseFloat(match[1]);
          const unit = match[2]?.toLowerCase() || '';

          // Convert to millisats with enhanced precision
          switch (unit) {
            case 'm': // milli-bitcoin (0.001 BTC)
              return Math.round(amount * 100000000000); // 100B millisats
            case 'u': // micro-bitcoin (0.000001 BTC)
              return Math.round(amount * 100000000); // 100M millisats
            case 'n': // nano-bitcoin (0.000000001 BTC)
              return Math.round(amount * 100000); // 100K millisats
            case 'p': // pico-bitcoin (0.000000000001 BTC)
              return Math.round(amount * 100); // 100 millisats
            default: // assume satoshis
              return Math.round(amount * 1000); // 1000 millisats per sat
          }
        }
      }

      console.warn('⚠️ Could not parse amount from bolt11:', bolt11.substring(0, 50) + '...');
      return null;
    } catch (error) {
      console.error('💥 Error extracting amount from bolt11:', error);
      return null;
    }
  }

  async getHistoricalZaps(postId: string): Promise<PaymentData[]> {
    try {
      // Enhanced filter for better historical data coverage
      const filter: Filter = {
        kinds: [9735],
        '#e': [postId],
        since: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60), // Last 30 days
        limit: 1000 // Increased limit for better coverage
      };

      console.log('📚 Enhanced historical zap query starting...');
      console.log('🎯 Target post:', postId);
      console.log('📅 Time range: 30 days');
      console.log('📊 Limit: 1000 events');
      
      // Prioritize connected relays
      const connectedRelays = this.relays.filter(relay => this.relayConnections.get(relay));
      const yakihonneConnected = connectedRelays.filter(r => r.includes('yakihonne'));
      
      console.log(`🔗 Querying ${connectedRelays.length} connected relays`);
      console.log(`⚡ Including ${yakihonneConnected.length} Yakihonne relays`);
      
      // Use connected relays or fallback to all relays
      const relaysToUse = connectedRelays.length > 0 ? connectedRelays : this.relays;
      
      // Enhanced query with timeout
      const events = await Promise.race([
        this.pool.querySync(relaysToUse, filter),
        new Promise<Event[]>((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), 30000)
        )
      ]);
      
      console.log(`📦 Raw events received: ${events.length}`);

      const payments: PaymentData[] = [];
      const processedIds = new Set<string>();
      
      for (const event of events) {
        // Prevent duplicate processing
        if (processedIds.has(event.id)) {
          continue;
        }
        processedIds.add(event.id);
        
        const payment = this.parseZapReceipt(event as ZapReceipt);
        if (payment) {
          payments.push(payment);
        }
      }

      // Sort by timestamp (newest first) and remove any remaining duplicates
      const uniquePayments = payments
        .sort((a, b) => b.timestamp - a.timestamp)
        .filter((payment, index, arr) => {
          // Additional duplicate check based on timestamp and amount
          return !arr.slice(0, index).some(p => 
            Math.abs(p.timestamp - payment.timestamp) < 1000 && 
            p.amount === payment.amount &&
            p.sender === payment.sender
          );
        });
      
      console.log(`💰 Processed payments: ${uniquePayments.length}`);
      console.log(`📊 Total amount: ${Math.round(uniquePayments.reduce((sum, p) => sum + p.amount, 0) / 1000)} sats`);
      
      if (uniquePayments.length > 0) {
        console.log('🎉 Historical zap data successfully retrieved!');
        
        // Log some sample data
        const samplePayments = uniquePayments.slice(0, 3);
        samplePayments.forEach((p, i) => {
          console.log(`   ${i + 1}. ${Math.round(p.amount / 1000)} sats - ${p.message || 'no message'}`);
        });
      }
      
      return uniquePayments;
    } catch (error) {
      console.error('💥 Error fetching historical zaps:', error);
      return [];
    }
  }

  getRelayStatus(): { url: string; connected: boolean }[] {
    return this.relays.map(url => ({
      url,
      connected: this.relayConnections.get(url) || false
    }));
  }

  getRelayMetrics(): Map<string, { events: number; errors: number; latency: number }> {
    return new Map(this.relayMetrics);
  }

  async disconnect(): Promise<void> {
    console.log('🧹 Disconnecting from all relays...');
    
    // Close all subscriptions
    for (const sub of this.subscriptions.values()) {
      sub.close();
    }
    this.subscriptions.clear();

    // Close pool
    this.pool.close(this.relays);
    
    console.log('✅ Disconnected from Nostr relays');
  }
}

// Enhanced utility functions
export function isValidNostrNoteId(noteId: string): boolean {
  if (!noteId) return false;
  
  // Allow demo mode
  if (noteId === 'demo-post-id') return true;
  
  // Check if it starts with 'note1' (bech32 encoded)
  if (noteId.startsWith('note1')) {
    return noteId.length >= 59 && noteId.length <= 65;
  }
  
  // Check if it's a hex string (64 characters)
  if (/^[a-fA-F0-9]{64}$/.test(noteId)) {
    return true;
  }
  
  // Allow example IDs for demo purposes
  if (noteId.includes('example') || noteId.includes('demo')) {
    console.warn('🎭 Using demo note ID:', noteId);
    return true;
  }
  
  return false;
}

export function normalizeNoteId(noteId: string): string {
  if (noteId.startsWith('note1')) {
    try {
      // In production, use proper bech32 decoding from nostr-tools
      const decoded = bech32ToHex(noteId);
      if (decoded) {
        console.log(`🔄 Converted note1 to hex: ${noteId.substring(0, 20)}... -> ${decoded.substring(0, 16)}...`);
        return decoded;
      }
      return noteId;
    } catch {
      return noteId;
    }
  }
  return noteId;
}

// Simple bech32 to hex converter (placeholder - use proper library in production)
function bech32ToHex(bech32: string): string | null {
  try {
    if (!bech32.startsWith('note1')) return null;
    // This would use proper bech32 decoding in production
    return bech32;
  } catch {
    return null;
  }
}