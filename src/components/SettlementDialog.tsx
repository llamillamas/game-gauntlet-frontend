'use client';

import { useState } from 'react';
import type { Bet, SettlementResult } from '@/types/betting';

interface SettlementDialogProps {
  bet: Bet;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (betId: string) => Promise<SettlementResult>;
}

export function SettlementDialog({ bet, isOpen, onClose, onConfirm }: SettlementDialogProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<SettlementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setStatus('processing');
    setError(null);

    try {
      const settlementResult = await onConfirm(bet.id);
      setResult(settlementResult);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Settlement failed');
      setStatus('error');
    }
  };

  const handleClose = () => {
    setStatus('idle');
    setResult(null);
    setError(null);
    onClose();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Settle Bet</h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {status === 'idle' && (
          <>
            {/* Bet Details */}
            <div className="mb-6 space-y-3 rounded-lg bg-gray-700/50 p-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Event</span>
                <span className="font-medium text-white">{bet.eventName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Selection</span>
                <span className="text-white">{bet.outcomeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Stake</span>
                <span className="text-white">{formatCurrency(bet.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Odds</span>
                <span className="text-white">{bet.odds.toFixed(2)}</span>
              </div>
              <hr className="border-gray-600" />
              <div className="flex justify-between">
                <span className="text-gray-400">Potential Payout</span>
                <span className="text-lg font-bold text-green-400">
                  {formatCurrency(bet.potentialReturn)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 rounded-lg border border-gray-600 py-3 font-medium text-gray-300 transition-colors hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white transition-all hover:from-purple-500 hover:to-pink-500"
              >
                Confirm Settlement
              </button>
            </div>
          </>
        )}

        {status === 'processing' && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-purple-500" />
            <p className="text-gray-400">Processing settlement...</p>
            <p className="mt-2 text-sm text-gray-500">Please wait for confirmation</p>
          </div>
        )}

        {status === 'success' && result && (
          <div className="py-4 text-center">
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                result.status === 'won' ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}
            >
              {result.status === 'won' ? (
                <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h3
              className={`mb-2 text-xl font-bold ${
                result.status === 'won' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {result.status === 'won' ? 'You Won!' : 'Bet Lost'}
            </h3>
            <p className="mb-4 text-gray-400">
              {result.status === 'won'
                ? `Payout: ${formatCurrency(result.payout)}`
                : 'Better luck next time!'}
            </p>
            {result.transactionHash && (
              <p className="mb-4 font-mono text-xs text-gray-500">
                TX: {result.transactionHash.slice(0, 20)}...
              </p>
            )}
            <button
              onClick={handleClose}
              className="w-full rounded-lg bg-gray-700 py-3 font-medium text-white transition-colors hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
              <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-red-400">Settlement Failed</h3>
            <p className="mb-4 text-gray-400">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 rounded-lg border border-gray-600 py-3 font-medium text-gray-300 transition-colors hover:bg-gray-700"
              >
                Close
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-purple-600 py-3 font-medium text-white transition-colors hover:bg-purple-500"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettlementDialog;
