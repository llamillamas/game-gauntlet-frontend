'use client'

import { useState } from 'react'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable'
import { LeaderboardFilters } from '@/components/leaderboard/LeaderboardFilters'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { MOCK_LEADERBOARD } from '@/lib/mock-data'
import type { LeaderboardTimeframe, LeaderboardSortBy } from '@/types'

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('all-time')
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>('earnings')

  const { data, isLoading, error, refetch } = useLeaderboard({ timeframe, sort: sortBy })

  const entries = data?.items || MOCK_LEADERBOARD

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gg-text">🏆 Leaderboard</h1>
        <p className="text-gg-muted text-sm mt-1">Top games by earnings and engagement</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <LeaderboardFilters
          timeframe={timeframe}
          sortBy={sortBy}
          onTimeframeChange={setTimeframe}
          onSortChange={setSortBy}
        />
      </div>

      {/* Top 3 Podium */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 0, 2].map((rankIndex) => {
            const entry = entries[rankIndex]
            const medals = ['🥇', '🥈', '🥉']
            const heights = ['order-2', 'order-1', 'order-3']
            return (
              <div
                key={entry.game.id}
                className={`bg-gg-card border border-gg-border rounded-xl p-4 text-center ${heights[rankIndex]}`}
              >
                <div className="text-3xl mb-2">{medals[rankIndex]}</div>
                <div className="text-sm font-bold text-gg-text truncate">{entry.game.title}</div>
                <div className="text-xs text-gg-muted mt-1 truncate">
                  {entry.game.creator}
                </div>
                <div className="text-gg-accent font-bold mt-2">
                  ${entry.total_earnings.toLocaleString()}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Error / Loading */}
      {error && !data && (
        <ErrorAlert error={error} title="Failed to load leaderboard" onRetry={refetch} className="mb-6" />
      )}

      {isLoading && !data && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" label="Loading leaderboard..." />
        </div>
      )}

      {/* Table */}
      <div className="bg-gg-card border border-gg-border rounded-xl overflow-hidden">
        <LeaderboardTable entries={entries} />
      </div>

      {/* Pagination placeholder */}
      <div className="flex justify-center mt-6 gap-2">
        <button className="px-4 py-2 bg-gg-surface border border-gg-border text-gg-muted rounded-lg text-sm disabled:opacity-50" disabled>
          ← Previous
        </button>
        <span className="px-4 py-2 text-gg-muted text-sm">Page 1</span>
        <button className="px-4 py-2 bg-gg-surface border border-gg-border text-gg-text rounded-lg text-sm hover:border-gg-primary transition-colors">
          Next →
        </button>
      </div>
    </div>
  )
}
