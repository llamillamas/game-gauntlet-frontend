'use client';

import { useMotionPreferences } from '@/hooks/useMotionPreferences';
import { fadeIn } from '@/lib/motion';

export default function HomePage() {
  const { shouldAnimate } = useMotionPreferences();

  return (
    <main className="min-h-screen bg-background dark:bg-background-dark">
      <section 
        className="container mx-auto px-4 py-8 md:py-12 lg:py-16"
        style={shouldAnimate ? fadeIn : undefined}
      >
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground dark:text-foreground-dark">
            Game Gauntlet
          </h1>
          <p className="mt-4 text-lg text-muted dark:text-muted-dark max-w-2xl mx-auto">
            Real-time sports betting with live odds and instant settlements
          </p>
        </header>

        <nav className="flex flex-wrap justify-center gap-4 mb-12" aria-label="Quick actions">
          <a href="/markets" className="btn-primary focus:ring-2 focus:ring-primary-400 focus:outline-none rounded-lg px-6 py-3 min-h-[48px] flex items-center">
            Browse Markets
          </a>
          <a href="/live" className="btn-secondary focus:ring-2 focus:ring-primary-400 focus:outline-none rounded-lg px-6 py-3 min-h-[48px] flex items-center">
            Live Events
          </a>
        </nav>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={shouldAnimate ? slideUp : undefined}>
          {[1, 2, 3].map((i) => (
            <article key={i} className="card p-6 rounded-xl bg-surface dark:bg-surface-dark shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Featured Event {i}</h2>
              <p className="text-muted dark:text-muted-dark">Loading...</p>
              <div className="mt-4 flex gap-2">
                <button className="btn-sm focus:ring-2 focus:ring-primary-400 min-h-[48px] px-4 rounded" aria-label={`Place bet on event ${i}`}>
                  Place Bet
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
