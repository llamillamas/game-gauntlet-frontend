'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link'
import type { Party } from '@/types'
import { shortenAddress, getTxExplorerUrl } from '@/lib/solana'
import { useJoinParty } from '@/hooks/useParties'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const STATUS_LABELS: Record<string, string> = {
  pending: '⏳ Waiting for players',
  ready: '✅ Ready to start',
  active: '🔥 Game in progress',
  settled: '🏆 Settled',
  cancelled: '❌ Cancelled',
}

const PLAYER_STATUS_STYLE: Record<string, string> = {
  pending: 'text-gg-warning',
  ready: 'text-gg-success',
  playing: 'text-gg-primary',
  winner: 'text-gg-accent',
  loser: 'text-gg-muted',
}

interface PartyDetailProps {
  party: Party
}

export function PartyDetail({ party }: PartyDetailProps) {
  const { connected, publicKey, signTransaction } = useWallet()
  const joinParty = useJoinParty()
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState('')

  const isAlreadyJoined = party.players.some(
    (p) => p.wallet_address === publicKey?.toString(),
  )
  const spotsLeft = party.max_players - party.players.length
  const canJoin =
    !isAlreadyJoined &&
    spotsLeft > 0 &&
    party.status === 'pending' &&
    connected &&
    !joined

  const handleJoin = async () => {
    if (!connected || !publicKey || !signTransaction) {
      toast.error('Connect your wallet first')
      return
    }

    setJoining(true)
    setError('')
    try {
      // In real implementation: get deposit transaction from backend, sign it
      // const txData = await partiesApi.getJoinTransaction(party.id, publicKey.toString())
      // const tx = deserializeTransaction(txData.transaction)
      // const signed = await signTransaction(tx)
      // const serialized = serializeTransaction(signed)

      await joinParty.mutateAsync({
        partyId: party.id,
        data: {
          wallet_address: publicKey.toString(),
          signed_transaction: 'mock-signed-tx',
        },
      })

      setJoined(true)
      toast.success(`Joined! ${party.bet_amount} USDC deposited to pot.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join party')
      toast.error('Failed to join party')
    } finally {
      setJoining(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gg-card border border-gg-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gg-text">{party.title}</h1>
            <p className="text-gg-muted text-sm mt-1">
              Created by {party.creator || shortenAddress(party.creator_address)}
            </p>
            <p className="text-gg-muted text-sm mt-1">
              {STATUS_LABELS[party.status]}
            </p>
          </div>
          {/* Share button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              toast.success('Party link copied!')
            }}
            className="px-4 py-2 bg-gg-surface border border-gg-border text-gg-text rounded-lg text-sm hover:border-gg-primary transition-colors self-start"
          >
            🔗 Share
          </button>
        </div>

        {/* Pot Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gg-accent">
              ${party.total_pot}
            </div>
            <div className="text-xs text-gg-muted mt-1">Current Pot</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gg-text">
              ${party.bet_amount}
            </div>
            <div className="text-xs text-gg-muted mt-1">Bet Per Player</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gg-text">
              {party.players.length}/{party.max_players}
            </div>
            <div className="text-xs text-gg-muted mt-1">Players</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gg-muted mb-1">
            <span>Players joined</span>
            <span>{spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}</span>
          </div>
          <div className="h-2 bg-gg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gg-primary rounded-full transition-all"
              style={{
                width: `${(party.players.length / party.max_players) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {error && <ErrorAlert error={error} onRetry={() => setError('')} />}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Players List */}
        <div className="bg-gg-card border border-gg-border rounded-xl p-5">
          <h2 className="text-lg font-bold text-gg-text mb-4">Players</h2>
          <div className="space-y-3">
            {party.players.map((player, i) => (
              <div
                key={player.wallet_address}
                className="flex items-center justify-between py-2 border-b border-gg-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gg-surface flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gg-text">
                      {player.display_name || shortenAddress(player.wallet_address)}
                    </div>
                    <div className={clsx('text-xs', PLAYER_STATUS_STYLE[player.status])}>
                      {player.status}
                    </div>
                  </div>
                </div>
                {player.status === 'winner' && <span className="text-xl">🏆</span>}
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({ length: spotsLeft }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-3 py-2 border-b border-gg-border last:border-0 opacity-40"
              >
                <div className="w-8 h-8 rounded-full bg-gg-surface border border-dashed border-gg-border flex items-center justify-center text-sm">
                  ?
                </div>
                <span className="text-xs text-gg-muted">Waiting for player...</span>
              </div>
            ))}
          </div>
        </div>

        {/* Games List */}
        <div className="bg-gg-card border border-gg-border rounded-xl p-5">
          <h2 className="text-lg font-bold text-gg-text mb-4">Games in Party</h2>
          <div className="space-y-3">
            {party.games.map((game) => (
              <div
                key={game.id}
                className="flex items-center gap-3 py-2 border-b border-gg-border last:border-0"
              >
                <span className="text-2xl">🎮</span>
                <div className="flex-1">
                  <Link
                    href={`/games/${game.id}`}
                    className="text-sm font-medium text-gg-text hover:text-gg-primary transition-colors"
                  >
                    {game.title}
                  </Link>
                  <div className="text-xs text-gg-muted">{game.play_count.toLocaleString()} plays</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join CTA */}
      {party.status !== 'settled' && party.status !== 'cancelled' && (
        <div className="bg-gg-card border border-gg-border rounded-xl p-6">
          {isAlreadyJoined || joined ? (
            <div className="text-center">
              <span className="text-3xl">✅</span>
              <h3 className="text-lg font-bold text-gg-success mt-2">You&apos;re in!</h3>
              <p className="text-gg-muted text-sm mt-1">
                ${party.bet_amount} USDC deposited. Waiting for the game to start.
              </p>
            </div>
          ) : !connected ? (
            <div className="text-center">
              <p className="text-gg-muted text-sm mb-3">Connect your wallet to join</p>
              <WalletMultiButton />
            </div>
          ) : canJoin ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="text-sm text-gg-muted flex-1">
                <p>Joining will deposit <span className="text-gg-accent font-bold">${party.bet_amount} USDC</span> to the pot.</p>
                <p className="mt-1">Winner takes <span className="text-gg-success font-bold">${party.total_pot + party.bet_amount} USDC</span> (minus 5% platform fee).</p>
              </div>
              <button
                onClick={handleJoin}
                disabled={joining}
                className="px-8 py-4 bg-gg-primary text-white rounded-lg font-bold text-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {joining ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" label="" />
                    Joining...
                  </span>
                ) : (
                  `💰 Join for $${party.bet_amount} USDC`
                )}
              </button>
            </div>
          ) : (
            <div className="text-center text-gg-muted text-sm">
              {spotsLeft === 0 ? 'Party is full' : 'Party not accepting players right now'}
            </div>
          )}
        </div>
      )}

      {/* Settlement result */}
      {party.status === 'settled' && party.winner && (
        <div className="bg-gg-card border border-gg-accent/30 rounded-xl p-6 text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-2xl font-bold text-gg-accent">Game Settled!</h2>
          <p className="text-gg-muted mt-2">
            Winner: <span className="text-gg-text font-mono">{shortenAddress(party.winner)}</span>
          </p>
          <p className="text-gg-success font-bold text-xl mt-2">
            Won ${Math.floor(party.total_pot * 0.95)} USDC
          </p>
          {party.settlement_tx && (
            <a
              href={getTxExplorerUrl(party.settlement_tx)}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-3 text-gg-primary text-sm hover:underline"
            >
              View Settlement Transaction ↗
            </a>
          )}
        </div>
      )}
    </div>
  )
}
