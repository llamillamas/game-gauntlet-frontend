// ─── Game Types ─────────────────────────────────────────────────────────────

export type GameStatus = 'pending' | 'active' | 'inactive'

export interface Game {
  id: string
  title: string
  description: string
  github_url: string
  preview_image?: string
  creator: string
  creator_address: string
  nft_mint?: string
  play_count: number
  total_earnings: number
  status: GameStatus
  created_at: string
  updated_at: string
}

export interface GameCreateInput {
  title: string
  description: string
  github_url: string
  preview_image?: File
}

export interface GameCreateResponse {
  game: Game
  transaction_hash: string
  nft_mint: string
}

// ─── Party Types ─────────────────────────────────────────────────────────────

export type PartyStatus = 'pending' | 'ready' | 'active' | 'settled' | 'cancelled'

export interface Player {
  wallet_address: string
  display_name?: string
  status: 'pending' | 'ready' | 'playing' | 'winner' | 'loser'
  deposit_tx?: string
  joined_at: string
}

export interface Party {
  id: string
  title: string
  creator: string
  creator_address: string
  games: Game[]
  players: Player[]
  bet_amount: number
  total_pot: number
  max_players: number
  status: PartyStatus
  winner?: string
  settlement_tx?: string
  created_at: string
  updated_at: string
}

export interface PartyCreateInput {
  title: string
  game_ids: string[]
  bet_amount: number
  max_players: number
}

export interface PartyCreateResponse {
  party: Party
  transaction_hash: string
  share_url: string
}

// ─── Leaderboard Types ───────────────────────────────────────────────────────

export type LeaderboardTimeframe = 'all-time' | 'monthly' | 'weekly'
export type LeaderboardSortBy = 'trending' | 'earnings' | 'plays' | 'wins'

export interface LeaderboardEntry {
  rank: number
  game: Game
  total_earnings: number
  play_count: number
  win_count: number
  creator_earnings: number
  trending_score: number
}

// ─── User / Profile Types ────────────────────────────────────────────────────

export interface UserProfile {
  wallet_address: string
  display_name?: string
  avatar?: string
  total_earnings: number
  win_rate: number
  games_played: number
  games_won: number
  nft_inventory: Game[]
  created_at: string
}

export interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'win' | 'loss' | 'fee'
  amount: number
  token: 'USDC' | 'SOL'
  tx_hash: string
  party_id?: string
  game_id?: string
  status: 'pending' | 'confirmed' | 'failed'
  created_at: string
}

// ─── API Response Types ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  has_next: boolean
}
