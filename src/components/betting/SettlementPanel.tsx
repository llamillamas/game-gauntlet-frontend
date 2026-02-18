'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';
import { scaleInVariants, glowVariants, fadeVariants } from '@/animations/presets';

interface Settlement {
  betId: string;
  event: string;
  selection: string;
  result: 'won' | 'lost' | 'void';
  stake: number;
  odds: number;
  payout: number;
}

interface SettlementPanelProps {
  wsEndpoint?: string;
  userId?: string;
  onSettlement?: (settlement: Settlement) => void;
}

export function SettlementPanel({ wsEndpoint, userId, onSettlement }: SettlementPanelProps) {
  const { shouldAnimate } = useMotionPreferences();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [newSettlement, setNewSettlement] = useState<Settlement | null>(null);

  useEffect(() => {
    if (!wsEndpoint || !userId) return;

    const ws = new WebSocket(`${wsEndpoint}/settlements/${userId}`);

    ws.onmessage = (event) => {
      try {
        const data: Settlement = JSON.parse(event.data);
        setNewSettlement(data);
        setSettlements((prev) => [data, ...prev.slice(0, 9)]);
        onSettlement?.(data);
        setTimeout(() => setNewSettlement(null), 3000);
      } catch {}
    };

    return () => ws.close();
  }, [wsEndpoint, userId, onSettlement]);

  if (settlements.length === 0 && !newSettlement) {
    return null;
  }

  return (
    <motion.aside
      className="space-y-4"
      variants={shouldAnimate ? fadeVariants : undefined}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {newSettlement && (
        <motion.article
          className={`p-6 rounded-xl shadow-lg ${
            newSettlement.result === 'won'
              ? 'bg-success-100 dark:bg-success-900'
              : newSettlement.result === 'lost'
                ? 'bg-error-100 dark:bg-error-900'
                : 'bg-muted-100 dark:bg-muted-800'
          }`}
          variants={shouldAnimate ? scaleInVariants : undefined}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="alert"
          aria-live="polite"
        >
          <motion.div
            className="flex items-center justify-between mb-2"
            animate={shouldAnimate ? 'glow' : undefined}
            variants={shouldAnimate ? glowVariants : undefined}
          >
            <span
              className={`text-2xl font-bold uppercase ${
                newSettlement.result === 'won'
                  ? 'text-success-700 dark:text-success-300'
                  : newSettlement.result === 'lost'
                    ? 'text-error-700 dark:text-error-300'
                    : 'text-muted-700'
              }`}
            >
              {newSettlement.result === 'won'
                ? '🎉 Winner!'
                : newSettlement.result === 'lost'
                  ? 'Not this time'
                  : 'Bet Voided'}
            </span>
          </motion.div>
          <p className="font-medium">{newSettlement.event}</p>
          <p className="text-sm text-muted dark:text-muted-dark">
            {newSettlement.selection} @ {newSettlement.odds.toFixed(2)}
          </p>
          {newSettlement.result === 'won' && (
            <p className="text-3xl font-bold text-success-600 dark:text-success-400 mt-2">
              +${newSettlement.payout.toFixed(2)}
            </p>
          )}
        </motion.article>
      )}

      {settlements.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted dark:text-muted-dark">Recent Settlements</h3>
          <ul className="space-y-2">
            {settlements.slice(0, 5).map((s) => (
              <li
                key={s.betId}
                className="flex justify-between items-center p-3 rounded-lg bg-surface dark:bg-surface-dark text-sm"
              >
                <div>
                  <span className="font-medium">{s.selection}</span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-xs ${
                      s.result === 'won'
                        ? 'bg-success-100 text-success-700'
                        : s.result === 'lost'
                          ? 'bg-error-100 text-error-700'
                          : 'bg-muted-100 text-muted-700'
                    }`}
                  >
                    {s.result}
                  </span>
                </div>
                <span className={s.result === 'won' ? 'text-success-500 font-semibold' : ''}>
                  {s.result === 'won' ? `+$${s.payout.toFixed(2)}` : `-$${s.stake.toFixed(2)}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.aside>
  );
}
