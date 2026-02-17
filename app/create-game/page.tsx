import { GameForm } from '@/components/game/GameForm'
import Link from 'next/link'

export const metadata = {
  title: 'Create Game — Game Gauntlet',
  description: 'Upload your game, mint it as an NFT, and start earning from bets.',
}

export default function CreateGamePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/games" className="text-gg-muted text-sm hover:text-gg-primary mb-6 inline-block">
        ← Back to Games
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gg-text">⚔️ Create a Game</h1>
        <p className="text-gg-muted mt-2">
          Upload your game to the Gauntlet and earn 2.5% of every bet placed on it.
          Your game will be minted as an NFT on Solana.
        </p>
      </div>

      <div className="bg-gg-card border border-gg-border rounded-xl p-6">
        <GameForm />
      </div>
    </div>
  )
}
