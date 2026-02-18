'use client';

import { useState } from 'react';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';
import { scaleIn, glow } from '@/animations/presets';

interface BetCardProps {
  eventId: string;
  title: string;
  odds: number;
  minStake?: number;
  maxStake?: number;
  onPlaceBet?: (eventId: string, stake: number) => Promise<void>;
}

export function BetCard({ eventId, title, odds, minStake = 1, maxStake = 1000, onPlaceBet }: BetCardProps) {
  const { shouldAnimate } = useMotionPreferences();
  const [stake, setStake] = useState(minStake);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const potentialWin = stake * odds;

  const handlePlaceBet = async () => {
    if (!onPlaceBet) return;
    setLoading(true);
    setError(null);
    try {
      await onPlaceBet(eventId, stake);
    } catch (err) {
      setError('Failed to place bet. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <article 
      className="card p-6 rounded-xl bg-surface dark:bg-surface-dark shadow-md hover:shadow-lg transition-shadow"
      style={shouldAnimate ? scaleIn : undefined}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold text-primary-500" style={shouldAnimate ? glow : undefined}>
        {odds.toFixed(2)}
      </p>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="text-sm text-muted dark:text-muted-dark">Stake</span>
          <input
            type="number"
            value={stake}
            onChange={(e) => setStake(Math.max(minStake, Math.min(maxStake, parseFloat(e.target.value) || 0)))}
            className="mt-1 w-full px-4 py-3 rounded-lg border border-muted-300 dark:border-muted-600 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary-400 focus:outline-none"
            min={minStake}
            max={maxStake}
            aria-label="Enter stake amount"
          />
        </label>

        <div className="flex justify-between text-sm">
          <span className="text-muted dark:text-muted-dark">Potential Win</span>
          <span className="font-semibold text-success-500">${potentialWin.toFixed(2)}</span>
        </div>

        {error && <p className="text-error text-sm" role="alert">{error}</p>}

        <button
          onClick={handlePlaceBet}
          disabled={loading || stake < minStake}
          className="w-full btn-primary px-6 py-3 min-h-[48px] rounded-lg focus:ring-2 focus:ring-primary-400 disabled:opacity-50"
          aria-busy={loading}
        >
          {loading ? 'Placing...' : 'Place Bet'}
        </button>
      </div>
    </article>
  );
}
