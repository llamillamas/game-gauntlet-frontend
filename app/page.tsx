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
      <section className="relative bg-gg-bg border-b border-gg-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Headline intro */}
            <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <p className="text-sm font-medium tracking-widest text-gg-primary mb-4 uppercase">
                Decentralized Gaming
              </p>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-gg-text leading-tight animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Compete.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gg-primary via-gg-accent to-gg-primary">
                Bet. Win.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-8 text-lg text-gg-muted max-w-2xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              Upload games as NFTs. Create betting parties. Compete on-chain. Winner takes USDC.
              <br />
              <span className="text-gg-text font-medium">Transparent. Auditable. Yours.</span>
            </p>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/games"
                className="px-8 py-4 bg-gg-primary text-white rounded-lg font-bold text-lg btn-primary transition-smooth hover:shadow-lg"
              >
                Explore Games
              </Link>
              <Link
                href="/create-game"
                className="px-8 py-4 bg-gg-surface border border-gg-primary text-gg-primary rounded-lg font-bold text-lg transition-smooth hover:bg-gg-primary/10"
              >
                Create One
              </Link>
            </div>

            {/* Status Badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gg-muted animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <span className="w-2 h-2 bg-gg-success rounded-full animate-pulse"></span>
              <span>Live on Solana Devnet</span>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gg-primary/5 rounded-full blur-3xl animate-floatUp" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gg-secondary/5 rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gg-surface border-b border-gg-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, idx) => (
              <div
                key={stat.label}
                className="bg-gg-card/50 border border-gg-border rounded-lg p-6 text-center card-hover animate-fadeInScale transition-smooth"
                style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
              >
                <div className="text-4xl mb-3 opacity-80">{stat.icon}</div>
                <div className="text-3xl font-bold text-gg-text font-mono">{stat.value}</div>
                <div className="text-gg-muted text-xs mt-2 tracking-wider uppercase font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-20 bg-gg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-gg-primary text-sm font-medium tracking-widest uppercase mb-2">This Week</p>
              <h2 className="text-4xl font-bold text-gg-text">Featured Games</h2>
              <p className="text-gg-muted text-base mt-3">Top performers by earnings and participation</p>
            </div>
            <Link
              href="/games"
              className="text-gg-primary text-sm font-medium link-hover hidden sm:inline-block"
            >
              Browse All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game, idx) => (
              <div key={game.id} className="animate-fadeInScale" style={{ animationDelay: `${0.1 + idx * 0.05}s` }}>
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gg-surface border-t border-gg-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gg-primary text-sm font-medium tracking-widest uppercase mb-3">The Flow</p>
            <h2 className="text-4xl font-bold text-gg-text">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎮',
                title: 'Upload',
                desc: 'Link your GitHub repo. We mint it as an NFT on Solana.',
              },
              {
                icon: '🎯',
                title: 'Create a Party',
                desc: 'Select games, set the bet. Invite friends. Funds locked on-chain.',
              },
              {
                icon: '💰',
                title: 'Compete & Win',
                desc: 'Play. Compete. Winner takes the pot. Results on-chain.',
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="group relative animate-fadeInUp transition-smooth"
                style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
              >
                <div className="bg-gg-card border border-gg-border rounded-lg p-8 text-center h-full card-hover transition-smooth">
                  <div className="text-5xl mb-6 opacity-70 group-hover:opacity-100 transition-smooth">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gg-text mb-4">{item.title}</h3>
                  <p className="text-gg-muted leading-relaxed">{item.desc}</p>
                </div>

                {/* Connector line (hidden on mobile) */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-gg-border to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gg-bg border-t border-gg-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gg-text mb-6 animate-fadeInUp">
            Ready to play?
          </h2>
          <p className="text-lg text-gg-muted mb-12 max-w-2xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Connect your Phantom wallet, find an active party, or create your own. Start competing for USDC.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/parties"
              className="px-10 py-4 bg-gg-primary text-white rounded-lg font-bold btn-primary transition-smooth text-lg"
            >
              Find a Party
            </Link>
            <Link
              href="/leaderboard"
              className="px-10 py-4 bg-gg-surface border border-gg-border text-gg-text rounded-lg font-bold transition-smooth text-lg hover:border-gg-primary"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
