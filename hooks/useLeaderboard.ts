import { useQuery } from '@tanstack/react-query'
import { leaderboardApi } from '@/lib/api'
import type { LeaderboardTimeframe, LeaderboardSortBy } from '@/types'

export function useLeaderboard(params?: {
  timeframe?: LeaderboardTimeframe
  sort?: LeaderboardSortBy
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: ['leaderboard', params],
    queryFn: () => leaderboardApi.get(params),
    staleTime: 60_000,
  })
}
