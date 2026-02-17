import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gamesApi } from '@/lib/api'
import type { GameCreateInput } from '@/types'

export function useGames(params?: {
  page?: number
  limit?: number
  sort?: string
  filter?: string
}) {
  return useQuery({
    queryKey: ['games', params],
    queryFn: () => gamesApi.list(params),
    staleTime: 30_000,
  })
}

export function useGame(id: string) {
  return useQuery({
    queryKey: ['game', id],
    queryFn: () => gamesApi.get(id),
    enabled: !!id,
    staleTime: 60_000,
  })
}

export function useFeaturedGames() {
  return useQuery({
    queryKey: ['games', 'featured'],
    queryFn: () => gamesApi.getFeatured(),
    staleTime: 60_000,
  })
}

export function useCreateGame() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => gamesApi.create(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['games'] })
    },
  })
}
