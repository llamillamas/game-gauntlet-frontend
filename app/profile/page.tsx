'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useProfile, useTransactions } from '@/hooks/useProfile'
import { GameCard } from '@/components/game/GameCard'
import { WalletStatus } from '@/components/shared/WalletStatus'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { MOCK_PROFILE, MOCK_TRANSACTIONS } from '@/lib/mock-data'
import { shortenAddress, getTxExplorerUrl } from '@/lib/solana'
import type { Transaction } from '@/types'

const TX_TYPE_ICONS: Record<string, string> = {
  win: '🏆',
  loss: '💸',
  deposit: '📥',
  withdrawal: '📤',
  fee: '📋',
}

const TX_TYPE_COLORS: Record<string, string> = {
  win: 'text-gg-success',
  loss: 'text-gg-error',
  deposit: 'text-gg-warning',
  withdrawal: 'text-gg-text',
  fee: 'text-gg-muted',
}

function TransactionRow({ tx }: { tx: Transaction }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gg-border last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-xl">{TX_TYPE_ICONS[tx.type]}</span>
        <div>
          <div className="text-sm font-medium text-gg-text capitalize">{tx.type}</div>
          <div className="text-xs text-gg-muted">
            {new Date(tx.created_at).toLocaleDateString()} •{' '}
            <a
              href={getTxExplorerUrl(tx.tx_hash)}
              target="_blank"
              rel="noreferrer"
              className="hover:text-gg-primary transition-colors"
            >
              {tx.tx_hash.slice(0, 8)}...
            </a>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-bold ${TX_TYPE_COLORS[tx.type]}`}>
          {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.token}
        </div>
        <div className="text-xs text-gg-muted capitalize">{tx.status}</div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { connected, publicKey } = useWallet()

  const { data: profile, isLoading: profileLoading } = useProfile(publicKey?.toString())
  const { data: transactions, isLoading: txLoading } = useTransactions(publicKey?.toString())

  // Fallback to mock data
  const displayProfile = profile || (connected ? MOCK_PROFILE : null)
  const displayTxs = transactions || MOCK_TRANSACTIONS

  if (!connected) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">👤</div>
        <h1 className="text-3xl font-bold text-gg-text mb-4">Your Profile</h1>
        <p className="text-gg-muted mb-8">Connect your wallet to view your stats, NFTs, and transaction history.</p>
        <WalletMultiButton />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gg-text mb-2">👤 Profile</h1>

      {/* Wallet Status */}
      <div className="flex items-center gap-3 mb-8">
        <WalletStatus showAddress />
      </div>

      {profileLoading && !displayProfile ? (
        <LoadingSpinner size="lg" label="Loading profile..." />
      ) : displayProfile ? (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Earnings',
                value: `$${displayProfile.total_earnings.toLocaleString()} USDC`,
                icon: '💰',
                color: 'text-gg-accent',
              },
              {
                label: 'Win Rate',
                value: `${displayProfile.win_rate}%`,
                icon: '🎯',
                color: 'text-gg-success',
              },
              {
                label: 'Games Played',
                value: displayProfile.games_played,
                icon: '🎮',
                color: 'text-gg-text',
              },
              {
                label: 'Games Won',
                value: displayProfile.games_won,
                icon: '🏆',
                color: 'text-gg-primary',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gg-card border border-gg-border rounded-xl p-4 text-center"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-gg-muted text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Wallet Info */}
          <div className="bg-gg-card border border-gg-border rounded-xl p-5">
            <h2 className="text-lg font-bold text-gg-text mb-4">Wallet</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gg-muted text-sm">Address</span>
                <span className="text-gg-text text-sm font-mono">
                  {publicKey?.toString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gg-muted text-sm">Member Since</span>
                <span className="text-gg-text text-sm">
                  {new Date(displayProfile.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* NFT Inventory */}
          {displayProfile.nft_inventory.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gg-text mb-4">
                🎮 My Games (NFTs)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayProfile.nft_inventory.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </div>
          )}

          {/* Transaction History */}
          <div>
            <h2 className="text-lg font-bold text-gg-text mb-4">
              📋 Transaction History
            </h2>
            {txLoading ? (
              <LoadingSpinner size="md" label="Loading transactions..." />
            ) : (
              <div className="bg-gg-card border border-gg-border rounded-xl p-5">
                {displayTxs.length > 0 ? (
                  displayTxs.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
                ) : (
                  <p className="text-gg-muted text-sm text-center py-6">
                    No transactions yet
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-gg-muted">
          Failed to load profile data.
        </div>
      )}
    </div>
  )
}
