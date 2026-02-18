'use client';

import { useEffect, useState } from 'react';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';
import { pulse } from '@/animations/presets';

interface OddsDisplayProps {
  eventId: string;
  initialOdds?: { home: number; draw: number; away: number };
  wsEndpoint?: string;
  onOddsChange?: (odds: { home: number; draw: number; away: number }) => void;
}

export function OddsDisplay({ eventId, initialOdds, wsEndpoint, onOddsChange }: OddsDisplayProps) {
  const { shouldAnimate } = useMotionPreferences();
  const [odds, setOdds] = useState(initialOdds || { home: 0, draw: 0, away: 0 });
  const [connected, setConnected] = useState(false);
  const [changed, setChanged] = useState<'home' | 'draw' | 'away' | null>(null);

  useEffect(() => {
    if (!wsEndpoint) return;

    const ws = new WebSocket(`${wsEndpoint}/odds/${eventId}`);
    
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setOdds((prev) => {
          if (data.home !== prev.home) setChanged('home');
          else if (data.draw !== prev.draw) setChanged('draw');
          else if (data.away !== prev.away) setChanged('away');
          setTimeout(() => setChanged(null), 500);
          return data;
        });
        onOddsChange?.(data);
      } catch {}
    };

    return () => ws.close();
  }, [eventId, wsEndpoint, onOddsChange]);

  const OddButton = ({ label, value, type }: { label: string; value: number; type: 'home' | 'draw' | 'away' }) => (
    <button
      className={`flex-1 p-4 rounded-lg bg-surface-alt dark:bg-surface-alt-dark focus:ring-2 focus:ring-primary-400 focus:outline-none min-h-[48px] transition-transform ${changed === type && shouldAnimate ? 'scale-105' : ''}`}
      style={changed === type && shouldAnimate ? pulse : undefined}
      aria-label={`${label}: ${value.toFixed(2)}`}
    >
      <span className="block text-sm text-muted dark:text-muted-dark">{label}</span>
      <span className="block text-xl font-bold">{value.toFixed(2)}</span>
    </button>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <span className={`w-2 h-2 rounded-full ${connected ? 'bg-success-500' : 'bg-warning-500'}`} />
        <span className="text-muted dark:text-muted-dark" aria-live="polite">
          {connected ? 'Live odds' : 'Connecting...'}
        </span>
      </div>
      <div className="flex gap-2">
        <OddButton label="Home" value={odds.home} type="home" />
        <OddButton label="Draw" value={odds.draw} type="draw" />
        <OddButton label="Away" value={odds.away} type="away" />
      </div>
    </div>
  );
}
