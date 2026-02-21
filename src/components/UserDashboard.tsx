'use client';

import { useState, useCallback } from 'react';
import { EventHeader } from './EventHeader';
import { OddsGrid } from './OddsGrid';
import { BetHistoryTable } from './BetHistoryTable';
import { WalletInfo } from './WalletInfo';
import { LiveOddsStream } from './LiveOddsStream';
import { SettlementDialog } from './SettlementDialog';
import type { BettingEvent, Bet, Outcome, WalletState, OddsUpdate, SettlementResult } from '@/types/betting';

interface UserDashboardProps {
  event?: BettingEvent;
  bets: Bet[];
  wallet: WalletState;
  onPlaceBet: (eventId: string, outcomeId: string, amount: number) => Promise<void>;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  onSettleBet: (betId: string) => Promise<SettlementResult>;
  loading?: boolean;
}

export function UserDashboard({
  event,
  bets,
  wallet,
  onPlaceBet,
  onConnectWallet,
  onDisconnectWallet,
  onDeposit,
  onWithdraw,
  onSettleBet,
  loading = false,
}: UserDashboardProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [placingBet, setPlacingBet] = useState(false);
  const [settlementBet, setSettlementBet] = useState<Bet | null>(null);
  const [outcomes, setOutcomes] = useState<Outcome[]>(event?.outcomes ?? []);

  const handleOddsUpdate = useCallback((updates: OddsUpdate[]) => {
    setOutcomes((current) =>
      current.map((outcome) => {
        const update = updates.find((u) => u.outcomeId === outcome.id);
        if (update) {
          return {
            ...outcome,
            previousOdds: outcome.odds,
            odds: update.newOdds,
            trend: update.newOdds > outcome.odds ? 'up' : update.newOdds < outcome.odds ? 'down' : 'stable',
          };
        }
        return outcome;
      })
    );
  }, []);

  const handlePlaceBet = async () => {
    if (!event || !selectedOutcome || !betAmount) return;
    
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) return;

    setPlacingBet(true);
    try {
      await onPlaceBet(event.id, selectedOutcome.id, amount);
      setSelectedOutcome(null);
      setBetAmount('');
    } finally {
      setPlacingBet(false);
    }
  };

  const settleableBets = bets.filter((bet) => bet.status === 'active' && event?.status === 'completed');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-purple-500" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        {event && (
          <EventHeader
            name={event.name}
            date={event.startTime}
            status={event.status}
            category={event.category}
            description={event.description}
          />
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Live Odds Stream */}
            {event && event.status === 'live' && (
              <LiveOddsStream
                eventId={event.id}
                outcomes={outcomes}
                onOddsUpdate={handleOddsUpdate}
              />
            )}

            {/* Odds Grid */}
            {event && (
              <OddsGrid
                outcomes={outcomes}
                onSelect={setSelectedOutcome}
                selectedId={selectedOutcome?.id}
              />
            )}

            {/* Place Bet Form */}
            {selectedOutcome && wallet.connected && (
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Place Bet</h3>
                <div className="mb-4 space-y-2 rounded-lg bg-gray-800/50 p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Selection</span>
                    <span className="text-white">{selectedOutcome.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Odds</span>
                    <span className="text-white">{selectedOutcome.odds.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm text-gray-400">Stake Amount (SOL)</label>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                {betAmount && parseFloat(betAmount) > 0 && (
                  <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-center">
                    <p className="text-sm text-gray-400">Potential Return</p>
                    <p className="text-2xl font-bold text-green-400">
                      {(parseFloat(betAmount) * selectedOutcome.odds).toFixed(4)} SOL
                    </p>
                  </div>
                )}
                <button
                  onClick={handlePlaceBet}
                  disabled={placingBet || !betAmount || parseFloat(betAmount) <= 0}
                  className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white transition-all hover:from-purple-500 hover:to-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {placingBet ? 'Placing Bet...' : 'Place Bet'}
                </button>
              </div>
            )}

            {/* Bet History */}
            <BetHistoryTable
              bets={bets}
              onViewDetails={(bet) => {
                if (settleableBets.includes(bet)) {
                  setSettlementBet(bet);
                }
              }}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet */}
            <WalletInfo
              wallet={wallet}
              onConnect={onConnectWallet}
              onDisconnect={onDisconnectWallet}
              onDeposit={onDeposit}
              onWithdraw={onWithdraw}
            />

            {/* Settleable Bets */}
            {settleableBets.length > 0 && (
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                <h3 className="mb-3 font-semibold text-yellow-400">Ready to Settle</h3>
                <div className="space-y-2">
                  {settleableBets.map((bet) => (
                    <button
                      key={bet.id}
                      onClick={() => setSettlementBet(bet)}
                      className="w-full rounded-lg bg-gray-800 p-3 text-left transition-colors hover:bg-gray-700"
                    >
                      <p className="font-medium text-white">{bet.outcomeName}</p>
                      <p className="text-sm text-gray-400">
                        Potential: {bet.potentialReturn.toFixed(4)} SOL
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
              <h3 className="mb-3 font-semibold text-white">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Bets</span>
                  <span className="text-white">{bets.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Won</span>
                  <span className="text-green-400">{bets.filter((b) => b.status === 'won').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Lost</span>
                  <span className="text-red-400">{bets.filter((b) => b.status === 'lost').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active</span>
                  <span className="text-blue-400">{bets.filter((b) => b.status === 'active').length}</span>
                </div>
              </div>
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
          onConfirm={onSettleBet}
        />
      )}
    </div>
  );
}

export default UserDashboard;
