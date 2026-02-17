import Link from 'next/link'
import { GameCard } from '@/components/game/GameCard'
import { MOCK_GAMES } from '@/lib/mock-data'

const STATS = [
  { label: 'Total Players', value: '12,400+', icon: '👥' },
  { label: 'Games Listed', value: '240+', icon: '🎮' },
  { label: 'Total Volume', value: '$1.2M USDC', icon: '💰' },
  { label: 'Active Parties', value: '38', icon: '🔥' },
]

export default function HomePage() {
  const featuredGames = MOCK_GAMES.slice(0, 4)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gg-surface border-b border-gg-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="text-5xl mb-6">⚔️</div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gg-text leading-tight">
              Compete. Bet. Win.{' '}
              <span className="text-gg-primary">On Solana.</span>
            </h1>
            <p className="mt-6 text-xl text-gg-muted max-w-2xl mx-auto leading-relaxed">
              Upload games, own them as NFTs, create betting parties, and earn USDC.
              Transparent. Auditable. Unstoppable.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/games"
                className="px-8 py-4 bg-gg-primary text-white rounded-xl font-bold text-lg hover:bg-opacity-80 transition-colors"
              >
                🎮 Play Now
              </Link>
              <Link
                href="/create-game"
                className="px-8 py-4 bg-gg-secondary text-white rounded-xl font-bold text-lg hover:bg-opacity-80 transition-colors"
              >
                + Create Game
              </Link>
            </div>

            {/* Network badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gg-muted">
              <span className="w-2 h-2 bg-gg-success rounded-full animate-pulse"></span>
              <span>Live on Solana Devnet</span>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gg-secondary/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gg-bg border-b border-gg-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-gg-card border border-gg-border rounded-xl p-4 text-center"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gg-text">{stat.value}</div>
                <div className="text-gg-muted text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gg-text">🔥 Featured Games</h2>
              <p className="text-gg-muted text-sm mt-1">Top games by earnings this week</p>
            </div>
            <Link
              href="/games"
              className="text-gg-primary text-sm hover:underline font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gg-surface border-t border-gg-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gg-text text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: '🎮',
                title: 'Upload a Game',
                desc: 'Link your GitHub repo. We mint it as an NFT on Solana.',
              },
              {
                step: '2',
                icon: '🎯',
                title: 'Create or Join a Party',
                desc: 'Select games, set a bet amount, invite friends. Funds locked on-chain.',
              },
              {
                step: '3',
                icon: '💰',
                title: 'Compete & Win USDC',
                desc: 'Play the game. Winner gets the pot. Results are auditable on-chain.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-gg-card border border-gg-border rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-xs font-bold text-gg-primary mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-lg font-bold text-gg-text mb-2">{item.title}</h3>
                <p className="text-gg-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gg-bg border-t border-gg-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gg-text mb-4">
            Ready to start competing?
          </h2>
          <p className="text-gg-muted mb-8">
            Connect your Phantom wallet and jump into an active party, or create your own.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/parties"
              className="px-8 py-4 bg-gg-primary text-white rounded-xl font-bold hover:bg-opacity-80 transition-colors"
            >
              🎯 Find a Party
            </Link>
            <Link
              href="/leaderboard"
              className="px-8 py-4 bg-gg-surface border border-gg-border text-gg-text rounded-xl font-bold hover:border-gg-primary transition-colors"
            >
              🏆 View Leaderboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
