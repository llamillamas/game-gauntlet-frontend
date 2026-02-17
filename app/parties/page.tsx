'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParties } from '@/hooks/useParties'
import { PartyCard } from '@/components/party/PartyCard'
import { PartyForm } from '@/components/party/PartyForm'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { MOCK_PARTIES } from '@/lib/mock-data'
import type { PartyStatus } from '@/types'

const STATUS_FILTERS: { value: '' | PartyStatus; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Open' },
  { value: 'active', label: 'Active' },
  { value: 'settled', label: 'Settled' },
]

export default function PartiesPage() {
  const [statusFilter, setStatusFilter] = useState<'' | PartyStatus>('')
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { data, isLoading, error, refetch } = useParties({
    status: statusFilter || undefined,
    search,
  })

  const parties = data?.items || MOCK_PARTIES
  const filteredParties = parties.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gg-text">🎯 Parties</h1>
          <p className="text-gg-muted text-sm mt-1">
            Join an active party or create your own
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gg-primary text-white rounded-lg text-sm font-semibold hover:bg-opacity-80 transition-colors self-start sm:self-auto"
        >
          + Create Party
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Search parties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-gg-surface border border-gg-border rounded-lg text-gg-text placeholder-gg-muted focus:outline-none focus:border-gg-primary text-sm"
        />
        <div className="flex gap-1 bg-gg-surface rounded-lg p-1 border border-gg-border">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                statusFilter === f.value
                  ? 'bg-gg-primary text-white'
                  : 'text-gg-muted hover:text-gg-text'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && !data && (
        <ErrorAlert error={error} title="Failed to load parties" onRetry={refetch} className="mb-6" />
      )}

      {isLoading && !data && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" label="Loading parties..." />
        </div>
      )}

      {filteredParties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParties.map((party) => (
            <PartyCard key={party.id} party={party} />
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="text-center py-16">
            <span className="text-5xl">🎯</span>
            <p className="text-gg-muted mt-4">No parties found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-6 py-2 bg-gg-primary text-white rounded-lg text-sm font-semibold hover:bg-opacity-80 transition-colors"
            >
              Create the first one!
            </button>
          </div>
        )
      )}

      {/* Create Party Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gg-surface border border-gg-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gg-border">
              <h2 className="text-xl font-bold text-gg-text">Create Party</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gg-muted hover:text-gg-text text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <PartyForm />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
