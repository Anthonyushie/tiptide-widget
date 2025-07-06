export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

export interface ZapReceipt extends NostrEvent {
  kind: 9735;
}

export interface ZapRequest extends NostrEvent {
  kind: 9734;
}

export interface PaymentData {
  id: any;
  amount: number; // in millisats
  timestamp: number;
  sender?: string;
  message?: string;
  bolt11?: string;
  preimage?: string;
  eventId: string;
  source?: string; // Which relay the data came from
}

export interface AggregatedStats {
  totalAmount: number; // in sats
  totalCount: number;
  recentCount: number; // last hour
  averageAmount: number;
  lastPaymentTime?: number;
}

export interface TiptideConfig {
  postId: string;
  relays: string[];
  demoMode?: boolean;
  showRealtimeActivity?: boolean;
  compactMode?: boolean;
}

export interface RelayConnection {
  url: string;
  connected: boolean;
  error?: string;
  metrics?: {
    events: number;
    errors: number;
    latency: number;
  };
}

export interface NostrFilter {
  ids?: string[];
  authors?: string[];
  kinds?: number[];
  '#e'?: string[];
  '#p'?: string[];
  since?: number;
  until?: number;
  limit?: number;
}