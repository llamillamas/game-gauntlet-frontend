'use client';

import { useState, useEffect } from 'react';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';
import { pulse, fadeIn } from '@/animations/presets';

interface LiveEvent {
  id: string;
  title: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  odds: { home: number; draw: number; away: number };
}

export default function LivePage() {
  const { shouldAnimate } = useMotionPreferences();
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!connected) setError('Connection lost. Please retry.');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [connected]);

  return (
    <main className="min-h-screen bg-background dark:bg-background-dark">
      <section className="container mx-auto px-4 py-8" style={shouldAnimate ? fadeIn : undefined}>
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground dark:text-foreground-dark">
            Live Events
          </h1>
          <span className={`flex items-center gap-2 ${connected ? 'text-success-500' : 'text-warning-500'}`} aria-live="polite">
            <span className={`w-3 h-3 rounded-full ${connected ? 'bg-success-500' : 'bg-warning-500'}`} style={shouldAnimate && connected ? pulse : undefined} />
            {connected ? 'Live' : 'Connecting...'}
          </span>
        </header>

        {error ? (
          <div className="text-center p-8" role="alert">
            <p className="text-error mb-4">{error}</p>
            <button onClick={() => setError(null)} className="btn-primary px-6 py-3 min-h-[48px] rounded-lg focus:ring-2 focus:ring-primary-400">
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.length === 0 ? (
              <p className="text-center text-muted dark:text-muted-dark py-12">No live events at the moment</p>
            ) : (
              events.map((event) => (
                <article key={event.id} className="card p-6 rounded-xl bg-surface dark:bg-surface-dark flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{event.homeTeam} vs {event.awayTeam}</h2>
                    <p className="text-2xl font-bold text-primary-500">{event.score}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-sm px-4 py-2 min-h-[48px] rounded focus:ring-2 focus:ring-primary-400" aria-label={`Bet on ${event.homeTeam}`}>
                      {event.odds.home.toFixed(2)}
                    </button>
                    <button className="btn-sm px-4 py-2 min-h-[48px] rounded focus:ring-2 focus:ring-primary-400" aria-label="Bet on draw">
                      {event.odds.draw.toFixed(2)}
                    </button>
                    <button className="btn-sm px-4 py-2 min-h-[48px] rounded focus:ring-2 focus:ring-primary-400" aria-label={`Bet on ${event.awayTeam}`}>
                      {event.odds.away.toFixed(2)}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </main>
  );
}
