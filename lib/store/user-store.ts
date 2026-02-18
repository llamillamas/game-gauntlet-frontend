import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile, Transaction } from '@/types'

export interface WalletState {
  address: string | null
  balance: number
  usdcBalance: number
  isConnecting: boolean
  isConnected: boolean
}

export interface UserState {
  // Wallet
  wallet: WalletState
  setWalletAddress: (address: string | null) => void
  setBalance: (sol: number, usdc: number) => void
  setConnecting: (connecting: boolean) => void
  setConnected: (connected: boolean) => void
  
  // Profile
  profile: UserProfile | null
  setProfile: (profile: UserProfile | null) => void
  isLoadingProfile: boolean
  setLoadingProfile: (loading: boolean) => void
  
  // Transactions
  transactions: Transaction[]
  setTransactions: (txs: Transaction[]) => void
  addTransaction: (tx: Transaction) => void
  
  // Balance animation
  previousBalance: number
  animatingBalance: boolean
  setAnimatingBalance: (animating: boolean) => void
  triggerBalanceAnimation: (newBalance: number) => void
  
  // Session
  lastSeen: Date | null
  updateLastSeen: () => void
  
  // Reset
  reset: () => void
}

const initialWallet: WalletState = {
  address: null,
  balance: 0,
  usdcBalance: 0,
  isConnecting: false,
  isConnected: false,
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Wallet
      wallet: initialWallet,
      setWalletAddress: (address) => set((state) => ({
        wallet: { ...state.wallet, address },
      })),
      setBalance: (sol, usdc) => set((state) => ({
        wallet: { ...state.wallet, balance: sol, usdcBalance: usdc },
      })),
      setConnecting: (isConnecting) => set((state) => ({
        wallet: { ...state.wallet, isConnecting },
      })),
      setConnected: (isConnected) => set((state) => ({
        wallet: { ...state.wallet, isConnected },
      })),
      
      // Profile
      profile: null,
      setProfile: (profile) => set({ profile }),
      isLoadingProfile: false,
      setLoadingProfile: (isLoadingProfile) => set({ isLoadingProfile }),
      
      // Transactions
      transactions: [],
      setTransactions: (transactions) => set({ transactions }),
      addTransaction: (tx) => set((state) => ({
        transactions: [tx, ...state.transactions],
      })),
      
      // Balance animation
      previousBalance: 0,
      animatingBalance: false,
      setAnimatingBalance: (animatingBalance) => set({ animatingBalance }),
      triggerBalanceAnimation: (newBalance) => {
        const current = get().wallet.usdcBalance
        if (current !== newBalance) {
          set({ 
            previousBalance: current,
            animatingBalance: true,
          })
          // Auto-reset after animation
          setTimeout(() => {
            set({ animatingBalance: false })
          }, 1000)
        }
      },
      
      // Session
      lastSeen: null,
      updateLastSeen: () => set({ lastSeen: new Date() }),
      
      // Reset
      reset: () => set({
        wallet: initialWallet,
        profile: null,
        transactions: [],
        previousBalance: 0,
        animatingBalance: false,
      }),
    }),
    {
      name: 'game-gauntlet-user',
      partialize: (state) => ({
        wallet: {
          address: state.wallet.address,
        },
        lastSeen: state.lastSeen,
      }),
    }
  )
)
