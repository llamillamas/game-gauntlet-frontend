'use client';

import { useState } from 'react';
import type { WalletState } from '@/types/betting';

interface WalletInfoProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

export function WalletInfo({
  wallet,
  onConnect,
  onDisconnect,
  onDeposit,
  onWithdraw,
}: WalletInfoProps) {
  const [showActions, setShowActions] = useState(false);
  const [actionMode, setActionMode] = useState<'deposit' | 'withdraw' | null>(null);
  const [amount, setAmount] = useState('');

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(balance);
  };

  const handleAction = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (actionMode === 'deposit') {
      onDeposit(numAmount);
    } else if (actionMode === 'withdraw') {
      onWithdraw(numAmount);
    }

    setAmount('');
    setActionMode(null);
  };

  if (!wallet.connected) {
    return (
      <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20">
            <svg
              className="h-8 w-8 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">Connect Wallet</h3>
          <p className="mb-4 text-sm text-gray-400">
            Connect your Phantom wallet to start betting
          </p>
          <button
            onClick={onConnect}
            className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white transition-all hover:from-purple-500 hover:to-pink-500"
          >
            Connect Phantom
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6">
      {/* Connected Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-green-400" />
          <span className="font-mono text-sm text-gray-300">
            {wallet.address && formatAddress(wallet.address)}
          </span>
        </div>
        <button
          onClick={onDisconnect}
          className="text-sm text-gray-400 transition-colors hover:text-red-400"
        >
          Disconnect
        </button>
      </div>

      {/* Balance Display */}
      <div className="mb-4 rounded-lg bg-gray-700/50 p-4">
        <p className="text-sm text-gray-400">Available Balance</p>
        <p className="text-3xl font-bold text-white">
          {formatBalance(wallet.balance)} <span className="text-lg text-gray-400">SOL</span>
        </p>
        {wallet.pendingBalance > 0 && (
          <p className="mt-1 text-sm text-yellow-400">
            +{formatBalance(wallet.pendingBalance)} SOL pending
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {!actionMode && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActionMode('deposit')}
            className="rounded-lg border border-green-500/30 bg-green-500/10 py-2 font-medium text-green-400 transition-all hover:bg-green-500/20"
          >
            Deposit
          </button>
          <button
            onClick={() => setActionMode('withdraw')}
            className="rounded-lg border border-blue-500/30 bg-blue-500/10 py-2 font-medium text-blue-400 transition-all hover:bg-blue-500/20"
          >
            Withdraw
          </button>
        </div>
      )}

      {/* Action Form */}
      {actionMode && (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-gray-400">
              {actionMode === 'deposit' ? 'Deposit' : 'Withdraw'} Amount (SOL)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActionMode(null)}
              className="flex-1 rounded-lg border border-gray-600 py-2 text-gray-300 transition-colors hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleAction}
              className={`flex-1 rounded-lg py-2 font-medium text-white transition-all ${
                actionMode === 'deposit'
                  ? 'bg-green-600 hover:bg-green-500'
                  : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletInfo;
