// Betting domain types - strict TypeScript, no `any`

export type BetStatus = 'pending' | 'active' | 'won' | 'lost' | 'settled' | 'cancelled';
export type EventStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

export interface Outcome {
  id: string;
  name: string;
  odds: number;
  previousOdds?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface BettingEvent {
  id: string;
  name: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  status: EventStatus;
  category: string;
  outcomes: Outcome[];
}

export interface Bet {
  id: string;
  eventId: string;
  eventName: string;
  outcomeId: string;
  outcomeName: string;
  amount: number;
  odds: number;
  potentialReturn: number;
  status: BetStatus;
  placedAt: Date;
  settledAt?: Date;
  payout?: number;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
  pendingBalance: number;
}

export interface OddsUpdate {
  eventId: string;
  outcomeId: string;
  newOdds: number;
  previousOdds: number;
  timestamp: Date;
}

export interface SettlementResult {
  betId: string;
  status: 'won' | 'lost';
  payout: number;
  transactionHash?: string;
}

export interface BettingFlowState {
  step: 'idle' | 'selecting' | 'confirming' | 'processing' | 'settled' | 'error';
  selectedEvent: BettingEvent | null;
  selectedOutcome: Outcome | null;
  betAmount: number;
  error: string | null;
}
