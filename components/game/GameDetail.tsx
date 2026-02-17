'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Game } from '@/types'
import { shortenAddress, getAddressExplorerUrl, getTxExplorerUrl } from '@/lib/solana'

interface GameDetailProps {
  game: Game
}

export function GameDetail({ game }: GameDetailProps) {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative w-full h-64 md:h-80 bg-gg-surface rounded-xl overflow-hidden">
        {game.preview_image ? (
          <Image
            src={game.preview_image}
            alt={game.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">🎮</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-3xl font-bold text-white">{game.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            {game.nft_mint && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gg-accent/20 text-gg-accent border border-gg-accent/30">
                NFT Owned
              </span>
            )}
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                game.status === 'active'
                  ? 'bg-gg-success/20 text-gg-success border border-gg-success/30'
                  : 'bg-gg-muted/20 text-gg-muted'
              }`}
            >
              {game.status}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gg-card border border-gg-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gg-text">{game.play_count.toLocaleString()}</div>
          <div className="text-gg-muted text-xs mt-1">Total Plays</div>
        </div>
        <div className="bg-gg-card border border-gg-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gg-accent">
            ${game.total_earnings.toLocaleString()}
          </div>
          <div className="text-gg-muted text-xs mt-1">Total Earnings</div>
        </div>
        <div className="bg-gg-card border border-gg-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gg-primary">
            ${Math.floor(game.total_earnings * 0.025).toLocaleString()}
          </div>
          <div className="text-gg-muted text-xs mt-1">Creator Earnings</div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gg-card border border-gg-border rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-gg-text">Game Info</h2>
          <p className="text-gg-muted text-sm leading-relaxed">{game.description}</p>
          <div className="space-y-2 pt-3 border-t border-gg-border">
            <div className="flex justify-between text-sm">
              <span className="text-gg-muted">Creator</span>
              <a
                href={getAddressExplorerUrl(game.creator_address)}
                target="_blank"
                rel="noreferrer"
                className="text-gg-primary hover:underline font-mono text-xs"
              >
                {game.creator || shortenAddress(game.creator_address)}
              </a>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gg-muted">Created</span>
              <span className="text-gg-text text-xs">
                {new Date(game.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gg-muted">Last Updated</span>
              <span className="text-gg-text text-xs">
                {new Date(game.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gg-card border border-gg-border rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-bold text-gg-text">On-Chain Details</h2>
          <div className="space-y-3">
            {game.github_url && (
              <div>
                <div className="text-xs text-gg-muted mb-1">GitHub Repository</div>
                <a
                  href={game.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gg-primary text-sm hover:underline flex items-center gap-1 break-all"
                >
                  <span>🐙</span>
                  {game.github_url.replace('https://github.com/', '')}
                </a>
              </div>
            )}
            {game.nft_mint && (
              <div>
                <div className="text-xs text-gg-muted mb-1">NFT Mint Address</div>
                <a
                  href={getAddressExplorerUrl(game.nft_mint)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gg-accent text-xs font-mono hover:underline break-all"
                >
                  {game.nft_mint}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Play CTA */}
      <div className="bg-gg-card border border-gg-primary/30 rounded-xl p-6 text-center">
        <h3 className="text-xl font-bold text-gg-text mb-2">Ready to Compete?</h3>
        <p className="text-gg-muted text-sm mb-4">
          Join an active party or create your own to start betting on this game.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/parties?game=${game.id}`}
            className="px-6 py-3 bg-gg-primary text-white rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
          >
            🎯 Join a Party
          </Link>
          <Link
            href={`/parties?create=1&game=${game.id}`}
            className="px-6 py-3 bg-gg-surface border border-gg-border text-gg-text rounded-lg font-semibold hover:border-gg-primary transition-colors"
          >
            + Create Party
          </Link>
        </div>
      </div>
    </div>
  )
}
