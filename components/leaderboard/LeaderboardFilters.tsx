'use client'

import clsx from 'clsx'
import type { LeaderboardTimeframe, LeaderboardSortBy } from '@/types'

interface LeaderboardFiltersProps {
  timeframe: LeaderboardTimeframe
  sortBy: LeaderboardSortBy
  onTimeframeChange: (t: LeaderboardTimeframe) => void
  onSortChange: (s: LeaderboardSortBy) => void
}

const TIMEFRAMES: { value: LeaderboardTimeframe; label: string }[] = [
  { value: 'all-time', label: 'All Time' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
]

const SORTS: { value: LeaderboardSortBy; label: string }[] = [
  { value: 'earnings', label: 'Highest Earnings' },
  { value: 'plays', label: 'Most Played' },
  { value: 'wins', label: 'Most Wins' },
  { value: 'trending', label: 'Trending' },
]

export function LeaderboardFilters({
  timeframe,
  sortBy,
  onTimeframeChange,
  onSortChange,
}: LeaderboardFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Timeframe */}
      <div>
        <div className="text-xs text-gg-muted mb-1.5">Timeframe</div>
        <div className="flex gap-1 bg-gg-surface rounded-lg p-1 border border-gg-border">
          {TIMEFRAMES.map((t) => (
            <button
              key={t.value}
              onClick={() => onTimeframeChange(t.value)}
              className={clsx(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                timeframe === t.value
                  ? 'bg-gg-primary text-white'
                  : 'text-gg-muted hover:text-gg-text',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <div className="text-xs text-gg-muted mb-1.5">Sort By</div>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as LeaderboardSortBy)}
          className="px-3 py-2 bg-gg-surface border border-gg-border rounded-lg text-gg-text text-sm focus:outline-none focus:border-gg-primary"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
