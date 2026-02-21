import { useState, useCallback, useEffect } from 'react';
import type { WalletState } from '@/types/betting';

interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
}

interface WindowWithPhantom extends Window {
  phantom?: {
    solana?: PhantomProvider;
  };
}

interface UseWalletConnectionReturn {
  wallet: WalletState;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  isPhantomInstalled: boolean;
  error: string | null;
}

const INITIAL_WALLET_STATE: WalletState = {
  connected: false,
  address: null,
  balance: 0,
  pendingBalance: 0,
};

// Mock balance for MVP - replace with real Solana RPC call
const getMockBalance = (): number => {
  return parseFloat((Math.random() * 10 + 1).toFixed(4));
};

export function useWalletConnection(): UseWalletConnectionReturn {
  const [wallet, setWallet] = useState<WalletState>(INITIAL_WALLET_STATE);
  const [error, setError] = useState<string | null>(null);
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);

  // Check for Phantom wallet on mount
  useEffect(() => {
    const checkPhantom = () => {
      const windowWithPhantom = window as WindowWithPhantom;
      const phantom = windowWithPhantom.phantom?.solana;
      setIsPhantomInstalled(!!phantom?.isPhantom);
    };

    // Check after DOM is ready
    if (typeof window !== 'undefined') {
      checkPhantom();
      // Re-check after short delay (Phantom may inject later)
      const timeout = setTimeout(checkPhantom, 1000);
      return () => clearTimeout(timeout);
    }
  }, []);

  const getProvider = useCallback((): PhantomProvider | null => {
    if (typeof window === 'undefined') return null;
    const windowWithPhantom = window as WindowWithPhantom;
    return windowWithPhantom.phantom?.solana ?? null;
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!wallet.address) return;

    try {
      // MVP: Mock balance - replace with real Solana RPC
      const balance = getMockBalance();
      setWallet((current) => ({ ...current, balance }));
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  }, [wallet.address]);

  const connect = useCallback(async (): Promise<boolean> => {
    setError(null);

    try {
      const provider = getProvider();

      if (!provider) {
        // MVP: Mock connection when Phantom not installed
        const mockAddress = `mock${Math.random().toString(36).slice(2, 10)}...${Math.random().toString(36).slice(2, 6)}`;
        const mockBalance = getMockBalance();

        setWallet({
          connected: true,
          address: mockAddress,
          balance: mockBalance,
          pendingBalance: 0,
        });

        console.warn('Phantom not detected, using mock wallet for MVP');
        return true;
      }

      const response = await provider.connect();
      const address = response.publicKey.toString();

      setWallet({
        connected: true,
        address,
        balance: getMockBalance(), // MVP: mock balance
        pendingBalance: 0,
      });

      // Set up disconnect listener
      const handleDisconnect = () => {
        setWallet(INITIAL_WALLET_STATE);
      };
      provider.on('disconnect', handleDisconnect);

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      return false;
    }
  }, [getProvider]);

  const disconnect = useCallback(async () => {
    setError(null);

    try {
      const provider = getProvider();

      if (provider) {
        await provider.disconnect();
      }

      setWallet(INITIAL_WALLET_STATE);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disconnect wallet';
      setError(message);
    }
  }, [getProvider]);

  // Auto-refresh balance periodically when connected
  useEffect(() => {
    if (!wallet.connected) return;

    const interval = setInterval(refreshBalance, 30000); // Every 30s
    return () => clearInterval(interval);
  }, [wallet.connected, refreshBalance]);

  return {
    wallet,
    connect,
    disconnect,
    refreshBalance,
    isPhantomInstalled,
    error,
  };
}

export default useWalletConnection;
