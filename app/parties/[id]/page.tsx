'use client'

import { useParams } from 'next/navigation'
import { useParty } from '@/hooks/useParties'
import { PartyDetail } from '@/components/party/PartyDetail'
import { PageLoader } from '@/components/shared/LoadingSpinner'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { MOCK_PARTIES } from '@/lib/mock-data'
import Link from 'next/link'

export default function PartyDetailPage() {
  const params = useParams()
  const id = params.id as string

  const { data: party, isLoading, error, refetch } = useParty(id)

  // Fallback to mock in dev
  const displayParty = party || MOCK_PARTIES.find((p) => p.id === id) || MOCK_PARTIES[0]

  if (isLoading && !displayParty) {
    return <PageLoader />
  }

  if (error && !displayParty) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <ErrorAlert error={error} onRetry={refetch} />
      </div>
    )
  }

  if (!displayParty) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <span className="text-5xl">🎯</span>
        <h2 className="text-xl font-bold text-gg-text mt-4">Party not found</h2>
        <Link href="/parties" className="text-gg-primary mt-3 inline-block hover:underline">
          ← Back to Parties
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/parties" className="text-gg-muted text-sm hover:text-gg-primary mb-6 inline-block">
        ← Back to Parties
      </Link>
      <PartyDetail party={displayParty} />
    </div>
  )
}
