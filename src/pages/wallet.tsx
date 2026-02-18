'use client';

import { useState } from 'react';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';
import { fadeIn, scaleIn } from '@/animations/presets';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'bet' | 'win';
  amount: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function WalletPage() {
  const { shouldAnimate } = useMotionPreferences();
  const [balance] = useState(0);
  const [transactions] = useState<Transaction[]>([]);
  const [depositAmount, setDepositAmount] = useState('');

  const handleDeposit = () => {
    if (parseFloat(depositAmount) > 0) {
      // API call: POST /api/wallet/deposit
      setDepositAmount('');
    }
  };

  return (
    <main className="min-h-screen bg-background dark:bg-background-dark">
      <section className="container mx-auto px-4 py-8" style={shouldAnimate ? fadeIn : undefined}>
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground dark:text-foreground-dark">
          Wallet
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <article className="lg:col-span-1 card p-6 rounded-xl bg-surface dark:bg-surface-dark" style={shouldAnimate ? scaleIn : undefined}>
            <h2 className="text-lg font-semibold mb-2">Balance</h2>
            <p className="text-4xl font-bold text-primary-500">${balance.toFixed(2)}</p>
            
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm text-muted dark:text-muted-dark">Deposit Amount</span>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-muted-300 dark:border-muted-600 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary-400 focus:outline-none"
                  placeholder="0.00"
                  min="0"
                  aria-label="Enter deposit amount"
                />
              </label>
              <button onClick={handleDeposit} className="w-full btn-primary px-6 py-3 min-h-[48px] rounded-lg focus:ring-2 focus:ring-primary-400">
                Deposit
              </button>
            </div>
          </article>

          <article className="lg:col-span-2 card p-6 rounded-xl bg-surface dark:bg-surface-dark">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            {transactions.length === 0 ? (
              <p className="text-muted dark:text-muted-dark">No transactions yet</p>
            ) : (
              <ul className="space-y-2">
                {transactions.map((tx) => (
                  <li key={tx.id} className="flex justify-between items-center py-2 border-b border-muted-200 dark:border-muted-700">
                    <div>
                      <span className="font-medium capitalize">{tx.type}</span>
                      <time className="block text-sm text-muted dark:text-muted-dark">{tx.timestamp}</time>
                    </div>
                    <span className={tx.type === 'deposit' || tx.type === 'win' ? 'text-success-500' : 'text-error-500'}>
                      {tx.type === 'deposit' || tx.type === 'win' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}
