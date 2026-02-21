'use client';

import { useState } from 'react';
import type { BettingEvent, Outcome } from '@/types/betting';

interface BettingCardProps {
  event: BettingEvent;
  onSelectOutcome: (outcome: Outcome) => void;
  onSettle?: (eventId: string) => void;
  isSettleable?: boolean;
}

export function BettingCard({
  event,
  onSelectOutcome,
  onSettle,
  isSettleable = false,
}: BettingCardProps) {
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string | null>(null);

  const handleOutcomeClick = (outcome: Outcome) => {
    setSelectedOutcomeId(outcome.id);
    onSelectOutcome(outcome);
  };

  const statusColors: Record<string, string> = {
    upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    live: 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse',
    completed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-sm transition-all hover:border-gray-600 hover:bg-gray-800/70">
      {/* Event Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{event.name}</h3>
          <p className="text-sm text-gray-400">
            {new Date(event.startTime).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium uppercase ${statusColors[event.status]}`}
        >
          {event.status}
        </span>
      </div>

      {/* Odds Display */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {event.outcomes.map((outcome) => (
          <button
            key={outcome.id}
            onClick={() => handleOutcomeClick(outcome)}
            className={`group relative rounded-lg border p-3 text-center transition-all ${
              selectedOutcomeId === outcome.id
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-gray-600 bg-gray-700/50 hover:border-gray-500 hover:bg-gray-700'
            }`}
          >
            <p className="text-xs text-gray-400">{outcome.name}</p>
            <p className="mt-1 text-lg font-bold text-white">{outcome.odds.toFixed(2)}</p>
            {outcome.trend && (
              <span
                className={`absolute right-1 top-1 text-xs ${
                  outcome.trend === 'up' ? 'text-green-400' : outcome.trend === 'down' ? 'text-red-400' : 'text-gray-500'
                }`}
              >
                {outcome.trend === 'up' ? '▲' : outcome.trend === 'down' ? '▼' : '–'}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Settlement UI */}
      {isSettleable && event.status === 'completed' && onSettle && (
        <button
          onClick={() => onSettle(event.id)}
          className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 py-2 font-semibold text-white transition-all hover:from-purple-500 hover:to-pink-500"
        >
          Settle Bets
        </button>
      )}
    </div>
  );
}

export default BettingCard;
