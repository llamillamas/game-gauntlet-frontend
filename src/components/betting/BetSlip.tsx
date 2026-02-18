'use client';

import { useState } from 'react';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';
import { slideUp, fadeIn } from '@/animations/presets';

interface BetSelection {
  id: string;
  event: string;
  selection: string;
  odds: number;
  stake: number;
}

interface BetSlipProps {
  selections: BetSelection[];
  onRemove: (id: string) => void;
  onUpdateStake: (id: string, stake: number) => void;
  onPlaceBets: (selections: BetSelection[]) => Promise<void>;
  onClear: () => void;
}

export function BetSlip({ selections, onRemove, onUpdateStake, onPlaceBets, onClear }: BetSlipProps) {
  const { shouldAnimate } = useMotionPreferences();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalStake = selections.reduce((sum, s) => sum + s.stake, 0);
  const totalPotential = selections.reduce((sum, s) => sum + s.stake * s.odds, 0);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onPlaceBets(selections);
      onClear();
    } catch {
      setError('Failed to place bets. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  if (selections.length === 0) {
    return (
      <aside className="card p-6 rounded-xl bg-surface dark:bg-surface-dark" style={shouldAnimate ? fadeIn : undefined}>
        <h2 className="text-lg font-semibold mb-4">Bet Slip</h2>
        <p className="text-muted dark:text-muted-dark text-center py-8">No selections yet</p>
      </aside>
    );
  }

  return (
    <aside className="card p-6 rounded-xl bg-surface dark:bg-surface-dark" style={shouldAnimate ? slideUp : undefined}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Bet Slip ({selections.length})</h2>
        <button onClick={onClear} className="text-sm text-primary-500 hover:underline focus:ring-2 focus:ring-primary-400 focus:outline-none px-2 py-1 rounded">
          Clear All
        </button>
      </div>

      <ul className="space-y-3 mb-4">
        {selections.map((sel) => (
          <li key={sel.id} className="p-3 rounded-lg bg-background dark:bg-background-dark">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-sm">{sel.event}</p>
                <p className="text-xs text-muted dark:text-muted-dark">{sel.selection}</p>
              </div>
              <button
                onClick={() => onRemove(sel.id)}
                className="text-muted hover:text-error p-1 focus:ring-2 focus:ring-primary-400 rounded"
                aria-label={`Remove ${sel.selection}`}
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary-500 font-bold">{sel.odds.toFixed(2)}</span>
              <input
                type="number"
                value={sel.stake}
                onChange={(e) => onUpdateStake(sel.id, parseFloat(e.target.value) || 0)}
                className="flex-1 px-3 py-2 rounded border border-muted-300 dark:border-muted-600 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary-400 focus:outline-none text-sm"
                min="1"
                aria-label={`Stake for ${sel.selection}`}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-muted-200 dark:border-muted-700 pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-muted dark:text-muted-dark">Total Stake</span>
          <span className="font-semibold">${totalStake.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted dark:text-muted-dark">Potential Win</span>
          <span className="font-bold text-success-500">${totalPotential.toFixed(2)}</span>
        </div>
      </div>

      {error && <p className="text-error text-sm mt-2" role="alert">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading || totalStake <= 0}
        className="w-full mt-4 btn-primary px-6 py-3 min-h-[48px] rounded-lg focus:ring-2 focus:ring-primary-400 disabled:opacity-50"
        aria-busy={loading}
      >
        {loading ? 'Placing Bets...' : `Place ${selections.length} Bet${selections.length > 1 ? 's' : ''}`}
      </button>
    </aside>
  );
}
