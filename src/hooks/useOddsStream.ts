import { useState, useEffect, useCallback, useRef } from 'react';
import type { Outcome, OddsUpdate } from '@/types/betting';

interface UseOddsStreamOptions {
  eventId: string;
  initialOutcomes: Outcome[];
  pollingIntervalMs?: number;
  enableWebSocket?: boolean;
}

interface UseOddsStreamReturn {
  outcomes: Outcome[];
  updates: OddsUpdate[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastUpdateTime: Date | null;
  reconnect: () => void;
  disconnect: () => void;
}

// Mock Helius WebSocket URL - replace with real endpoint
const HELIUS_WS_URL = process.env.NEXT_PUBLIC_HELIUS_WS_URL || 'wss://mock-helius.local';
const DEFAULT_POLLING_INTERVAL = 5000;

export function useOddsStream({
  eventId,
  initialOutcomes,
  pollingIntervalMs = DEFAULT_POLLING_INTERVAL,
  enableWebSocket = true,
}: UseOddsStreamOptions): UseOddsStreamReturn {
  const [outcomes, setOutcomes] = useState<Outcome[]>(initialOutcomes);
  const [updates, setUpdates] = useState<OddsUpdate[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate mock odds update (simulates Helius RPC data)
  const generateMockUpdate = useCallback((): OddsUpdate[] => {
    const newUpdates: OddsUpdate[] = [];
    const timestamp = new Date();

    outcomes.forEach((outcome) => {
      // 25% chance of update per outcome
      if (Math.random() < 0.25) {
        const change = (Math.random() - 0.5) * 0.15; // ±7.5% change
        const newOdds = Math.max(1.01, outcome.odds + change);

        newUpdates.push({
          eventId,
          outcomeId: outcome.id,
          newOdds: parseFloat(newOdds.toFixed(2)),
          previousOdds: outcome.odds,
          timestamp,
        });
      }
    });

    return newUpdates;
  }, [eventId, outcomes]);

  // Apply updates to outcomes
  const applyUpdates = useCallback((newUpdates: OddsUpdate[]) => {
    if (newUpdates.length === 0) return;

    setOutcomes((current) =>
      current.map((outcome) => {
        const update = newUpdates.find((u) => u.outcomeId === outcome.id);
        if (update) {
          const trend: 'up' | 'down' | 'stable' =
            update.newOdds > outcome.odds
              ? 'up'
              : update.newOdds < outcome.odds
              ? 'down'
              : 'stable';
          return {
            ...outcome,
            previousOdds: outcome.odds,
            odds: update.newOdds,
            trend,
          };
        }
        return outcome;
      })
    );

    setUpdates((current) => [...newUpdates, ...current].slice(0, 50)); // Keep last 50 updates
    setLastUpdateTime(new Date());
  }, []);

  // WebSocket connection (mock for MVP)
  const connectWebSocket = useCallback(() => {
    if (!enableWebSocket) return;

    setConnectionStatus('connecting');

    // MVP: Simulate WebSocket with polling
    // In production, replace with real WebSocket:
    // wsRef.current = new WebSocket(HELIUS_WS_URL);
    
    const simulateConnection = setTimeout(() => {
      setConnectionStatus('connected');
    }, 1000);

    return () => clearTimeout(simulateConnection);
  }, [enableWebSocket]);

  // Polling fallback
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(() => {
      const newUpdates = generateMockUpdate();
      if (newUpdates.length > 0) {
        applyUpdates(newUpdates);
      }
    }, pollingIntervalMs);
  }, [generateMockUpdate, applyUpdates, pollingIntervalMs]);

  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    setConnectionStatus('connecting');
    reconnectTimeoutRef.current = setTimeout(() => {
      connectWebSocket();
      startPolling();
    }, 1000);
  }, [connectWebSocket, startPolling]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setConnectionStatus('disconnected');
  }, []);

  // Initialize connection
  useEffect(() => {
    connectWebSocket();
    startPolling();

    return () => {
      disconnect();
    };
  }, [eventId]); // Reconnect when event changes

  // Update initial outcomes when they change externally
  useEffect(() => {
    setOutcomes(initialOutcomes);
  }, [initialOutcomes]);

  return {
    outcomes,
    updates,
    connectionStatus,
    lastUpdateTime,
    reconnect,
    disconnect,
  };
}

export default useOddsStream;
