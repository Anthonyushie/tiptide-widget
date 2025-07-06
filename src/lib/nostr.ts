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
    try {
      // Connect to relays with better error handling and connection tracking
      const connectionPromises = this.relays.map(async (relay) => {
        try {
          console.log(`Connecting to ${relay}`);
          const relayInstance = await this.pool.ensureRelay(relay);
          
          // Set up connection event listeners
          relayInstance.on('connect', () => {
            console.log(`✅ Connected to ${relay}`);
            this.relayConnections.set(relay, true);
          });
          
          relayInstance.on('disconnect', () => {
            console.log(`❌ Disconnected from ${relay}`);
            this.relayConnections.set(relay, false);
          });
          
          relayInstance.on('error', (error: any) => {
            console.error(`❌ Error on ${relay}:`, error);
            this.relayConnections.set(relay, false);
          });
          
          // Wait a bit for connection to establish
          await new Promise(resolve => setTimeout(resolve, 1000));
          
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
      
      // Don't throw error if some relays fail - continue with available ones
      if (successful === 0) {
        console.warn('Failed to connect to any relays, but continuing...');
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

      console.log('Subscribing to zaps for post:', postId);
      console.log('Filter:', filter);
      console.log('Relays:', this.relays);

      const sub = this.pool.subscribeMany(this.relays, [filter], {
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

      console.log('Fetching historical zaps for post:', postId);
      
      const events = await this.pool.querySync(this.relays, filter);
      console.log('Found historical zap events:', events.length);

      const payments: PaymentData[] = [];
      
      for (const event of events) {
        const payment = this.parseZapReceipt(event as ZapReceipt);
        if (payment) {
          payments.push(payment);
        }
      }

      // Sort by timestamp (newest first)
      payments.sort((a, b) => b.timestamp - a.timestamp);
      
      console.log('Parsed payments:', payments.length);
      return payments;
    } catch (error) {
      console.error('Error fetching historical zaps:', error);
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
      // In a real implementation, you'd use a bech32 decoder
      // For now, we'll just return the original ID
      return noteId;
    } catch {
      return noteId;
    }
  }
  return noteId;
}