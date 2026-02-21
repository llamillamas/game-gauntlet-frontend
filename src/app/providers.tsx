'use client'

import { useMemo, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { clusterApiUrl } from '@solana/web3.js'
import { Toaster } from 'react-hot-toast'

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css'

// Solana network configuration
const SOLANA_NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as
  | 'devnet'
  | 'testnet'
  | 'mainnet-beta'

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK)

// Create a stable QueryClient instance
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new QueryClient
    return makeQueryClient()
  } else {
    // Browser: reuse existing QueryClient
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  // Initialize wallet adapters
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider endpoint={RPC_URL}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--gg-surface)',
                  color: 'var(--gg-text)',
                  border: '1px solid var(--gg-border)',
                  borderRadius: '8px',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--gg-success)',
                    secondary: 'var(--gg-surface)',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'var(--gg-error)',
                    secondary: 'var(--gg-surface)',
                  },
                },
              }}
            />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
