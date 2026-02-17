'use client'

import { useParams } from 'next/navigation'
import { useGame } from '@/hooks/useGames'
import { GameDetail } from '@/components/game/GameDetail'
import { PageLoader } from '@/components/shared/LoadingSpinner'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { MOCK_GAMES } from '@/lib/mock-data'
import Link from 'next/link'

export default function GameDetailPage() {
  const params = useParams()
  const id = params.id as string

  const { data: game, isLoading, error, refetch } = useGame(id)

  // Fallback to mock in dev
  const displayGame = game || MOCK_GAMES.find((g) => g.id === id) || MOCK_GAMES[0]

  if (isLoading && !displayGame) {
    return <PageLoader />
  }

  if (error && !displayGame) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <ErrorAlert error={error} onRetry={refetch} />
      </div>
    )
  }

  if (!displayGame) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <span className="text-5xl">🎮</span>
        <h2 className="text-xl font-bold text-gg-text mt-4">Game not found</h2>
        <Link href="/games" className="text-gg-primary mt-3 inline-block hover:underline">
          ← Back to Games
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/games" className="text-gg-muted text-sm hover:text-gg-primary mb-6 inline-block">
        ← Back to Games
      </Link>
      <GameDetail game={displayGame} />
    </div>
  )
}
