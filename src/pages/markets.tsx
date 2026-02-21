'use client';

import { useState } from 'react';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';
import { fadeIn, scaleIn } from '@/lib/motion';

interface Market {
  id: string;
  name: string;
  odds: number;
  status: 'open' | 'suspended' | 'closed';
}

export default function MarketsPage() {
  const { shouldAnimate } = useMotionPreferences();
  const [markets] = useState<Market[]>([]);
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRetry = () => setError(null);

  if (error) {
    return (
      <main className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <div className="text-center p-8" role="alert" aria-live="polite">
          <p className="text-error mb-4">{error}</p>
          <button onClick={handleRetry} className="btn-primary px-6 py-3 min-h-[48px] rounded-lg focus:ring-2 focus:ring-primary-400">
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background dark:bg-background-dark">
      <section className="container mx-auto px-4 py-8" style={shouldAnimate ? fadeIn : undefined}>
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground dark:text-foreground-dark">
          Markets
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-surface dark:bg-surface-dark rounded-xl h-40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={shouldAnimate ? scaleIn : undefined}>
            {markets.map((market) => (
              <article key={market.id} className="card p-6 rounded-xl bg-surface dark:bg-surface-dark">
                <h2 className="text-xl font-semibold">{market.name}</h2>
                <p className="text-2xl font-bold text-primary-500 mt-2">{market.odds.toFixed(2)}</p>
                <span className={`inline-block mt-2 px-2 py-1 rounded text-sm ${market.status === 'open' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'}`}>
                  {market.status}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
