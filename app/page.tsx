import Link from 'next/link'
import { GameCard } from '@/components/game/GameCard'
import { MOCK_GAMES } from '@/lib/mock-data'

const STATS = [
  { label: 'Players', value: '12,400' },
  { label: 'Games', value: '240' },
  { label: 'Volume', value: '$1.2M' },
  { label: 'Parties', value: '38' },
]

export default function HomePage() {
  const featuredGames = MOCK_GAMES.slice(0, 4)

  return (
    <div>
      {/* Hero Section - Asymmetric, Editorial */}
      <section className="relative bg-gg-bg border-b border-gg-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left: Headline + Subtext */}
            <div className="animate-slideInLeft">
              <p className="text-gg-muted text-sm mb-6 tracking-widest">GAME GAUNTLET</p>
              <h1 className="text-6xl md:text-7xl font-black text-gg-text leading-tight mb-8">
                Win<br />
                <span className="text-gg-primary">USDC</span>
                <br />
                on chain.
              </h1>
              <p className="text-lg text-gg-muted leading-relaxed mb-12 max-w-sm">
                Upload your game. Own it. Compete for real money. No middleman. No limits.
              </p>
              <Link
                href="/games"
                className="inline-block px-8 py-4 bg-gg-primary text-white rounded-lg font-bold btn-primary transition-smooth hover:shadow-lg"
              >
                Start Competing
              </Link>
            </div>

            {/* Right: Stats Grid (Asymmetric) */}
            <div className="grid grid-cols-2 gap-6 animate-fadeInScale" style={{ animationDelay: '0.2s' }}>
              {STATS.map((stat, idx) => (
                <div key={stat.label} className="border-l-2 border-gg-primary pl-6 py-4">
                  <div className="text-3xl md:text-4xl font-black text-gg-text font-mono">{stat.value}</div>
                  <div className="text-xs text-gg-muted uppercase tracking-wider mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Status line */}
          <div className="mt-16 pt-8 border-t border-gg-border text-sm text-gg-muted">
            Live on Solana Devnet
          </div>
        </div>

        {/* Animated accent */}
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gg-primary/3 rounded-full blur-3xl pointer-events-none -mr-48 animate-floatUp" />
      </section>

      {/* Featured Games - Editorial Grid */}
      <section className="py-24 bg-gg-surface border-b border-gg-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-5xl font-black text-gg-text mb-4">
              Top Games
            </h2>
            <p className="text-gg-muted text-lg max-w-2xl">
              The most competitive games this week. Join thousands of players competing for USDC.
            </p>
          </div>

          {/* Asymmetric grid: 2 large + 2 small */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* First two games: larger */}
            {featuredGames.slice(0, 2).map((game, idx) => (
              <div 
                key={game.id} 
                className="md:col-span-1.5 animate-fadeInScale card-hover transition-smooth"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <GameCard game={game} />
              </div>
            ))}

            {/* Right column: 2 smaller games stacked */}
            <div className="space-y-6">
              {featuredGames.slice(2, 4).map((game, idx) => (
                <div 
                  key={game.id} 
                  className="animate-fadeInScale card-hover transition-smooth"
                  style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
                >
                  <GameCard game={game} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/games"
              className="inline-block px-8 py-3 border border-gg-primary text-gg-primary rounded-lg font-bold transition-smooth hover:bg-gg-primary/10"
            >
              Browse All Games
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Editorial */}
      <section className="py-24 bg-gg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-black text-gg-text mb-16">
            The Flow
          </h2>

          {/* Asymmetric layout: staggered cards */}
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center animate-fadeInUp">
              <div>
                <h3 className="text-3xl font-black text-gg-text mb-4">Upload Your Game</h3>
                <p className="text-lg text-gg-muted leading-relaxed">
                  Connect your GitHub repo. We verify it, mint an NFT, and make it live. You own it forever on Solana.
                </p>
              </div>
              <div className="h-48 bg-gg-border/20 rounded-lg border border-gg-border border-dashed flex items-center justify-center">
                <p className="text-gg-muted">Game Preview</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="h-48 bg-gg-border/20 rounded-lg border border-gg-border border-dashed flex items-center justify-center order-2 md:order-1">
                <p className="text-gg-muted">Party Dashboard</p>
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-3xl font-black text-gg-text mb-4">Create or Join a Party</h3>
                <p className="text-lg text-gg-muted leading-relaxed">
                  Select 2-4 games, set the stakes, invite players. Funds go into escrow. Everyone commits, nobody cheats.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div>
                <h3 className="text-3xl font-black text-gg-text mb-4">Compete & Claim</h3>
                <p className="text-lg text-gg-muted leading-relaxed">
                  Play. Record your score on-chain. Winner takes USDC. It's that simple. No disputes, no trust required.
                </p>
              </div>
              <div className="h-48 bg-gg-border/20 rounded-lg border border-gg-border border-dashed flex items-center justify-center">
                <p className="text-gg-muted">Leaderboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Bold */}
      <section className="py-32 bg-gg-surface border-t border-gg-border">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-slideInLeft">
              <h2 className="text-6xl font-black text-gg-text mb-8 leading-tight">
                Join thousands competing for USDC.
              </h2>
              <p className="text-lg text-gg-muted mb-8 leading-relaxed">
                Wallet connected? Pick a game. Bet what you want. Win real money. Every transaction on-chain, every result auditable.
              </p>
              <div className="space-y-3">
                <Link
                  href="/parties"
                  className="block px-8 py-4 bg-gg-primary text-white rounded-lg font-bold btn-primary transition-smooth text-center"
                >
                  Find an Active Party
                </Link>
                <Link
                  href="/create-game"
                  className="block px-8 py-4 border border-gg-border text-gg-text rounded-lg font-bold transition-smooth text-center hover:bg-gg-card"
                >
                  Create Your Own
                </Link>
              </div>
            </div>

            {/* Right: Leaderboard preview */}
            <div className="animate-fadeInScale" style={{ animationDelay: '0.2s' }}>
              <div className="h-96 bg-gg-card border border-gg-border rounded-lg flex items-center justify-center">
                <p className="text-gg-muted">Leaderboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
