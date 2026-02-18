'use client';

import { useState } from 'react';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';
import { fadeIn } from '@/animations/presets';

interface User {
  name: string;
  email: string;
  avatar?: string;
  balance: number;
  verified: boolean;
}

export default function AccountPage() {
  const { shouldAnimate } = useMotionPreferences();
  const [user] = useState<User | null>(null);

  return (
    <main className="min-h-screen bg-background dark:bg-background-dark">
      <section className="container mx-auto px-4 py-8" style={shouldAnimate ? fadeIn : undefined}>
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground dark:text-foreground-dark">
          Account
        </h1>

        {user ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <article className="card p-6 rounded-xl bg-surface dark:bg-surface-dark">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold" aria-hidden="true">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-muted dark:text-muted-dark">{user.email}</p>
                  {user.verified && <span className="text-success-500 text-sm">✓ Verified</span>}
                </div>
              </div>
            </article>

            <article className="card p-6 rounded-xl bg-surface dark:bg-surface-dark">
              <h2 className="text-lg font-semibold mb-4">Balance</h2>
              <p className="text-3xl font-bold text-primary-500">${user.balance.toFixed(2)}</p>
              <div className="mt-4 flex gap-2">
                <a href="/wallet" className="btn-primary px-6 py-3 min-h-[48px] rounded-lg focus:ring-2 focus:ring-primary-400">
                  Deposit
                </a>
                <button className="btn-secondary px-6 py-3 min-h-[48px] rounded-lg focus:ring-2 focus:ring-primary-400">
                  Withdraw
                </button>
              </div>
            </article>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted dark:text-muted-dark mb-4">Please sign in to view your account</p>
            <button className="btn-primary px-6 py-3 min-h-[48px] rounded-lg focus:ring-2 focus:ring-primary-400">
              Sign In
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
