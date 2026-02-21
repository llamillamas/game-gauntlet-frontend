'use client';

import { useMemo, useState } from 'react';
import type { Bet, BetStatus } from '@/types/betting';

interface BetHistoryTableProps {
  bets: Bet[];
  onViewDetails?: (bet: Bet) => void;
  loading?: boolean;
}

type SortField = 'placedAt' | 'amount' | 'potentialReturn';
type SortDirection = 'asc' | 'desc';

export function BetHistoryTable({ bets, onViewDetails, loading = false }: BetHistoryTableProps) {
  const [sortField, setSortField] = useState<SortField>('placedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<BetStatus | 'all'>('all');

  const statusColors: Record<BetStatus, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    active: 'bg-blue-500/20 text-blue-400',
    won: 'bg-green-500/20 text-green-400',
    lost: 'bg-red-500/20 text-red-400',
    settled: 'bg-purple-500/20 text-purple-400',
    cancelled: 'bg-gray-500/20 text-gray-400',
  };

  const filteredAndSortedBets = useMemo(() => {
    let result = [...bets];

    if (filterStatus !== 'all') {
      result = result.filter((bet) => bet.status === filterStatus);
    }

    result.sort((a, b) => {
      let aVal: number;
      let bVal: number;

      switch (sortField) {
        case 'placedAt':
          aVal = new Date(a.placedAt).getTime();
          bVal = new Date(b.placedAt).getTime();
          break;
        case 'amount':
          aVal = a.amount;
          bVal = b.amount;
          break;
        case 'potentialReturn':
          aVal = a.potentialReturn;
          bVal = b.potentialReturn;
          break;
        default:
          return 0;
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [bets, filterStatus, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-8">
        <div className="flex items-center justify-center gap-3 text-gray-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-purple-500" />
          Loading bet history...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-700 p-4 md:flex-row md:items-center md:justify-between">
        <h3 className="text-lg font-semibold text-white">Bet History</h3>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as BetStatus | 'all')}
          className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
          <option value="settled">Settled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Selection</th>
              <th
                className="cursor-pointer px-4 py-3 hover:text-white"
                onClick={() => handleSort('amount')}
              >
                Stake {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3">Odds</th>
              <th
                className="cursor-pointer px-4 py-3 hover:text-white"
                onClick={() => handleSort('potentialReturn')}
              >
                Returns {sortField === 'potentialReturn' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3">Status</th>
              <th
                className="cursor-pointer px-4 py-3 hover:text-white"
                onClick={() => handleSort('placedAt')}
              >
                Date {sortField === 'placedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {filteredAndSortedBets.map((bet) => (
              <tr
                key={bet.id}
                onClick={() => onViewDetails?.(bet)}
                className="cursor-pointer transition-colors hover:bg-gray-700/30"
              >
                <td className="px-4 py-3 font-medium text-white">{bet.eventName}</td>
                <td className="px-4 py-3 text-gray-300">{bet.outcomeName}</td>
                <td className="px-4 py-3 text-white">{formatCurrency(bet.amount)}</td>
                <td className="px-4 py-3 text-gray-300">{bet.odds.toFixed(2)}</td>
                <td className="px-4 py-3 font-medium text-green-400">
                  {formatCurrency(bet.potentialReturn)}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[bet.status]}`}>
                    {bet.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{formatDate(bet.placedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedBets.length === 0 && (
        <div className="p-8 text-center text-gray-400">
          No bets found{filterStatus !== 'all' && ` with status "${filterStatus}"`}
        </div>
      )}

      {/* Summary */}
      {filteredAndSortedBets.length > 0 && (
        <div className="border-t border-gray-700 p-4 text-sm text-gray-400">
          Showing {filteredAndSortedBets.length} of {bets.length} bets
        </div>
      )}
    </div>
  );
}

export default BetHistoryTable;
