import { create } from 'zustand'
import type { Party, Game } from '@/types'

export type BetStatus = 'pending' | 'confirmed' | 'active' | 'settled' | 'cancelled' | 'error'

export interface LiveBet {
  id: string
  partyId: string
  game: Game
  amount: number
  status: BetStatus
  txHash?: string
  createdAt: Date
  settledAt?: Date
  winnings?: number
  error?: string
}

export interface OddsUpdate {
  gameId: string
  odds: number
  timestamp: Date
}

export interface BetState {
  // Active bets
  liveBets: LiveBet[]
  addBet: (bet: LiveBet) => void
  updateBet: (id: string, updates: Partial<LiveBet>) => void
  removeBet: (id: string) => void
  clearSettledBets: () => void
  
  // Bet history
  betHistory: LiveBet[]
  loadBetHistory: (bets: LiveBet[]) => void
  
  // Current party/game selection
  selectedParty: Party | null
  setSelectedParty: (party: Party | null) => void
  selectedGame: Game | null
  setSelectedGame: (game: Game | null) => void
  
  // Betting form state
  betAmount: number
  setBetAmount: (amount: number) => void
  
  // Real-time odds
  liveOdds: Map<string, OddsUpdate>
  updateOdds: (gameId: string, odds: number) => void
  
  // Settlement
  pendingSettlement: string | null
  setPendingSettlement: (betId: string | null) => void
  
  // Duplicate prevention
  recentBetHashes: Set<string>
  addBetHash: (hash: string) => void
  isBetDuplicate: (hash: string) => boolean
}

export const useBetStore = create<BetState>((set, get) => ({
  // Active bets
  liveBets: [],
  addBet: (bet) => set((state) => ({ 
    liveBets: [...state.liveBets, bet] 
  })),
  updateBet: (id, updates) => set((state) => ({
    liveBets: state.liveBets.map((bet) =>
      bet.id === id ? { ...bet, ...updates } : bet
    ),
  })),
  removeBet: (id) => set((state) => ({
    liveBets: state.liveBets.filter((bet) => bet.id !== id),
  })),
  clearSettledBets: () => set((state) => {
    const settled = state.liveBets.filter((b) => 
      b.status === 'settled' || b.status === 'cancelled'
    )
    return {
      liveBets: state.liveBets.filter((b) => 
        b.status !== 'settled' && b.status !== 'cancelled'
      ),
      betHistory: [...state.betHistory, ...settled],
    }
  }),
  
  // History
  betHistory: [],
  loadBetHistory: (bets) => set({ betHistory: bets }),
  
  // Selection
  selectedParty: null,
  setSelectedParty: (party) => set({ selectedParty: party }),
  selectedGame: null,
  setSelectedGame: (game) => set({ selectedGame: game }),
  
  // Form
  betAmount: 10,
  setBetAmount: (betAmount) => set({ betAmount }),
  
  // Odds
  liveOdds: new Map(),
  updateOdds: (gameId, odds) => set((state) => {
    const newOdds = new Map(state.liveOdds)
    newOdds.set(gameId, { gameId, odds, timestamp: new Date() })
    return { liveOdds: newOdds }
  }),
  
  // Settlement
  pendingSettlement: null,
  setPendingSettlement: (betId) => set({ pendingSettlement: betId }),
  
  // Duplicate prevention (keep last 50 hashes)
  recentBetHashes: new Set(),
  addBetHash: (hash) => set((state) => {
    const newHashes = new Set(state.recentBetHashes)
    if (newHashes.size >= 50) {
      const first = newHashes.values().next().value
      if (first) newHashes.delete(first)
    }
    newHashes.add(hash)
    return { recentBetHashes: newHashes }
  }),
  isBetDuplicate: (hash) => get().recentBetHashes.has(hash),
}))
