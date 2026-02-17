'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { LeaderboardEntry } from '@/types'
import { shortenAddress } from '@/lib/solana'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
}

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (!entries.length) {
    return (
      <div className="text-center py-16 text-gg-muted">
        No leaderboard data yet.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gg-border">
            <th className="text-left py-3 px-4 text-gg-muted font-medium">#</th>
            <th className="text-left py-3 px-4 text-gg-muted font-medium">Game</th>
            <th className="text-right py-3 px-4 text-gg-muted font-medium hidden sm:table-cell">Plays</th>
            <th className="text-right py-3 px-4 text-gg-muted font-medium hidden md:table-cell">Wins</th>
            <th className="text-right py-3 px-4 text-gg-muted font-medium">Earnings</th>
            <th className="text-right py-3 px-4 text-gg-muted font-medium hidden lg:table-cell">Creator Earn</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.game.id}
              className="border-b border-gg-border/50 hover:bg-gg-surface/50 transition-colors"
            >
              <td className="py-4 px-4">
                <span className="text-lg">{MEDAL[entry.rank] || entry.rank}</span>
              </td>
              <td className="py-4 px-4">
                <Link href={`/games/${entry.game.id}`} className="flex items-center gap-3 group">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gg-surface flex-shrink-0">
                    {entry.game.preview_image ? (
                      <Image
                        src={entry.game.preview_image}
                        alt={entry.game.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🎮</div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gg-text group-hover:text-gg-primary transition-colors">
                      {entry.game.title}
                    </div>
                    <div className="text-xs text-gg-muted font-mono">
                      {entry.game.creator || shortenAddress(entry.game.creator_address)}
                    </div>
                  </div>
                </Link>
              </td>
              <td className="py-4 px-4 text-right text-gg-text hidden sm:table-cell">
                {entry.play_count.toLocaleString()}
              </td>
              <td className="py-4 px-4 text-right text-gg-text hidden md:table-cell">
                {entry.win_count.toLocaleString()}
              </td>
              <td className="py-4 px-4 text-right">
                <span className="text-gg-accent font-bold">
                  ${entry.total_earnings.toLocaleString()}
                </span>
              </td>
              <td className="py-4 px-4 text-right text-gg-success hidden lg:table-cell">
                ${entry.creator_earnings.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
