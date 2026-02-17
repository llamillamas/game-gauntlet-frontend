'use client'

import { useState } from 'react'
import { useGames } from '@/hooks/useGames'
import { GameCard } from '@/components/game/GameCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { MOCK_GAMES } from '@/lib/mock-data'
import Link from 'next/link'

const SORT_OPTIONS = [
  { value: 'earnings', label: 'Highest Earnings' },
  { value: 'plays', label: 'Most Played' },
  { value: 'newest', label: 'Newest' },
  { value: 'trending', label: 'Trending' },
]

export default function GamesPage() {
  const [sort, setSort] = useState('earnings')
  const [search, setSearch] = useState('')

  const { data, isLoading, error, refetch } = useGames({ sort, limit: 20 })

  // Fallback to mock data in dev
  const games = data?.items || MOCK_GAMES

  const filteredGames = games.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.description.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gg-text">🎮 Game Discovery</h1>
          <p className="text-gg-muted text-sm mt-1">
            {filteredGames.length} games available to bet on
          </p>
        </div>
        <Link
          href="/create-game"
          className="px-4 py-2 bg-gg-secondary text-white rounded-lg text-sm font-semibold hover:bg-opacity-80 transition-colors self-start sm:self-auto"
        >
          + Create Game
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-gg-surface border border-gg-border rounded-lg text-gg-text placeholder-gg-muted focus:outline-none focus:border-gg-primary text-sm"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2.5 bg-gg-surface border border-gg-border rounded-lg text-gg-text text-sm focus:outline-none focus:border-gg-primary"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && !data && (
        <ErrorAlert
          error={error}
          title="Failed to load games"
          onRetry={refetch}
          className="mb-6"
        />
      )}

      {/* Loading */}
      {isLoading && !data && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" label="Loading games..." />
        </div>
      )}

      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="text-center py-16">
            <span className="text-5xl">🔍</span>
            <p className="text-gg-muted mt-4">No games found matching &quot;{search}&quot;</p>
            <button
              onClick={() => setSearch('')}
              className="mt-3 text-gg-primary text-sm hover:underline"
            >
              Clear search
            </button>
          </div>
        )
      )}
    </div>
  )
}
