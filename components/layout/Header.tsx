'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import clsx from 'clsx'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/games', label: 'Games' },
  { href: '/parties', label: 'Parties' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/profile', label: 'Profile' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-gg-surface border-b border-gg-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gg-primary">⚔️</span>
            <span className="text-xl font-bold text-gg-text">
              Game<span className="text-gg-primary">Gauntlet</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-gg-primary text-white'
                    : 'text-gg-muted hover:text-gg-text hover:bg-gg-card',
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/create-game"
              className="hidden sm:block px-4 py-2 bg-gg-secondary text-white rounded-lg text-sm font-medium hover:bg-opacity-80 transition-colors"
            >
              + Create Game
            </Link>
            <WalletMultiButton />
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex overflow-x-auto gap-1 pb-2">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors',
                pathname === href
                  ? 'bg-gg-primary text-white'
                  : 'text-gg-muted hover:text-gg-text',
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
