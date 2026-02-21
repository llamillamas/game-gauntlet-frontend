import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Game Gauntlet',
  description: 'Decentralized betting platform for competitive gaming on Solana',
  keywords: ['betting', 'esports', 'solana', 'crypto', 'gaming'],
  authors: [{ name: 'Game Gauntlet Team' }],
  openGraph: {
    title: 'Game Gauntlet',
    description: 'Decentralized betting platform for competitive gaming on Solana',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-gg-bg text-gg-text antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
