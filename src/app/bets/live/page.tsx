'use client';

import { useState, useEffect, useCallback } from 'react';
import { EventHeader } from '@/components/EventHeader';
import { BettingCard } from '@/components/BettingCard';
import { OddsGrid } from '@/components/OddsGrid';
import { LiveOddsStream } from '@/components/LiveOddsStream';
import { WalletInfo } from '@/components/WalletInfo';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useOddsStream } from '@/hooks/useOddsStream';
import { useBettingFlow } from '@/hooks/useBettingFlow';
import type { BettingEvent, Outcome, OddsUpdate } from '@/types/betting';

// Mock live events for MVP
const MOCK_LIVE_EVENTS: BettingEvent[] = [
  {
    id: 'live-001',
    name: 'Game Gauntlet Championship - Round 4',
    description: 'Semi-finals match between top seeds',
    startTime: new Date(Date.now() - 1800000), // Started 30 min ago
    status: 'live',
    category: 'Tournament',
    outcomes: [
      { id: 'l1-1', name: 'CryptoKings', odds: 1.65, trend: 'up' },
      { id: 'l1-2', name: 'Draw', odds: 4.00, trend: 'stable' },
      { id: 'l1-3', name: 'SolanaSquad', odds: 2.40, trend: 'down' },
    ],
  },
  {
    id: 'live-002',
    name: 'Weekly Arena Battle #89',
    description: 'Community tournament live now',
    startTime: new Date(Date.now() - 900000), // Started 15 min ago
    status: 'live',
    category: 'Community',
    outcomes: [
      { id: 'l2-1', name: 'Under 15.5', odds: 1.90 },
      { id: 'l2-2', name: 'Over 15.5', odds: 1.90 },
    ],
  },
  {
    id: 'live-003',
    name: 'Speed Run Challenge',
    description: 'Who will finish first?',
    startTime: new Date(Date.now() - 600000), // Started 10 min ago
    status: 'live',
    category: 'Special',
    outcomes: [
      { id: 'l3-1', name: 'Runner A', odds: 2.20, trend: 'down' },
      { id: 'l3-2', name: 'Runner B', odds: 1.75, trend: 'up' },
      { id: 'l3-3', name: 'Runner C', odds: 3.50, trend: 'stable' },
    ],
  },
];

export default function LiveBetsPage() {
  const [events, setEvents] = useState<BettingEvent[]>(MOCK_LIVE_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<BettingEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [betAmount, setBetAmount] = useState('');
  const [placingBet, setPlacingBet] = useState(false);

  const { wallet, connect, disconnect } = useWalletConnection();
  const { state: bettingState, selectOutcome, reset } = useBettingFlow();

  // Odds stream for selected event
  const oddsStream = useOddsStream({
    eventId: selectedEvent?.id ?? '',
    initialOutcomes: selectedEvent?.outcomes ?? [],
    pollingIntervalMs: 3000,
    enableWebSocket: true,
  });

  // Load live events
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        // MVP: Use mock data
        await new Promise((resolve) => setTimeout(resolve, 300));
        setEvents(MOCK_LIVE_EVENTS);
        if (MOCK_LIVE_EVENTS.length > 0) {
          setSelectedEvent(MOCK_LIVE_EVENTS[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Update event outcomes when odds stream updates
  useEffect(() => {
    if (selectedEvent && oddsStream.outcomes.length > 0) {
      setSelectedEvent((current) =>
        current ? { ...current, outcomes: oddsStream.outcomes } : null
      );
    }
  }, [oddsStream.outcomes]);

  const handleSelectOutcome = useCallback((outcome: Outcome) => {
    selectOutcome(outcome);
  }, [selectOutcome]);

  const handlePlaceBet = async () => {
    if (!selectedEvent || !bettingState.selectedOutcome || !betAmount) return;
    
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) return;

    setPlacingBet(true);
    try {
      // MVP: Mock bet placement
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Bet placed:', {
        event: selectedEvent.name,
        outcome: bettingState.selectedOutcome.name,
        amount,
        odds: bettingState.selectedOutcome.odds,
      });
      reset();
      setBetAmount('');
    } finally {
      setPlacingBet(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-green-500" />
          <p className="text-gray-400">Loading live events...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </span>
            <h1 className="text-3xl font-bold text-white">Live Betting</h1>
          </div>
          <p className="mt-2 text-gray-400">Real-time odds • Instant settlement</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Events List */}
          <div className="space-y-4 lg:col-span-2">
            {/* Event Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    selectedEvent?.id === event.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {event.name.length > 30 ? `${event.name.slice(0, 30)}...` : event.name}
                </button>
              ))}
            </div>

            {/* Selected Event */}
            {selectedEvent && (
              <>
                <EventHeader
                  name={selectedEvent.name}
                  date={selectedEvent.startTime}
                  status={selectedEvent.status}
                  category={selectedEvent.category}
                  description={selectedEvent.description}
                />

                <LiveOddsStream
                  eventId={selectedEvent.id}
                  outcomes={oddsStream.outcomes}
                  onOddsUpdate={() => {}}
                  connectionStatus={oddsStream.connectionStatus}
                />

                <OddsGrid
                  outcomes={oddsStream.outcomes}
                  onSelect={handleSelectOutcome}
                  selectedId={bettingState.selectedOutcome?.id}
                  showTrends={true}
                />
              </>
            )}

            {/* All Live Events Cards */}
            <div className="mt-6">
              <h2 className="mb-4 text-xl font-semibold text-white">All Live Events</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {events.map((event) => (
                  <BettingCard
                    key={event.id}
                    event={event}
                    onSelectOutcome={(outcome) => {
                      setSelectedEvent(event);
                      selectOutcome(outcome);
                    }}
                  />
                ))}
              </div>
            </div>
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

            {/* Bet Slip */}
            {bettingState.selectedOutcome && wallet.connected && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                  Live Bet Slip
                </h3>
                
                <div className="mb-4 space-y-2 rounded-lg bg-gray-800/50 p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Event</span>
                    <span className="text-white">{selectedEvent?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Selection</span>
                    <span className="text-white">{bettingState.selectedOutcome.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Live Odds</span>
                    <span className="font-bold text-green-400">
                      {bettingState.selectedOutcome.odds.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-sm text-gray-400">Stake (SOL)</label>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                  />
                </div>

                {betAmount && parseFloat(betAmount) > 0 && (
                  <div className="mb-4 rounded-lg bg-green-500/20 p-3 text-center">
                    <p className="text-sm text-gray-400">Potential Return</p>
                    <p className="text-2xl font-bold text-green-400">
                      {(parseFloat(betAmount) * bettingState.selectedOutcome.odds).toFixed(4)} SOL
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={reset}
                    className="flex-1 rounded-lg border border-gray-600 py-3 text-gray-300 transition-colors hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePlaceBet}
                    disabled={placingBet || !betAmount || parseFloat(betAmount) <= 0}
                    className="flex-1 rounded-lg bg-green-600 py-3 font-semibold text-white transition-all hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {placingBet ? 'Placing...' : 'Place Live Bet'}
                  </button>
                </div>
              </div>
            )}

            {/* Live Stats */}
            <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
              <h3 className="mb-3 font-semibold text-white">Live Statistics</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Events</span>
                  <span className="text-white">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Odds Updates</span>
                  <span className="text-green-400">{oddsStream.updates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Stream Status</span>
                  <span className={oddsStream.connectionStatus === 'connected' ? 'text-green-400' : 'text-yellow-400'}>
                    {oddsStream.connectionStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
