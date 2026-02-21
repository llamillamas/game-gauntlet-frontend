import { useState, useCallback } from 'react';
import type { Bet, SettlementResult } from '@/types/betting';
import { api } from '@/lib/api';

interface UseSettlementOptions {
  onSuccess?: (result: SettlementResult) => void;
  onError?: (error: string) => void;
}

interface UseSettlementReturn {
  settleBet: (bet: Bet) => Promise<SettlementResult | null>;
  settleBetById: (betId: string) => Promise<SettlementResult | null>;
  isSettling: boolean;
  lastResult: SettlementResult | null;
  error: string | null;
  calculatePayout: (bet: Bet, won: boolean) => number;
  reset: () => void;
}

export function useSettlement(options: UseSettlementOptions = {}): UseSettlementReturn {
  const [isSettling, setIsSettling] = useState(false);
  const [lastResult, setLastResult] = useState<SettlementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { onSuccess, onError } = options;

  const calculatePayout = useCallback((bet: Bet, won: boolean): number => {
    if (!won) return 0;
    return bet.amount * bet.odds;
  }, []);

  const settleBetById = useCallback(
    async (betId: string): Promise<SettlementResult | null> => {
      setIsSettling(true);
      setError(null);

      try {
        const response = await api.bets.settle(betId);

        if (!response.success) {
          throw new Error(response.error || 'Settlement failed');
        }

        // MVP: Mock settlement result if API doesn't return one
        const result: SettlementResult = response.data ?? {
          betId,
          status: Math.random() > 0.5 ? 'won' : 'lost',
          payout: Math.random() > 0.5 ? parseFloat((Math.random() * 10).toFixed(4)) : 0,
          transactionHash: `mock_tx_${Date.now().toString(36)}`,
        };

        setLastResult(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown settlement error';
        setError(message);
        onError?.(message);
        return null;
      } finally {
        setIsSettling(false);
      }
    },
    [onSuccess, onError]
  );

  const settleBet = useCallback(
    async (bet: Bet): Promise<SettlementResult | null> => {
      return settleBetById(bet.id);
    },
    [settleBetById]
  );

  const reset = useCallback(() => {
    setIsSettling(false);
    setLastResult(null);
    setError(null);
  }, []);

  return {
    settleBet,
    settleBetById,
    isSettling,
    lastResult,
    error,
    calculatePayout,
    reset,
  };
}

// Utility types for external use
export type { SettlementResult };

export default useSettlement;
