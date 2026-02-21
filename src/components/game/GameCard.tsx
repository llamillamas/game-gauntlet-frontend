'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Game } from '@/types'
import { shortenAddress } from '@/lib/solana'

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.id}`}>
      <div className="bg-gg-card border border-gg-border rounded-xl overflow-hidden hover:border-gg-primary transition-colors cursor-pointer group">
        {/* Image */}
        <div className="relative w-full h-48 bg-gg-surface">
          {game.preview_image ? (
            <Image
              src={game.preview_image}
              alt={game.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              🎮
            </div>
          )}
          {/* Status badge */}
          <div className="absolute top-2 right-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                game.status === 'active'
                  ? 'bg-gg-success/20 text-gg-success'
                  : 'bg-gg-muted/20 text-gg-muted'
              }`}
            >
              {game.status}
            </span>
          </div>
          {/* NFT badge */}
          {game.nft_mint && (
            <div className="absolute top-2 left-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-gg-accent/20 text-gg-accent font-medium">
                NFT
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-gg-text text-lg group-hover:text-gg-primary transition-colors truncate">
            {game.title}
          </h3>
          <p className="text-gg-muted text-sm mt-1 line-clamp-2">
            {game.description}
          </p>
          <div className="text-xs text-gg-muted mt-2 font-mono">
            by {game.creator || shortenAddress(game.creator_address)}
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-gg-border">
            <div>
              <div className="text-xs text-gg-muted">Plays</div>
              <div className="text-sm font-bold text-gg-text">
                {game.play_count.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gg-muted">Total Earnings</div>
              <div className="text-sm font-bold text-gg-accent">
                ${game.total_earnings.toLocaleString()} USDC
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
