'use client';

import { useState } from 'react';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';
import { fadeIn, slideUp } from '@/lib/motion';

interface Bet {
  id: string;
  event: string;
  selection: string;
  odds: number;
  stake: number;
  status: 'won' | 'lost' | 'pending';
  payout?: number;
  placedAt: string;
}

export default function HistoryPage() {
  const { shouldAnimate } = useMotionPreferences();
  const [bets] = useState<Bet[]>([]);
  const [filter, setFilter] = useState<'all' | 'won' | 'lost' | 'pending'>('all');

  const filteredBets = filter === 'all' ? bets : bets.filter(b => b.status === filter);

  return (
    <main className="min-h-screen bg-background dark:bg-background-dark">
      <section className="container mx-auto px-4 py-8" style={shouldAnimate ? fadeIn : undefined}>
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground dark:text-foreground-dark">
          Bet History
        </h1>

        <nav className="flex flex-wrap gap-2 mb-8" aria-label="Filter bets">
          {(['all', 'won', 'lost', 'pending'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 min-h-[48px] rounded-lg capitalize focus:ring-2 focus:ring-primary-400 focus:outline-none ${filter === f ? 'bg-primary-500 text-white' : 'bg-surface dark:bg-surface-dark'}`}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </nav>

        {filteredBets.length === 0 ? (
          <p className="text-center text-muted dark:text-muted-dark py-12">No bets found</p>
        ) : (
          <div className="space-y-4" style={shouldAnimate ? slideUp : undefined}>
            {filteredBets.map((bet) => (
              <article key={bet.id} className="card p-6 rounded-xl bg-surface dark:bg-surface-dark">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{bet.event}</h2>
                    <p className="text-muted dark:text-muted-dark">{bet.selection} @ {bet.odds.toFixed(2)}</p>
                    <time className="text-sm text-muted dark:text-muted-dark">{bet.placedAt}</time>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${bet.stake.toFixed(2)}</p>
                    <span className={`inline-block px-2 py-1 rounded text-sm capitalize ${bet.status === 'won' ? 'bg-success-100 text-success-700' : bet.status === 'lost' ? 'bg-error-100 text-error-700' : 'bg-warning-100 text-warning-700'}`}>
                      {bet.status}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
