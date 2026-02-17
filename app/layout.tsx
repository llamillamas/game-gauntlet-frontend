import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Game Gauntlet — Compete. Bet. Win.',
  description: 'Solana-based competitive gaming platform. Own games as NFTs, bet on outcomes, earn USDC.',
  keywords: ['gaming', 'solana', 'betting', 'NFT', 'competitive'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gg-bg text-gg-text flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
