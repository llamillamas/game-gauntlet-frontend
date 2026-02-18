'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';
import { useBettingFlow } from '@/hooks/useBettingFlow';
import { BettingProvider, useBettingContext } from '@/context/BettingContext';
import { BetCard } from '@/components/betting/BetCard';
import { OddsDisplay } from '@/components/betting/OddsDisplay';
import { BetSlip } from '@/components/betting/BetSlip';
import { SettlementPanel } from '@/components/betting/SettlementPanel';
import { pulseVariants, fadeVariants } from '@/animations/presets';

interface LiveEvent {
  id: string;
  title: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  odds: { home: number; draw: number; away: number };
}

function LivePageContent() {
  const { shouldAnimate } = useMotionPreferences();
  const bettingFlow = useBettingFlow({
    minStake: 1,
    maxStake: 10000,
    maxBetsPerRace: 5,
    onPlaceBet: async (selections) => {
      // TODO: Connect to smart contract for bet placement
      console.log('Placing bets:', selections);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSettlement: (result) => {
      console.log('Bet settled:', result);
    },
  });

  const { selections } = useBettingContext();
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate WebSocket connection
    const timer = setTimeout(() => {
      setConnected(true);
      // Mock live events
      setEvents([
        {
          id: 'event-1',
          title: 'Premier League',
          homeTeam: 'Manchester United',
          awayTeam: 'Liverpool',
          score: '2-1',
          odds: { home: 1.8, draw: 3.5, away: 4.2 },
        },
        {
          id: 'event-2',
          title: 'La Liga',
          homeTeam: 'Real Madrid',
          awayTeam: 'Barcelona',
          score: '1-0',
          odds: { home: 1.95, draw: 3.4, away: 3.9 },
        },
        {
          id: 'event-3',
          title: 'Serie A',
          homeTeam: 'Juventus',
          awayTeam: 'Inter Milan',
          score: '0-0',
          odds: { home: 2.1, draw: 3.2, away: 3.6 },
        },
      ]);
    }, 500);

    const timeout = setTimeout(() => {
      if (!connected) setError('Connection lost. Please retry.');
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timeout);
    };
  }, [connected]);

  const handlePlaceBet = async (eventId: string, stake: number) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    bettingFlow.selectOption({
      event: event.title,
      selection: event.homeTeam,
      odds: event.odds.home,
      stake,
    });
  };

  return (
    <main className="min-h-screen bg-background dark:bg-background-dark">
      <section className="container mx-auto px-4 py-8">
        <motion.header
          className="flex items-center justify-between mb-8"
          variants={shouldAnimate ? fadeVariants : undefined}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground-dark">
            Live Events
          </h1>
          <motion.span
            className={`flex items-center gap-2 ${connected ? 'text-success-500' : 'text-warning-500'}`}
            aria-live="polite"
          >
            <motion.span
              className={`w-3 h-3 rounded-full ${connected ? 'bg-success-500' : 'bg-warning-500'}`}
              animate={shouldAnimate && connected ? 'pulse' : 'idle'}
              variants={shouldAnimate ? pulseVariants : undefined}
            />
            {connected ? 'Live' : 'Connecting...'}
          </motion.span>
        </motion.header>

        {error ? (
          <motion.div
            className="text-center p-8"
            role="alert"
            variants={shouldAnimate ? fadeVariants : undefined}
            initial="hidden"
            animate="visible"
          >
            <p className="text-error mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="btn-primary px-6 py-3 min-h-[48px] rounded-lg focus:ring-2 focus:ring-primary-400"
            >
              Retry Connection
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content area - 60% width */}
            <div className="lg:col-span-2 space-y-4">
              {events.length === 0 ? (
                <motion.p
                  className="text-center text-muted dark:text-muted-dark py-12"
                  variants={shouldAnimate ? fadeVariants : undefined}
                  initial="hidden"
                  animate="visible"
                >
                  No live events at the moment
                </motion.p>
              ) : (
                events.map((event) => (
                  <motion.article
                    key={event.id}
                    className="card p-6 rounded-xl bg-surface dark:bg-surface-dark"
                    variants={shouldAnimate ? fadeVariants : undefined}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="mb-4">
                      <h2 className="text-sm font-semibold text-muted dark:text-muted-dark mb-1">
                        {event.title}
                      </h2>
                      <h3 className="text-xl font-semibold mb-2">
                        {event.homeTeam} vs {event.awayTeam}
                      </h3>
                      <p className="text-3xl font-bold text-primary-500">{event.score}</p>
                    </div>

                    <OddsDisplay
                      eventId={event.id}
                      initialOdds={event.odds}
                      onOddsChange={(odds) => {
                        setEvents((prev) =>
                          prev.map((e) =>
                            e.id === event.id
                              ? {
                                  ...e,
                                  odds,
                                }
                              : e
                          )
                        );
                      }}
                    />

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <BetCard
                        eventId={event.id}
                        title={event.homeTeam}
                        odds={event.odds.home}
                        minStake={1}
                        maxStake={5000}
                        onPlaceBet={handlePlaceBet}
                      />
                      <BetCard
                        eventId={`${event.id}-draw`}
                        title="Draw"
                        odds={event.odds.draw}
                        minStake={1}
                        maxStake={5000}
                        onPlaceBet={() => {
                          bettingFlow.selectOption({
                            event: event.title,
                            selection: 'Draw',
                            odds: event.odds.draw,
                            stake: 10,
                          });
                        }}
                      />
                      <BetCard
                        eventId={`${event.id}-away`}
                        title={event.awayTeam}
                        odds={event.odds.away}
                        minStake={1}
                        maxStake={5000}
                        onPlaceBet={() => {
                          bettingFlow.selectOption({
                            event: event.title,
                            selection: event.awayTeam,
                            odds: event.odds.away,
                            stake: 10,
                          });
                        }}
                      />
                    </div>
                  </motion.article>
                ))
              )}
            </div>

            {/* Betting panel - 40% width */}
            <motion.div
              className="lg:col-span-1 space-y-4"
              variants={shouldAnimate ? fadeVariants : undefined}
              initial="hidden"
              animate="visible"
            >
              <BetSlip
                selections={selections}
                onRemove={bettingFlow.removeSelection}
                onUpdateStake={bettingFlow.updateStake}
                onPlaceBets={bettingFlow.placeBet}
                onClear={bettingFlow.clearSlip}
              />

              <SettlementPanel userId="user-123" />

              {bettingFlow.error && (
                <motion.div
                  className="p-4 rounded-lg bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-300"
                  role="alert"
                  variants={shouldAnimate ? fadeVariants : undefined}
                  initial="hidden"
                  animate="visible"
                >
                  {bettingFlow.error}
                </motion.div>
              )}

              {bettingFlow.success && (
                <motion.div
                  className="p-4 rounded-lg bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300"
                  role="status"
                  variants={shouldAnimate ? fadeVariants : undefined}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  Bets placed successfully! 🎉
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </section>
    </main>
  );
}

export default function LivePage() {
  return (
    <BettingProvider initialBalance={1000}>
      <LivePageContent />
    </BettingProvider>
  );
}
