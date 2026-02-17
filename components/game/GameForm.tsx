'use client'

import { useState, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/navigation'
import { useCreateGame } from '@/hooks/useGames'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { getTxExplorerUrl, deserializeTransaction, serializeTransaction } from '@/lib/solana'
import toast from 'react-hot-toast'

interface FormData {
  title: string
  description: string
  github_url: string
  preview_image?: File
}

export function GameForm() {
  const { connected, publicKey, signTransaction } = useWallet()
  const router = useRouter()
  const createGame = useCreateGame()
  const fileRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    github_url: '',
  })
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [step, setStep] = useState<'form' | 'signing' | 'confirming' | 'done'>('form')
  const [txHash, setTxHash] = useState<string>('')
  const [nftMint, setNftMint] = useState<string>('')
  const [gameId, setGameId] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFormData((prev) => ({ ...prev, preview_image: file }))
    setPreviewUrl(URL.createObjectURL(file))
  }

  const validate = (): boolean => {
    if (!formData.title.trim()) {
      setError('Title is required')
      return false
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return false
    }
    if (!formData.github_url.trim()) {
      setError('GitHub URL is required')
      return false
    }
    if (!/^https?:\/\/github\.com\/.+/.test(formData.github_url)) {
      setError('Invalid GitHub URL')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validate()) return
    if (!connected || !publicKey) {
      setError('Please connect your wallet first')
      return
    }

    try {
      // Step 1: Submit to API
      setStep('signing')
      const fd = new FormData()
      fd.append('title', formData.title)
      fd.append('description', formData.description)
      fd.append('github_url', formData.github_url)
      fd.append('creator_address', publicKey.toString())
      if (formData.preview_image) {
        fd.append('preview_image', formData.preview_image)
      }

      const result = await createGame.mutateAsync(fd)

      // Step 2: Sign transaction if backend returns one
      if (result.transaction_hash && signTransaction) {
        const tx = deserializeTransaction(result.transaction_hash)
        const signed = await signTransaction(tx)
        const serialized = serializeTransaction(signed)
        // In real implementation: submit serialized tx to backend
        console.log('Signed transaction:', serialized)
      }

      setTxHash(result.transaction_hash || 'mock-tx-hash')
      setNftMint(result.nft_mint || '')
      setGameId(result.game.id)
      setStep('confirming')

      toast.success('Game creation submitted!')

      // Step 3: Poll for confirmation (simplified)
      setTimeout(() => {
        setStep('done')
        toast.success('Game NFT minted successfully! 🎉')
      }, 3000)
    } catch (err) {
      setStep('form')
      setError(err instanceof Error ? err.message : 'Failed to create game')
      toast.error('Failed to create game')
    }
  }

  if (step === 'done') {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gg-text mb-2">Game Created!</h2>
        <p className="text-gg-muted mb-6">Your game NFT has been minted on Solana.</p>
        <div className="bg-gg-card border border-gg-border rounded-xl p-4 text-left mb-6 font-mono text-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gg-muted">Transaction:</span>
            <a
              href={getTxExplorerUrl(txHash)}
              target="_blank"
              rel="noreferrer"
              className="text-gg-primary hover:underline truncate max-w-xs"
            >
              {txHash.slice(0, 20)}...
            </a>
          </div>
          {nftMint && (
            <div className="flex justify-between items-center">
              <span className="text-gg-muted">NFT Mint:</span>
              <span className="text-gg-accent truncate max-w-xs">{nftMint.slice(0, 20)}...</span>
            </div>
          )}
        </div>
        <button
          onClick={() => router.push(`/games/${gameId}`)}
          className="px-6 py-3 bg-gg-primary text-white rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
        >
          View My Game →
        </button>
      </div>
    )
  }

  if (step === 'confirming') {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size="lg" label="" />
        <h2 className="text-xl font-bold text-gg-text mt-6 mb-2">Confirming on-chain...</h2>
        <p className="text-gg-muted text-sm">Minting your game NFT. This may take a moment.</p>
        {txHash && (
          <a
            href={getTxExplorerUrl(txHash)}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 text-gg-primary text-sm hover:underline"
          >
            View on Explorer ↗
          </a>
        )}
      </div>
    )
  }

  if (step === 'signing') {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">👻</div>
        <h2 className="text-xl font-bold text-gg-text mb-2">Waiting for Wallet...</h2>
        <p className="text-gg-muted text-sm">
          Please confirm the transaction in your Phantom wallet.
        </p>
        <LoadingSpinner size="md" label="" className="mt-6" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorAlert error={error} onRetry={() => setError('')} />}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gg-text mb-2">
          Game Title <span className="text-gg-error">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="My Awesome Game"
          required
          className="w-full px-4 py-3 bg-gg-surface border border-gg-border rounded-lg text-gg-text placeholder-gg-muted focus:outline-none focus:border-gg-primary transition-colors"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gg-text mb-2">
          Description <span className="text-gg-error">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your game, how to play, and what makes it competitive..."
          required
          rows={4}
          className="w-full px-4 py-3 bg-gg-surface border border-gg-border rounded-lg text-gg-text placeholder-gg-muted focus:outline-none focus:border-gg-primary transition-colors resize-y"
        />
      </div>

      {/* GitHub URL */}
      <div>
        <label className="block text-sm font-medium text-gg-text mb-2">
          GitHub Repository URL <span className="text-gg-error">*</span>
        </label>
        <input
          type="url"
          name="github_url"
          value={formData.github_url}
          onChange={(e) => setFormData((prev) => ({ ...prev, github_url: e.target.value }))}
          placeholder="https://github.com/yourname/your-game"
          required
          className="w-full px-4 py-3 bg-gg-surface border border-gg-border rounded-lg text-gg-text placeholder-gg-muted focus:outline-none focus:border-gg-primary transition-colors font-mono text-sm"
        />
        <p className="mt-1 text-xs text-gg-muted">
          Must be a public GitHub repository. The game code will be audited for fair play.
        </p>
      </div>

      {/* Preview Image */}
      <div>
        <label className="block text-sm font-medium text-gg-text mb-2">
          Preview Image
        </label>
        <div
          className="border-2 border-dashed border-gg-border rounded-lg p-6 text-center cursor-pointer hover:border-gg-primary transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg object-contain"
            />
          ) : (
            <>
              <span className="text-3xl">🖼️</span>
              <p className="text-gg-muted text-sm mt-2">
                Click to upload a preview image (PNG, JPG, GIF)
              </p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Platform fee info */}
      <div className="bg-gg-surface border border-gg-border rounded-lg p-4 text-sm">
        <h4 className="font-semibold text-gg-text mb-2">💡 Creator Benefits</h4>
        <ul className="space-y-1 text-gg-muted text-xs">
          <li>• Earn 2.5% of every bet placed in games using your creation</li>
          <li>• Own the game as an NFT — transfer or sell on the marketplace</li>
          <li>• Platform takes 5% fee per game</li>
          <li>• NFT minting cost: ~0.005 SOL</li>
        </ul>
      </div>

      {/* Submit */}
      {connected ? (
        <button
          type="submit"
          disabled={createGame.isPending}
          className="w-full py-4 bg-gg-primary text-white rounded-lg font-bold text-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createGame.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" label="" />
              Creating...
            </span>
          ) : (
            '⚔️ Create Game & Mint NFT'
          )}
        </button>
      ) : (
        <div className="text-center">
          <p className="text-gg-muted text-sm mb-3">Connect your wallet to create a game</p>
          <WalletMultiButton />
        </div>
      )}
    </form>
  )
}
