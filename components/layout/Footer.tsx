import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gg-surface border-t border-gg-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="text-lg font-bold text-gg-primary">⚔️ GameGauntlet</span>
            <p className="text-gg-muted text-sm mt-2">
              Compete. Bet. Win. On Solana.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gg-text mb-3">Platform</h4>
            <ul className="space-y-2 text-gg-muted text-sm">
              <li><Link href="/games" className="hover:text-gg-primary transition-colors">Games</Link></li>
              <li><Link href="/parties" className="hover:text-gg-primary transition-colors">Parties</Link></li>
              <li><Link href="/leaderboard" className="hover:text-gg-primary transition-colors">Leaderboard</Link></li>
              <li><Link href="/create-game" className="hover:text-gg-primary transition-colors">Create Game</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gg-text mb-3">Resources</h4>
            <ul className="space-y-2 text-gg-muted text-sm">
              <li><a href="#" className="hover:text-gg-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-gg-primary transition-colors">SDK</a></li>
              <li><a href="#" className="hover:text-gg-primary transition-colors">GitHub</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gg-text mb-3">Legal</h4>
            <ul className="space-y-2 text-gg-muted text-sm">
              <li><a href="#" className="hover:text-gg-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-gg-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gg-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gg-muted text-sm">© 2025 GameGauntlet. All rights reserved.</p>
          <div className="flex items-center gap-2 text-gg-muted text-xs">
            <span className="w-2 h-2 bg-gg-success rounded-full"></span>
            <span>Solana Devnet</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
