'use client';

import { useState, useEffect, useMemo } from 'react';
import { BetHistoryTable } from '@/components/BetHistoryTable';
import { SettlementDialog } from '@/components/SettlementDialog';
import { WalletInfo } from '@/components/WalletInfo';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useSettlement } from '@/hooks/useSettlement';
import type { Bet, BetStatus, SettlementResult } from '@/types/betting';

// Mock historical bets for MVP
const MOCK_HISTORY: Bet[] = [
  {
    id: 'hist-001',
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
    id: 'hist-002',
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
    id: 'hist-003',
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
  {
    id: 'hist-004',
    eventId: 'event-004',
    eventName: 'Speed Run Finals',
    outcomeId: 'outcome-12',
    outcomeName: 'Runner B',
    amount: 2.0,
    odds: 1.75,
    potentialReturn: 3.5,
    status: 'won',
    placedAt: new Date(Date.now() - 259200000),
    settledAt: new Date(Date.now() - 172800000),
    payout: 3.5,
  },
  {
    id: 'hist-005',
    eventId: 'event-005',
    eventName: 'League Match #15',
    outcomeId: 'outcome-15',
    outcomeName: 'Team Gamma',
    amount: 0.75,
    odds: 3.20,
    potentialReturn: 2.4,
    status: 'lost',
    placedAt: new Date(Date.now() - 345600000),
    settledAt: new Date(Date.now() - 259200000),
  },
  {
    id: 'hist-006',
    eventId: 'event-006',
    eventName: 'Weekend Showdown',
    outcomeId: 'outcome-20',
    outcomeName: 'Draw',
    amount: 0.3,
    odds: 4.50,
    potentialReturn: 1.35,
    status: 'pending',
    placedAt: new Date(Date.now() - 1800000),
  },
];

export default function BetHistoryPage() {
  const [bets, setBets] = useState<Bet[]>(MOCK_HISTORY);
  const [loading, setLoading] = useState(true);
  const [settlementBet, setSettlementBet] = useState<Bet | null>(null);

  const { wallet, connect, disconnect } = useWalletConnection();
  const { settleBetById, isSettling } = useSettlement({
    onSuccess: (result) => {
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
      setSettlementBet(null);
    },
  });

  // Load bet history
  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        // MVP: Use mock data
        await new Promise((resolve) => setTimeout(resolve, 400));
        setBets(MOCK_HISTORY);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const won = bets.filter((b) => b.status === 'won');
    const lost = bets.filter((b) => b.status === 'lost');
    const active = bets.filter((b) => b.status === 'active' || b.status === 'pending');
    
    const totalStaked = bets.reduce((sum, b) => sum + b.amount, 0);
    const totalWon = won.reduce((sum, b) => sum + (b.payout ?? 0), 0);
    const totalLost = lost.reduce((sum, b) => sum + b.amount, 0);
    const netProfit = totalWon - totalStaked;
    const winRate = bets.length > 0 ? (won.length / (won.length + lost.length)) * 100 : 0;

    return {
      total: bets.length,
      won: won.length,
      lost: lost.length,
      active: active.length,
      totalStaked,
      totalWon,
      totalLost,
      netProfit,
      winRate: isNaN(winRate) ? 0 : winRate,
    };
  }, [bets]);

  const handleSettleBet = async (betId: string): Promise<SettlementResult> => {
    const result = await settleBetById(betId);
    if (!result) {
      throw new Error('Settlement failed');
    }
    return result;
  };

  const handleViewDetails = (bet: Bet) => {
    // Only allow settlement for active bets
    if (bet.status === 'active') {
      setSettlementBet(bet);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Bet History</h1>
          <p className="mt-2 text-gray-400">Track your betting performance over time</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
                <p className="text-sm text-gray-400">Total Bets</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                <p className="text-sm text-gray-400">Won</p>
                <p className="text-2xl font-bold text-green-400">{stats.won}</p>
              </div>
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <p className="text-sm text-gray-400">Lost</p>
                <p className="text-2xl font-bold text-red-400">{stats.lost}</p>
              </div>
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                <p className="text-sm text-gray-400">Active</p>
                <p className="text-2xl font-bold text-blue-400">{stats.active}</p>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">Performance Summary</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-400">Total Staked</p>
                  <p className="text-xl font-bold text-white">{stats.totalStaked.toFixed(4)} SOL</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Returns</p>
                  <p className="text-xl font-bold text-green-400">{stats.totalWon.toFixed(4)} SOL</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Net Profit/Loss</p>
                  <p
                    className={`text-xl font-bold ${
                      stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {stats.netProfit >= 0 ? '+' : ''}{stats.netProfit.toFixed(4)} SOL
                  </p>
                </div>
              </div>
              
              {/* Win Rate Bar */}
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="font-medium text-white">{stats.winRate.toFixed(1)}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
                    style={{ width: `${stats.winRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bet History Table */}
            <BetHistoryTable
              bets={bets}
              onViewDetails={handleViewDetails}
              loading={loading}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet */}
            <WalletInfo
              wallet={wallet}
              onConnect={connect}
              onDisconnect={disconnect}
              onDeposit={() => {}}
              onWithdraw={() => {}}
            />

            {/* Active Bets Quick View */}
            {stats.active > 0 && (
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
                <h3 className="mb-3 font-semibold text-blue-400">Active Bets ({stats.active})</h3>
                <div className="space-y-2">
                  {bets
                    .filter((b) => b.status === 'active' || b.status === 'pending')
                    .slice(0, 3)
                    .map((bet) => (
                      <button
                        key={bet.id}
                        onClick={() => handleViewDetails(bet)}
                        className="w-full rounded-lg bg-gray-800 p-3 text-left transition-colors hover:bg-gray-700"
                      >
                        <p className="font-medium text-white">{bet.outcomeName}</p>
                        <div className="mt-1 flex justify-between text-sm">
                          <span className="text-gray-400">{bet.amount.toFixed(2)} SOL</span>
                          <span className="text-blue-400">@ {bet.odds.toFixed(2)}</span>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Recent Wins */}
            {stats.won > 0 && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                <h3 className="mb-3 font-semibold text-green-400">Recent Wins</h3>
                <div className="space-y-2">
                  {bets
                    .filter((b) => b.status === 'won')
                    .slice(0, 3)
                    .map((bet) => (
                      <div
                        key={bet.id}
                        className="rounded-lg bg-gray-800/50 p-3"
                      >
                        <p className="font-medium text-white">{bet.eventName}</p>
                        <div className="mt-1 flex justify-between text-sm">
                          <span className="text-gray-400">{bet.outcomeName}</span>
                          <span className="text-green-400">+{(bet.payout ?? 0).toFixed(4)} SOL</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
              <h3 className="mb-3 font-semibold text-white">💡 Tips</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Click on active bets to settle them</li>
                <li>• Sort by any column header</li>
                <li>• Filter by status using the dropdown</li>
                <li>• Track your win rate over time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Settlement Dialog */}
      {settlementBet && (
        <SettlementDialog
          bet={settlementBet}
          isOpen={!!settlementBet}
          onClose={() => setSettlementBet(null)}
          onConfirm={handleSettleBet}
        />
      )}
    </main>
  );
}
