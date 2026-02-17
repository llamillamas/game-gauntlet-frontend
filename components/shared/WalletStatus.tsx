'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { shortenAddress } from '@/lib/solana'
import clsx from 'clsx'

interface WalletStatusProps {
  className?: string
  showAddress?: boolean
}

export function WalletStatus({ className, showAddress = true }: WalletStatusProps) {
  const { connected, publicKey } = useWallet()

  if (!connected || !publicKey) {
    return (
      <div className={clsx('flex items-center gap-2', className)}>
        <span className="w-2 h-2 rounded-full bg-gg-error"></span>
        <span className="text-gg-muted text-sm">Not connected</span>
      </div>
    )
  }

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <span className="w-2 h-2 rounded-full bg-gg-success animate-pulse"></span>
      <span className="text-gg-success text-sm font-medium">Connected</span>
      {showAddress && (
        <span className="text-gg-muted text-xs font-mono">
          {shortenAddress(publicKey.toString())}
        </span>
      )}
    </div>
  )
}

export function WalletGate({ children }: { children: React.ReactNode }) {
  const { connected } = useWallet()

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <span className="text-4xl">🔐</span>
        <h3 className="text-xl font-semibold text-gg-text">Wallet Required</h3>
        <p className="text-gg-muted text-sm text-center max-w-xs">
          Connect your Phantom wallet to access this feature.
        </p>
        <WalletMultiButton />
      </div>
    )
  }

  return <>{children}</>
}
