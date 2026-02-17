'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/navigation'
import { useCreateParty } from '@/hooks/useParties'
import { useGames } from '@/hooks/useGames'
import { MOCK_GAMES } from '@/lib/mock-data'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import toast from 'react-hot-toast'
import type { Game } from '@/types'

export function PartyForm() {
  const { connected, publicKey } = useWallet()
  const router = useRouter()
  const createParty = useCreateParty()

  const [title, setTitle] = useState('')
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([])
  const [betAmount, setBetAmount] = useState(10)
  const [maxPlayers, setMaxPlayers] = useState(4)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'form' | 'submitting' | 'done'>('form')
  const [shareUrl, setShareUrl] = useState('')
  const [partyId, setPartyId] = useState('')

  // Use mock data if API fails
  const { data: gamesData } = useGames({ limit: 20 })
  const games: Game[] = gamesData?.items || MOCK_GAMES

  const toggleGame = (id: string) => {
    setSelectedGameIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    )
  }

  const validate = (): boolean => {
    if (!title.trim()) {
      setError('Party name is required')
      return false
    }
    if (selectedGameIds.length === 0) {
      setError('Select at least one game')
      return false
    }
    if (betAmount < 1) {
      setError('Minimum bet is 1 USDC')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validate()) return

    setStep('submitting')
    try {
      const result = await createParty.mutateAsync({
        title,
        game_ids: selectedGameIds,
        bet_amount: betAmount,
        max_players: maxPlayers,
      })
      setShareUrl(result.share_url || `${window.location.origin}/parties/${result.party.id}`)
      setPartyId(result.party.id)
      setStep('done')
      toast.success('Party created! Share the link with friends.')
    } catch (err) {
      setStep('form')
      setError(err instanceof Error ? err.message : 'Failed to create party')
      toast.error('Failed to create party')
    }
  }

  if (step === 'done') {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gg-text mb-2">Party Created!</h2>
        <p className="text-gg-muted mb-6">Share this link with your friends to join.</p>
        <div className="flex items-center gap-2 bg-gg-surface border border-gg-border rounded-lg p-3 mb-6">
          <input
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-gg-text text-sm font-mono outline-none"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl)
              toast.success('Link copied!')
            }}
            className="px-3 py-1.5 bg-gg-primary text-white rounded text-sm font-medium hover:bg-opacity-80 transition-colors"
          >
            Copy
          </button>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push(`/parties/${partyId}`)}
            className="px-6 py-3 bg-gg-primary text-white rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
          >
            View Party →
          </button>
          <button
            onClick={() => router.push('/parties')}
            className="px-6 py-3 bg-gg-surface border border-gg-border text-gg-text rounded-lg font-semibold hover:border-gg-primary transition-colors"
          >
            Browse All Parties
          </button>
        </div>
      </div>
    )
  }

  if (step === 'submitting') {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">👻</div>
        <h2 className="text-xl font-bold text-gg-text mb-2">Creating Party...</h2>
        <p className="text-gg-muted text-sm mb-6">Confirm the transaction in your Phantom wallet.</p>
        <LoadingSpinner size="lg" label="" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorAlert error={error} onRetry={() => setError('')} />}

      {/* Party Name */}
      <div>
        <label className="block text-sm font-medium text-gg-text mb-2">
          Party Name <span className="text-gg-error">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Weekend Warriors, High Stakes Arena..."
          className="w-full px-4 py-3 bg-gg-surface border border-gg-border rounded-lg text-gg-text placeholder-gg-muted focus:outline-none focus:border-gg-primary transition-colors"
        />
      </div>

      {/* Game Selection */}
      <div>
        <label className="block text-sm font-medium text-gg-text mb-2">
          Select Games <span className="text-gg-error">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {games.map((game) => (
            <label
              key={game.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedGameIds.includes(game.id)
                  ? 'border-gg-primary bg-gg-primary/10'
                  : 'border-gg-border bg-gg-surface hover:border-gg-muted'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedGameIds.includes(game.id)}
                onChange={() => toggleGame(game.id)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedGameIds.includes(game.id)
                    ? 'border-gg-primary bg-gg-primary'
                    : 'border-gg-border'
                }`}
              >
                {selectedGameIds.includes(game.id) && (
                  <span className="text-white text-xs">✓</span>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gg-text">{game.title}</div>
                <div className="text-xs text-gg-muted">{game.play_count.toLocaleString()} plays</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Bet Amount Slider */}
      <div>
        <label className="block text-sm font-medium text-gg-text mb-2">
          Bet Amount:{' '}
          <span className="text-gg-accent font-bold">${betAmount} USDC</span>
        </label>
        <input
          type="range"
          min={1}
          max={500}
          step={1}
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="w-full accent-gg-primary"
        />
        <div className="flex justify-between text-xs text-gg-muted mt-1">
          <span>$1</span>
          <span>$500</span>
        </div>
        <p className="text-xs text-gg-muted mt-2">
          Total pot: <span className="text-gg-success font-medium">${betAmount * maxPlayers} USDC</span> (with {maxPlayers} players)
        </p>
      </div>

      {/* Max Players */}
      <div>
        <label className="block text-sm font-medium text-gg-text mb-2">
          Max Players: <span className="text-gg-text font-bold">{maxPlayers}</span>
        </label>
        <div className="flex gap-2">
          {[2, 4, 6, 8].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setMaxPlayers(n)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                maxPlayers === n
                  ? 'bg-gg-primary text-white'
                  : 'bg-gg-surface border border-gg-border text-gg-muted hover:border-gg-primary'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gg-surface border border-gg-border rounded-lg p-4 text-sm space-y-2">
        <h4 className="font-semibold text-gg-text">Party Summary</h4>
        <div className="flex justify-between">
          <span className="text-gg-muted">Games selected</span>
          <span className="text-gg-text">{selectedGameIds.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gg-muted">Bet per player</span>
          <span className="text-gg-accent">${betAmount} USDC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gg-muted">Max players</span>
          <span className="text-gg-text">{maxPlayers}</span>
        </div>
        <div className="flex justify-between border-t border-gg-border pt-2">
          <span className="text-gg-muted">Maximum pot</span>
          <span className="text-gg-success font-bold">${betAmount * maxPlayers} USDC</span>
        </div>
      </div>

      {/* Submit */}
      {connected ? (
        <button
          type="submit"
          disabled={createParty.isPending}
          className="w-full py-4 bg-gg-primary text-white rounded-lg font-bold text-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createParty.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" label="" />
              Creating Party...
            </span>
          ) : (
            '🎯 Create Party'
          )}
        </button>
      ) : (
        <div className="text-center">
          <p className="text-gg-muted text-sm mb-3">Connect your wallet to create a party</p>
          <WalletMultiButton />
        </div>
      )}
    </form>
  )
}
