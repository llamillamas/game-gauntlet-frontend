import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from '@solana/web3.js'

// ─── Connection ───────────────────────────────────────────────────────────────

const SOLANA_NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as
  | 'devnet'
  | 'testnet'
  | 'mainnet-beta'

const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK)

export const connection = new Connection(RPC_URL, 'confirmed')

// ─── Program IDs ─────────────────────────────────────────────────────────────

export const PROGRAM_IDS = {
  GAME_REGISTRY: process.env.NEXT_PUBLIC_GAME_REGISTRY_PROGRAM_ID || '',
  BETTING_POOL: process.env.NEXT_PUBLIC_BETTING_POOL_PROGRAM_ID || '',
  SETTLEMENT: process.env.NEXT_PUBLIC_SETTLEMENT_PROGRAM_ID || '',
}

export const USDC_MINT = process.env.NEXT_PUBLIC_USDC_MINT || ''

// ─── Utilities ────────────────────────────────────────────────────────────────

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL
}

export function solToLamports(sol: number): number {
  return Math.round(sol * LAMPORTS_PER_SOL)
}

export function usdcToRaw(usdc: number): number {
  return Math.round(usdc * 1_000_000) // 6 decimals
}

export function rawToUsdc(raw: number): number {
  return raw / 1_000_000
}

// ─── Transaction Helpers ─────────────────────────────────────────────────────

/**
 * Poll for transaction confirmation (max 60 attempts, 2s apart)
 */
export async function waitForConfirmation(
  txHash: string,
  maxAttempts = 30,
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const status = await connection.getSignatureStatus(txHash)
      if (
        status.value?.confirmationStatus === 'confirmed' ||
        status.value?.confirmationStatus === 'finalized'
      ) {
        return true
      }
      if (status.value?.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(status.value.err)}`)
      }
    } catch (err) {
      if (i === maxAttempts - 1) throw err
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
  return false
}

/**
 * Get SOL balance for a wallet
 */
export async function getSolBalance(publicKey: PublicKey): Promise<number> {
  const balance = await connection.getBalance(publicKey)
  return lamportsToSol(balance)
}

/**
 * Build a serialized transaction from base64 (returned from API)
 */
export function deserializeTransaction(base64Tx: string): Transaction {
  const buffer = Buffer.from(base64Tx, 'base64')
  return Transaction.from(buffer)
}

/**
 * Serialize a signed transaction to base64
 */
export function serializeTransaction(tx: Transaction): string {
  return tx.serialize().toString('base64')
}

// ─── Explorer Links ───────────────────────────────────────────────────────────

export function getTxExplorerUrl(txHash: string): string {
  const cluster = SOLANA_NETWORK === 'mainnet-beta' ? '' : `?cluster=${SOLANA_NETWORK}`
  return `https://explorer.solana.com/tx/${txHash}${cluster}`
}

export function getAddressExplorerUrl(address: string): string {
  const cluster = SOLANA_NETWORK === 'mainnet-beta' ? '' : `?cluster=${SOLANA_NETWORK}`
  return `https://explorer.solana.com/address/${address}${cluster}`
}
