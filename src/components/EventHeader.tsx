'use client';

import type { EventStatus } from '@/types/betting';

interface EventHeaderProps {
  name: string;
  date: Date;
  status: EventStatus;
  category?: string;
  description?: string;
}

export function EventHeader({ name, date, status, category, description }: EventHeaderProps) {
  const statusConfig: Record<EventStatus, { label: string; classes: string }> = {
    upcoming: {
      label: 'Upcoming',
      classes: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    },
    live: {
      label: '● LIVE',
      classes: 'bg-green-500/20 text-green-400 border-green-500/40 animate-pulse',
    },
    completed: {
      label: 'Completed',
      classes: 'bg-gray-500/20 text-gray-400 border-gray-500/40',
    },
    cancelled: {
      label: 'Cancelled',
      classes: 'bg-red-500/20 text-red-400 border-red-500/40',
    },
  };

  const { label, classes } = statusConfig[status];

  const formatDate = (d: Date): string => {
    return new Date(d).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rounded-xl border border-gray-700 bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-6 backdrop-blur-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          {category && (
            <span className="mb-2 inline-block rounded-md bg-purple-500/20 px-2 py-1 text-xs font-medium text-purple-300">
              {category}
            </span>
          )}
          <h1 className="text-2xl font-bold text-white md:text-3xl">{name}</h1>
          {description && <p className="mt-2 text-gray-400">{description}</p>}
        </div>

        <div className="flex flex-col items-start gap-2 md:items-end">
          <span className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${classes}`}>
            {label}
          </span>
          <time className="text-sm text-gray-400">{formatDate(date)}</time>
        </div>
      </div>

      {status === 'live' && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2 text-green-400">
          <span className="h-2 w-2 animate-ping rounded-full bg-green-400" />
          <span className="text-sm font-medium">Betting is open — odds updating in real-time</span>
        </div>
      )}
    </div>
  );
}

export default EventHeader;
