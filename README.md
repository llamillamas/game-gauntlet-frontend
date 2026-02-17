# Game Gauntlet Frontend — Phase 1 MVP

> Solana-based competitive gaming platform. Compete. Bet. Win.

## Stack

| Tool | Purpose |
|------|---------|
| Next.js 15 (App Router) | React framework, SSR |
| Tailwind CSS | Styling (dark theme) |
| TanStack Query | API data fetching + caching |
| @solana/wallet-adapter | Phantom wallet integration |
| @solana/web3.js | Solana SDK |
| react-hot-toast | Toast notifications |
| Cypress | E2E testing |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- [Phantom Wallet](https://phantom.app/) browser extension
- Backend API running on `http://localhost:3001` (or update `.env.local`)

### Install

```bash
cd game-gauntlet-frontend
npm install
```

### Environment Variables

Copy `.env.local` and update values:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Program IDs (deploy contracts first, then fill these)
NEXT_PUBLIC_GAME_REGISTRY_PROGRAM_ID=...
NEXT_PUBLIC_BETTING_POOL_PROGRAM_ID=...
NEXT_PUBLIC_SETTLEMENT_PROGRAM_ID=...

# USDC Mint on devnet
NEXT_PUBLIC_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
```

### Run Dev Server

```bash
npm run dev
# Opens http://localhost:3000
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, featured games, stats |
| `/games` | Game discovery grid — search, filter, sort |
| `/games/[id]` | Game detail — info, stats, join party CTA |
| `/create-game` | Create game form — upload, mint NFT |
| `/parties` | Party discovery — list, filter, create modal |
| `/parties/[id]` | Party detail — join flow, players, pot |
| `/leaderboard` | Top games — earnings, plays, wins |
| `/profile` | User dashboard — stats, NFTs, tx history |

---

## Components

```
components/
├── layout/
│   ├── Header.tsx          # Nav + wallet button
│   └── Footer.tsx          # Links + network indicator
├── shared/
│   ├── LoadingSpinner.tsx   # Spinners
│   ├── ErrorAlert.tsx       # Error display
│   ├── Card.tsx             # Base card container
│   └── WalletStatus.tsx     # Connected/disconnected badge + WalletGate
├── game/
│   ├── GameCard.tsx         # Game card for grid
│   ├── GameForm.tsx         # Create game form (multi-step)
│   └── GameDetail.tsx       # Full game info view
├── party/
│   ├── PartyCard.tsx        # Party card for grid
│   ├── PartyForm.tsx        # Create party form
│   └── PartyDetail.tsx      # Party info + join flow
└── leaderboard/
    ├── LeaderboardTable.tsx  # Rankings table
    └── LeaderboardFilters.tsx # Timeframe + sort filters
```

---

## Key Flows

### Game Creation Flow
1. User fills form (title, desc, GitHub URL, image)
2. Submit → API `POST /games/create` with FormData
3. Backend returns serialized transaction
4. Phantom wallet signs transaction
5. Confirmation polling starts
6. On confirmed → redirect to `/games/[id]`

### Party Join Flow
1. User views party at `/parties/[id]`
2. Clicks "Join Party"
3. Backend builds USDC deposit transaction
4. Phantom signs → submits
5. USDC locked in on-chain pool
6. Player status updates to "ready"
7. Game starts when all players ready

### Settlement Flow
1. Game ends → winner determined
2. `POST /parties/:id/settle-winner` with state hash + signature
3. Smart contract verifies + distributes pot
4. Winner gets ~95% of pot (5% platform fee)
5. Creator gets 2.5% (earned separately from creator vault)

---

## API Endpoints Called

```
GET  /api/games                      — List games (paginated)
GET  /api/games/featured             — Featured games
GET  /api/games/:id                  — Game detail
POST /api/games/create               — Create game (FormData)

GET  /api/parties                    — List parties
GET  /api/parties/:id                — Party detail
POST /api/parties/create             — Create party
POST /api/parties/:id/join           — Join party (signed tx)
POST /api/parties/:id/settle-winner  — Submit winner

GET  /api/leaderboard                — Leaderboard entries

GET  /api/users/:address             — User profile
GET  /api/users/:address/transactions — Transaction history
```

---

## Testing

### Run E2E Tests

```bash
# Start dev server first
npm run dev

# Open Cypress UI
npm run cypress:open

# Run headlessly
npm run cypress:run
```

### Test Coverage

- `navigation.cy.ts` — Header/footer links, wallet button
- `landing.cy.ts` — Hero, stats, CTAs
- `games.cy.ts` — Game list, search, detail, create form
- `parties.cy.ts` — Party list, filter, detail, join flow
- `leaderboard.cy.ts` — Leaderboard table, filters

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# → Settings → Environment Variables
# Add all NEXT_PUBLIC_* vars
```

Or push to GitHub and connect repo to Vercel for auto-deploys.

### Build for Production

```bash
npm run build
npm run start
```

---

## Mock Data

During development, the app falls back to mock data in `lib/mock-data.ts` when the API is unavailable. This includes:
- 4 sample games
- 2 sample parties
- Leaderboard entries
- User profile + transaction history

Remove or conditionally disable this fallback before production.

---

## Development Notes

- **Wallet**: Uses `@solana/wallet-adapter-phantom` — Phantom must be installed in browser
- **Network**: Configured for devnet by default — change `NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta` for prod
- **API fallback**: All hooks fall back to mock data if API is unreachable
- **Polling**: Party pages auto-refresh every 15s for live status updates

---

## Phase 2 (Next)
- Real-time updates via Socket.io
- Game iframe embedding
- Dispute UI
- Game analytics per creator
- IPFS upload for game assets

## Phase 3
- Full casino UI polish (animations, Framer Motion)
- Storybook component library
- PWA support
- Mobile optimization
