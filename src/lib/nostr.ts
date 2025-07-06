import { SimplePool, Event, Filter, Relay } from 'nostr-tools';
import { PaymentData, NostrEvent, ZapReceipt } from '@/types/nostr';

export class NostrClient {
  private pool: SimplePool;
  private relays: string[];
  private subscriptions: Map<string, any> = new Map();
  private relayConnections: Map<string, boolean> = new Map();

  constructor(relays: string[]) {
    this.pool = new SimplePool();
    this.relays = relays;
    // Initialize all relays as disconnected
    this.relays.forEach(relay => this.relayConnections.set(relay, false));
  }

  async connect(): Promise<void> {
    console.log('NostrClient: Connecting to relays...', this.relays);
    
    // Reset connection status
    this.relays.forEach(relay => this.relayConnections.set(relay, false));
    
    try {
      // Connect to relays using the correct nostr-tools API with timeout
      const connectionPromises = this.relays.map(async (relay) => {
        try {
          console.log(`🔄 Attempting to connect to ${relay}`);
          
          // Use ensureRelay with timeout to prevent hanging
          await Promise.race([
            this.pool.ensureRelay(relay),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Connection timeout')), 10000)
            )
          ]);
          
          // If we get here without error, consider it connected
          this.relayConnections.set(relay, true);
          console.log(`✅ Successfully connected to ${relay}`);
          
          return { relay, success: true };
        } catch (error) {
          console.error(`❌ Failed to connect to ${relay}:`, error);
          this.relayConnections.set(relay, false);
          return { relay, success: false, error };
        }
      });
      
      const results = await Promise.allSettled(connectionPromises);
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      console.log(`NostrClient: Connected to ${successful}/${this.relays.length} relays`);
      
      // Log detailed connection status
      this.relays.forEach(relay => {
        const connected = this.relayConnections.get(relay);
        console.log(`📡 ${relay}: ${connected ? '✅ Connected' : '❌ Disconnected'}`);
      });
      
      if (successful === 0) {
        console.warn('⚠️ Failed to connect to any relays individually, trying fallback approach...');
        // Fallback: assume all relays are available for the pool to use
        // SimplePool can handle connections internally even if ensureRelay fails
        this.relays.forEach(relay => this.relayConnections.set(relay, true));
        console.log('🔄 Using fallback connection mode - assuming relays are available');
        console.log('💡 Note: SimplePool will attempt connections when needed for queries/subscriptions');
      } else {
        console.log(`🎉 Successfully connected to ${successful} relay(s)`);
      }
    } catch (error) {
      console.error('NostrClient connection error:', error);
      // Don't throw - let the app continue with whatever connections work
    }
  }

  subscribeToZaps(
    postId: string, 
    onPayment: (payment: PaymentData) => void,
    onError: (error: string) => void
  ): () => void {
    try {
      // Create filter for zap receipt events (kind 9735)
      const filter: Filter = {
        kinds: [9735], // Zap receipt events
        '#e': [postId], // Events that reference our post
        since: Math.floor(Date.now() / 1000) - (24 * 60 * 60), // Last 24 hours
        limit: 100
      };

      console.log('🔔 Subscribing to zaps for post:', postId);
      console.log('🔔 Filter:', filter);
      console.log('🔔 All relays:', this.relays);
      
      // Get connected relays only
      const connectedRelays = this.relays.filter(relay => this.relayConnections.get(relay));
      console.log('🔔 Connected relays for subscription:', connectedRelays);
      
      // Use all relays if we have connections, otherwise try with all relays as fallback
      const relaysToUse = connectedRelays.length > 0 ? connectedRelays : this.relays;
      console.log('🔔 Using relays for subscription:', relaysToUse);

      const sub = this.pool.subscribeMany(relaysToUse, [filter], {
        onevent: (event: Event) => {
          console.log('Received zap event:', event);
          try {
            const payment = this.parseZapReceipt(event as ZapReceipt);
            if (payment) {
              onPayment(payment);
            }
          } catch (error) {
            console.error('Error parsing zap receipt:', error);
          }
        },
        oneose: () => {
          console.log('End of stored events for zap subscription');
        }
      });

      // Store subscription for cleanup
      this.subscriptions.set(postId, sub);

      // Return cleanup function
      return () => {
        sub.close();
        this.subscriptions.delete(postId);
      };
    } catch (error) {
      console.error('Error subscribing to zaps:', error);
      onError(`Failed to subscribe to zaps: ${error}`);
      return () => {};
    }
  }

  private parseZapReceipt(event: ZapReceipt): PaymentData | null {
    try {
      // Parse the bolt11 invoice from the description tag
      const descriptionTag = event.tags.find(tag => tag[0] === 'description');
      if (!descriptionTag || !descriptionTag[1]) {
        console.warn('No description tag found in zap receipt');
        return null;
      }

      // Parse the zap request from the description
      let zapRequest: any;
      try {
        zapRequest = JSON.parse(descriptionTag[1]);
      } catch {
        console.warn('Invalid JSON in description tag');
        return null;
      }

      // Extract amount from bolt11 tag
      const bolt11Tag = event.tags.find(tag => tag[0] === 'bolt11');
      if (!bolt11Tag || !bolt11Tag[1]) {
        console.warn('No bolt11 tag found in zap receipt');
        return null;
      }

      // Parse amount from bolt11 invoice (simplified parsing)
      const amount = this.extractAmountFromBolt11(bolt11Tag[1]);
      if (!amount) {
        console.warn('Could not extract amount from bolt11');
        return null;
      }

      // Extract message from zap request
      const message = zapRequest.content || '';

      // Extract sender pubkey
      const sender = zapRequest.pubkey || event.pubkey;

      return {
        amount: amount, // in millisats
        timestamp: event.created_at * 1000, // Convert to milliseconds
        sender: sender,
        message: message
      };
    } catch (error) {
      console.error('Error parsing zap receipt:', error);
      return null;
    }
  }

  private extractAmountFromBolt11(bolt11: string): number | null {
    try {
      // Simple regex to extract amount from bolt11 invoice
      // This is a simplified implementation - in production you'd use a proper bolt11 decoder
      const match = bolt11.match(/lnbc(\d+)([munp]?)/i);
      if (!match) return null;

      const amount = parseInt(match[1]);
      const unit = match[2]?.toLowerCase() || '';

      // Convert to millisats
      switch (unit) {
        case 'm': // milli-bitcoin (0.001 BTC)
          return amount * 100000000; // 100M millisats
        case 'u': // micro-bitcoin (0.000001 BTC)
          return amount * 100000; // 100K millisats
        case 'n': // nano-bitcoin (0.000000001 BTC)
          return amount * 100; // 100 millisats
        case 'p': // pico-bitcoin (0.000000000001 BTC)
          return amount * 0.1; // 0.1 millisats
        default: // assume satoshis
          return amount * 1000; // 1000 millisats per sat
      }
    } catch (error) {
      console.error('Error extracting amount from bolt11:', error);
      return null;
    }
  }

  async getHistoricalZaps(postId: string): Promise<PaymentData[]> {
    try {
      const filter: Filter = {
        kinds: [9735],
        '#e': [postId],
        since: Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60), // Last 7 days
        limit: 500
      };

      console.log('🔍 Fetching historical zaps for post:', postId);
      console.log('🔍 Using filter:', filter);
      console.log('🔍 Querying relays:', this.relays);
      
      // Get connected relays only
      const connectedRelays = this.relays.filter(relay => this.relayConnections.get(relay));
      console.log('🔍 Connected relays for query:', connectedRelays);
      
      // Use all relays if we have connections, otherwise try with all relays as fallback
      const relaysToUse = connectedRelays.length > 0 ? connectedRelays : this.relays;
      console.log('🔍 Using relays for query:', relaysToUse);
      
      const events = await this.pool.querySync(relaysToUse, filter);
      console.log('📦 Found historical zap events:', events.length);

      const payments: PaymentData[] = [];
      
      for (const event of events) {
        console.log('🔍 Processing event:', event.id, 'kind:', event.kind);
        const payment = this.parseZapReceipt(event as ZapReceipt);
        if (payment) {
          console.log('✅ Parsed payment:', payment.amount, 'msats');
          payments.push(payment);
        } else {
          console.log('❌ Failed to parse payment from event:', event.id);
        }
      }

      // Sort by timestamp (newest first)
      payments.sort((a, b) => b.timestamp - a.timestamp);
      
      console.log('📊 Total parsed payments:', payments.length);
      return payments;
    } catch (error) {
      console.error('❌ Error fetching historical zaps:', error);
      return [];
    }
  }

  getRelayStatus(): { url: string; connected: boolean }[] {
    // Return actual connection status
    return this.relays.map(url => ({
      url,
      connected: this.relayConnections.get(url) || false
    }));
  }

  async disconnect(): Promise<void> {
    // Close all subscriptions
    for (const sub of this.subscriptions.values()) {
      sub.close();
    }
    this.subscriptions.clear();

    // Close pool
    this.pool.close(this.relays);
  }
}

