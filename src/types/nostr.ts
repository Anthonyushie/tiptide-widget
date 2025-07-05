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

export interface PaymentData {
  amount: number; // in millisats
  timestamp: number;
  sender?: string;
  message?: string;
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
}