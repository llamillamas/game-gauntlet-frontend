import { useQuery } from '@tanstack/react-query'
import { profileApi } from '@/lib/api'

export function useProfile(walletAddress?: string) {
  return useQuery({
    queryKey: ['profile', walletAddress],
    queryFn: () => profileApi.get(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 60_000,
  })
}

export function useTransactions(walletAddress?: string) {
  return useQuery({
    queryKey: ['transactions', walletAddress],
    queryFn: () => profileApi.getTransactions(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 30_000,
  })
}
