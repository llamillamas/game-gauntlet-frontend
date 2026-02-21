'use client';

import { useMemo } from 'react';
import type { Outcome } from '@/types/betting';

interface OddsGridProps {
  outcomes: Outcome[];
  onSelect: (outcome: Outcome) => void;
  selectedId?: string;
  showTrends?: boolean;
}

export function OddsGrid({ outcomes, onSelect, selectedId, showTrends = true }: OddsGridProps) {
  const sortedOutcomes = useMemo(() => {
    return [...outcomes].sort((a, b) => a.odds - b.odds);
  }, [outcomes]);

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable'): string => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '';
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'stable'): string => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-500';
    }
  };

  const calculateImpliedProbability = (odds: number): string => {
    return ((1 / odds) * 100).toFixed(1);
  };

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Odds Matrix</h3>
        <span className="text-xs text-gray-500">Click to select</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 text-left">
              <th className="pb-3 text-sm font-medium text-gray-400">Outcome</th>
              <th className="pb-3 text-center text-sm font-medium text-gray-400">Current Odds</th>
              {showTrends && (
                <>
                  <th className="pb-3 text-center text-sm font-medium text-gray-400">Previous</th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-400">Trend</th>
                </>
              )}
              <th className="pb-3 text-center text-sm font-medium text-gray-400">Implied %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {sortedOutcomes.map((outcome) => (
              <tr
                key={outcome.id}
                onClick={() => onSelect(outcome)}
                className={`cursor-pointer transition-colors ${
                  selectedId === outcome.id
                    ? 'bg-purple-500/20'
                    : 'hover:bg-gray-700/30'
                }`}
              >
                <td className="py-3 font-medium text-white">{outcome.name}</td>
                <td className="py-3 text-center">
                  <span
                    className={`inline-block rounded-lg px-3 py-1 font-bold ${
                      selectedId === outcome.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    {outcome.odds.toFixed(2)}
                  </span>
                </td>
                {showTrends && (
                  <>
                    <td className="py-3 text-center text-gray-400">
                      {outcome.previousOdds?.toFixed(2) || '—'}
                    </td>
                    <td className={`py-3 text-center text-lg ${getTrendColor(outcome.trend)}`}>
                      {getTrendIcon(outcome.trend)}
                    </td>
                  </>
                )}
                <td className="py-3 text-center text-gray-300">
                  {calculateImpliedProbability(outcome.odds)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-lg bg-gray-700/30 p-3">
        <p className="text-xs text-gray-400">
          <strong className="text-gray-300">Market Margin:</strong>{' '}
          {(
            sortedOutcomes.reduce((acc, o) => acc + 1 / o.odds, 0) * 100 -
            100
          ).toFixed(2)}
          %
        </p>
      </div>
    </div>
  );
}

export default OddsGrid;