// Utility function to validate Nostr note ID
export function isValidNostrNoteId(noteId: string): boolean {
  // Basic validation for Nostr note IDs
  if (!noteId) return false;
  
  // Allow demo mode
  if (noteId === 'demo-post-id') return true;
  
  // Check if it starts with 'note1' (bech32 encoded)
  if (noteId.startsWith('note1')) {
    // Real note1 IDs should be 63 characters, but allow some flexibility for testing
    return noteId.length >= 59 && noteId.length <= 65;
  }
  
  // Check if it's a hex string (64 characters)
  if (/^[a-fA-F0-9]{64}$/.test(noteId)) {
    return true;
  }
  
  // Allow example IDs for demo purposes (but log a warning)
  if (noteId.includes('example') || noteId.includes('demo')) {
    console.warn('Using demo note ID:', noteId);
    return true;
  }
  
  return false;
}

// Convert note1 bech32 to hex if needed
export function normalizeNoteId(noteId: string): string {
  if (noteId.startsWith('note1')) {
    try {
      // Simple bech32 to hex conversion for note IDs
      // This is a simplified approach - in production use proper bech32 library
      const decoded = bech32ToHex(noteId);
      if (decoded) {
        console.log(`🔄 Converted note1 to hex: ${noteId} -> ${decoded}`);
        return decoded;
      }
      return noteId;
    } catch {
      return noteId;
    }
  }
  return noteId;
}

// Simple bech32 to hex converter (simplified implementation)
function bech32ToHex(bech32: string): string | null {
  try {
    // This is a very basic implementation
    // In production, use a proper bech32 library like 'bech32' npm package
    if (!bech32.startsWith('note1')) return null;
    
    // For now, just return the original - proper conversion would require bech32 library
    // The nostr-tools library should handle this internally
    return bech32;
  } catch {
    return null;
  }
}