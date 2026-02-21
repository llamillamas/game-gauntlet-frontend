import type {
  Game,
  GameCreateInput,
  GameCreateResponse,
  Party,
  PartyCreateInput,
  PartyCreateResponse,
  LeaderboardEntry,
  LeaderboardTimeframe,
  LeaderboardSortBy,
  UserProfile,
  Transaction,
  PaginatedResponse,
} from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(error.error || error.message || 'API request failed')
  }

  return res.json()
}

// ─── Games ───────────────────────────────────────────────────────────────────

export const gamesApi = {
  list: (params?: {
    page?: number
    limit?: number
    sort?: string
    filter?: string
  }): Promise<PaginatedResponse<Game>> => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return request(`/games${qs ? `?${qs}` : ''}`)
  },

  get: (id: string): Promise<Game> => request(`/games/${id}`),

  create: (data: FormData): Promise<GameCreateResponse> =>
    fetch(`${API_URL}/games/create`, {
      method: 'POST',
      body: data, // FormData — no Content-Type header (browser sets boundary)
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(error.error || 'Failed to create game')
      }
      return res.json()
    }),

  getFeatured: (): Promise<Game[]> => request('/games/featured'),
}

// ─── Parties ─────────────────────────────────────────────────────────────────

export const partiesApi = {
  list: (params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }): Promise<PaginatedResponse<Party>> => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return request(`/parties${qs ? `?${qs}` : ''}`)
  },

  get: (id: string): Promise<Party> => request(`/parties/${id}`),

  create: (data: PartyCreateInput): Promise<PartyCreateResponse> =>
    request('/parties/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  join: (
    id: string,
    data: { wallet_address: string; signed_transaction: string },
  ): Promise<{ success: boolean; tx_hash: string }> =>
    request(`/parties/${id}/join`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  settleWinner: (
    id: string,
    data: { winner: string; game_state_hash: string; signature: string },
  ): Promise<{ success: boolean; tx_hash: string }> =>
    request(`/parties/${id}/settle-winner`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export const leaderboardApi = {
  get: (params?: {
    timeframe?: LeaderboardTimeframe
    sort?: LeaderboardSortBy
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<LeaderboardEntry>> => {
    const qs = new URLSearchParams(params as Record<string, string>).toString()
    return request(`/leaderboard${qs ? `?${qs}` : ''}`)
  },
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export const profileApi = {
  get: (walletAddress: string): Promise<UserProfile> =>
    request(`/users/${walletAddress}`),

  getTransactions: (walletAddress: string): Promise<Transaction[]> =>
    request(`/users/${walletAddress}/transactions`),
}
