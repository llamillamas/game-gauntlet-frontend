'use client';

import { useState } from 'react';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';
import { fadeIn } from '@/animations/presets';

export default function SettingsPage() {
  const { shouldAnimate, prefersReducedMotion } = useMotionPreferences();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [oddsFormat, setOddsFormat] = useState<'decimal' | 'fractional' | 'american'>('decimal');

  return (
    <main className="min-h-screen bg-background dark:bg-background-dark">
      <section className="container mx-auto px-4 py-8 max-w-2xl" style={shouldAnimate ? fadeIn : undefined}>
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground dark:text-foreground-dark">
          Settings
        </h1>

        <div className="space-y-6">
          <article className="card p-6 rounded-xl bg-surface dark:bg-surface-dark">
            <h2 className="text-lg font-semibold mb-4">Appearance</h2>
            
            <label className="flex items-center justify-between py-3 cursor-pointer">
              <span>Dark Mode</span>
              <button
                role="switch"
                aria-checked={darkMode}
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-12 h-6 rounded-full transition-colors focus:ring-2 focus:ring-primary-400 focus:outline-none ${darkMode ? 'bg-primary-500' : 'bg-muted-300'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : ''}`} />
              </button>
            </label>

            <div className="py-3">
              <span className="block mb-2">Reduced Motion</span>
              <span className="text-sm text-muted dark:text-muted-dark">
                {prefersReducedMotion ? 'Enabled (system preference)' : 'Disabled'}
              </span>
            </div>
          </article>

          <article className="card p-6 rounded-xl bg-surface dark:bg-surface-dark">
            <h2 className="text-lg font-semibold mb-4">Betting Preferences</h2>
            
            <label className="block py-3">
              <span className="block mb-2">Odds Format</span>
              <select
                value={oddsFormat}
                onChange={(e) => setOddsFormat(e.target.value as typeof oddsFormat)}
                className="w-full px-4 py-3 rounded-lg border border-muted-300 dark:border-muted-600 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary-400 focus:outline-none min-h-[48px]"
                aria-label="Select odds format"
              >
                <option value="decimal">Decimal (2.50)</option>
                <option value="fractional">Fractional (3/2)</option>
                <option value="american">American (+150)</option>
              </select>
            </label>
          </article>

          <article className="card p-6 rounded-xl bg-surface dark:bg-surface-dark">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            
            <label className="flex items-center justify-between py-3 cursor-pointer">
              <span>Push Notifications</span>
              <button
                role="switch"
                aria-checked={notifications}
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors focus:ring-2 focus:ring-primary-400 focus:outline-none ${notifications ? 'bg-primary-500' : 'bg-muted-300'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : ''}`} />
              </button>
            </label>
          </article>
        </div>
      </section>
    </main>
  );
}
