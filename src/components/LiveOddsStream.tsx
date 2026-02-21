'use client';

import { useEffect, useState, useCallback } from 'react';
import type { OddsUpdate, Outcome } from '@/types/betting';

interface LiveOddsStreamProps {
  eventId: string;
  outcomes: Outcome[];
  onOddsUpdate: (updates: OddsUpdate[]) => void;
  connectionStatus?: 'connecting' | 'connected' | 'disconnected' | 'error';
}

// Mock Helius WebSocket for MVP - replace with real implementation
const MOCK_UPDATE_INTERVAL = 5000;

export function LiveOddsStream({
  eventId,
  outcomes,
  onOddsUpdate,
  connectionStatus: externalStatus,
}: LiveOddsStreamProps) {
  const [internalStatus, setInternalStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [updateCount, setUpdateCount] = useState(0);

  const status = externalStatus ?? internalStatus;

  // Simulate live odds updates (mock Helius RPC)
  const generateMockUpdate = useCallback((): OddsUpdate[] => {
    const updates: OddsUpdate[] = [];
    
    outcomes.forEach((outcome) => {
      // 30% chance of update per outcome
      if (Math.random() < 0.3) {
        const change = (Math.random() - 0.5) * 0.2; // ±10% change
        const newOdds = Math.max(1.01, outcome.odds + change);
        
        updates.push({
          eventId,
          outcomeId: outcome.id,
          newOdds: parseFloat(newOdds.toFixed(2)),
          previousOdds: outcome.odds,
          timestamp: new Date(),
        });
      }
    });
    
    return updates;
  }, [eventId, outcomes]);

  useEffect(() => {
    // Simulate WebSocket connection
    const connectTimeout = setTimeout(() => {
      setInternalStatus('connected');
    }, 1000);

    // Simulate periodic updates
    const updateInterval = setInterval(() => {
      if (status === 'connected') {
        const updates = generateMockUpdate();
        if (updates.length > 0) {
          onOddsUpdate(updates);
          setLastUpdate(new Date());
          setUpdateCount((c) => c + updates.length);
        }
      }
    }, MOCK_UPDATE_INTERVAL);

    return () => {
      clearTimeout(connectTimeout);
      clearInterval(updateInterval);
    };
  }, [status, generateMockUpdate, onOddsUpdate]);

  const statusConfig = {
    connecting: {
      color: 'bg-yellow-400',
      text: 'Connecting...',
      animate: true,
    },
    connected: {
      color: 'bg-green-400',
      text: 'Live',
      animate: true,
    },
    disconnected: {
      color: 'bg-gray-400',
      text: 'Disconnected',
      animate: false,
    },
    error: {
      color: 'bg-red-400',
      text: 'Error',
      animate: false,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className={`block h-3 w-3 rounded-full ${config.color}`} />
            {config.animate && (
              <span
                className={`absolute inset-0 animate-ping rounded-full ${config.color} opacity-75`}
              />
            )}
          </div>
          <div>
            <p className="font-medium text-white">Odds Stream</p>
            <p className="text-sm text-gray-400">{config.text}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-400">
            {updateCount} update{updateCount !== 1 ? 's' : ''}
          </p>
          {lastUpdate && (
            <p className="text-xs text-gray-500">
              Last: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Live Updates Feed */}
      {status === 'connected' && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-gray-500">Real-time odds from Helius RPC</p>
          <div className="flex flex-wrap gap-2">
            {outcomes.map((outcome) => (
              <div
                key={outcome.id}
                className={`rounded-md px-2 py-1 text-xs ${
                  outcome.trend === 'up'
                    ? 'bg-green-500/20 text-green-400'
                    : outcome.trend === 'down'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-gray-700/50 text-gray-400'
                }`}
              >
                {outcome.name}: {outcome.odds.toFixed(2)}
                {outcome.trend === 'up' && ' ↑'}
                {outcome.trend === 'down' && ' ↓'}
              </div>
            ))}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 rounded-md bg-red-500/10 p-3 text-sm text-red-400">
          Failed to connect to odds stream. Retrying...
        </div>
      )}

      {status === 'disconnected' && (
        <div className="mt-4 rounded-md bg-gray-700/50 p-3 text-sm text-gray-400">
          Stream disconnected. Odds may be outdated.
        </div>
      )}
    </div>
  );
}

export default LiveOddsStream;
