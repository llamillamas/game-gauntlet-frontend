'use client'

import Link from 'next/link'
import type { Party } from '@/types'
import { shortenAddress } from '@/lib/solana'
import clsx from 'clsx'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-gg-warning/20 text-gg-warning border-gg-warning/30',
  ready: 'bg-gg-success/20 text-gg-success border-gg-success/30',
  active: 'bg-gg-primary/20 text-gg-primary border-gg-primary/30',
  settled: 'bg-gg-muted/20 text-gg-muted border-gg-muted/30',
  cancelled: 'bg-gg-error/20 text-gg-error border-gg-error/30',
}

interface PartyCardProps {
  party: Party
}

export function PartyCard({ party }: PartyCardProps) {
  const spotsLeft = party.max_players - party.players.length

  return (
    <Link href={`/parties/${party.id}`}>
      <div className="bg-gg-card border border-gg-border rounded-xl p-4 hover:border-gg-primary transition-colors cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gg-text text-lg leading-tight">{party.title}</h3>
          <span
            className={clsx(
              'text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ml-2',
              STATUS_STYLES[party.status],
            )}
          >
            {party.status}
          </span>
        </div>

        {/* Games */}
        <div className="mb-3">
          <div className="text-xs text-gg-muted mb-1">Games</div>
          <div className="flex flex-wrap gap-1">
            {party.games.slice(0, 3).map((game) => (
              <span
                key={game.id}
                className="text-xs px-2 py-0.5 bg-gg-surface rounded text-gg-text"
              >
                🎮 {game.title}
              </span>
            ))}
            {party.games.length > 3 && (
              <span className="text-xs text-gg-muted">+{party.games.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Pot & Players */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gg-border">
          <div>
            <div className="text-xs text-gg-muted">Bet</div>
            <div className="text-sm font-bold text-gg-accent">
              ${party.bet_amount} USDC
            </div>
          </div>
          <div>
            <div className="text-xs text-gg-muted">Total Pot</div>
            <div className="text-sm font-bold text-gg-success">
              ${party.total_pot} USDC
            </div>
          </div>
          <div>
            <div className="text-xs text-gg-muted">Players</div>
            <div className="text-sm font-bold text-gg-text">
              {party.players.length}/{party.max_players}
              {spotsLeft > 0 && (
                <span className="text-gg-success text-xs ml-1">({spotsLeft} left)</span>
              )}
            </div>
          </div>
        </div>

        {/* Creator */}
        <div className="mt-3 text-xs text-gg-muted">
          by {party.creator || shortenAddress(party.creator_address)}
        </div>
      </div>
    </Link>
  )
}
