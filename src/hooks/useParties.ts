import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { partiesApi } from '@/lib/api'
import type { PartyCreateInput } from '@/types'

export function useParties(params?: {
  page?: number
  limit?: number
  status?: string
  search?: string
}) {
  return useQuery({
    queryKey: ['parties', params],
    queryFn: () => partiesApi.list(params),
    staleTime: 15_000,
    refetchInterval: 30_000, // Poll every 30s for live updates
  })
}

export function useParty(id: string) {
  return useQuery({
    queryKey: ['party', id],
    queryFn: () => partiesApi.get(id),
    enabled: !!id,
    staleTime: 10_000,
    refetchInterval: 15_000, // Poll frequently for party state
  })
}

export function useCreateParty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: PartyCreateInput) => partiesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['parties'] })
    },
  })
}

export function useJoinParty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      partyId,
      data,
    }: {
      partyId: string
      data: { wallet_address: string; signed_transaction: string }
    }) => partiesApi.join(partyId, data),
    onSuccess: (_, { partyId }) => {
      qc.invalidateQueries({ queryKey: ['party', partyId] })
      qc.invalidateQueries({ queryKey: ['parties'] })
    },
  })
}
