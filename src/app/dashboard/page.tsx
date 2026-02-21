'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserDashboard } from '@/components/UserDashboard';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useSettlement } from '@/hooks/useSettlement';
import type { BettingEvent, Bet, SettlementResult } from '@/types/betting';
import { api } from '@/lib/api';

// Mock data for MVP
const MOCK_EVENT: BettingEvent = {
  id: 'event-001',
  name: 'Championship Finals 2026',
  description: 'The ultimate showdown between top contenders',
  startTime: new Date(Date.now() + 3600000), // 1 hour from now
  status: 'live',
  category: 'Esports',
  outcomes: [
    { id: 'outcome-1', name: 'Team Alpha', odds: 1.85, trend: 'up' },
    { id: 'outcome-2', name: 'Draw', odds: 3.50, trend: 'stable' },
    { id: 'outcome-3', name: 'Team Beta', odds: 2.10, trend: 'down' },
  ],
};

const MOCK_BETS: Bet[] = [
  {
    id: 'bet-001',
    eventId: 'event-001',
    eventName: 'Championship Finals 2026',
    outcomeId: 'outcome-1',
    outcomeName: 'Team Alpha',
    amount: 0.5,
    odds: 1.85,
    potentialReturn: 0.925,
    status: 'active',
    placedAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'bet-002',
    eventId: 'event-002',
    eventName: 'Weekly Tournament #42',
    outcomeId: 'outcome-5',
    outcomeName: 'Player X',
    amount: 1.0,
    odds: 2.50,
    potentialReturn: 2.5,
    status: 'won',
    placedAt: new Date(Date.now() - 86400000),
    settledAt: new Date(Date.now() - 43200000),
    payout: 2.5,
  },
  {
    id: 'bet-003',
    eventId: 'event-003',
    eventName: 'Community Challenge',
    outcomeId: 'outcome-8',
    outcomeName: 'Over 10.5',
    amount: 0.25,
    odds: 1.90,
    potentialReturn: 0.475,
    status: 'lost',
    placedAt: new Date(Date.now() - 172800000),
    settledAt: new Date(Date.now() - 86400000),
  },
];

export default function DashboardPage() {
  const [event, setEvent] = useState<BettingEvent>(MOCK_EVENT);
  const [bets, setBets] = useState<Bet[]>(MOCK_BETS);
  const [loading, setLoading] = useState(true);

  const { wallet, connect, disconnect, refreshBalance } = useWalletConnection();
  const { settleBetById } = useSettlement({
    onSuccess: (result) => {
      // Update bet status after settlement
      setBets((current) =>
        current.map((bet) =>
          bet.id === result.betId
            ? {
                ...bet,
                status: result.status,
                settledAt: new Date(),
                payout: result.payout,
              }
            : bet
        )
      );
    },
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // MVP: Use mock data, fetch from API in production
        // const eventsResponse = await api.events.list();
        // const betsResponse = await api.bets.list();
        
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        setEvent(MOCK_EVENT);
        setBets(MOCK_BETS);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePlaceBet = useCallback(
    async (eventId: string, outcomeId: string, amount: number) => {
      const outcome = event.outcomes.find((o) => o.id === outcomeId);
      if (!outcome) return;

      const newBet: Bet = {
        id: `bet-${Date.now()}`,
        eventId,
        eventName: event.name,
        outcomeId,
        outcomeName: outcome.name,
        amount,
        odds: outcome.odds,
        potentialReturn: amount * outcome.odds,
        status: 'active',
        placedAt: new Date(),
      };

      // MVP: Add to local state, send to API in production
      setBets((current) => [newBet, ...current]);
      
      // Refresh wallet balance
      await refreshBalance();
    },
    [event, refreshBalance]
  );

  const handleSettleBet = useCallback(
    async (betId: string): Promise<SettlementResult> => {
      const result = await settleBetById(betId);
      if (!result) {
        throw new Error('Settlement failed');
      }
      await refreshBalance();
      return result;
    },
    [settleBetById, refreshBalance]
  );

  const handleDeposit = useCallback((amount: number) => {
    console.log('Deposit requested:', amount);
    // MVP: Mock deposit - implement real transaction in production
  }, []);

  const handleWithdraw = useCallback((amount: number) => {
    console.log('Withdraw requested:', amount);
    // MVP: Mock withdraw - implement real transaction in production
  }, []);

  return (
    <main className="min-h-screen bg-gray-900">
      <UserDashboard
        event={event}
        bets={bets}
        wallet={wallet}
        onPlaceBet={handlePlaceBet}
        onConnectWallet={connect}
        onDisconnectWallet={disconnect}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
        onSettleBet={handleSettleBet}
        loading={loading}
      />
    </main>
  );
}
