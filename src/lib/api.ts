// API utilities for backend connection

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json() as T;
    return { data, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { data: null as T, success: false, error: message };
  }
}

export const api = {
  events: {
    list: () => fetchApi<import('../types/betting').BettingEvent[]>('/events'),
    get: (id: string) => fetchApi<import('../types/betting').BettingEvent>(`/events/${id}`),
  },
  bets: {
    list: () => fetchApi<import('../types/betting').Bet[]>('/bets'),
    place: (data: { eventId: string; outcomeId: string; amount: number }) =>
      fetchApi<import('../types/betting').Bet>('/bets', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    settle: (betId: string) =>
      fetchApi<import('../types/betting').SettlementResult>(`/bets/${betId}/settle`, {
        method: 'POST',
      }),
  },
  wallet: {
    balance: (address: string) => fetchApi<{ balance: number }>(`/wallet/${address}/balance`),
  },
};
