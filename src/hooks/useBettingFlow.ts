import { useState, useCallback, useReducer } from 'react';
import type { BettingEvent, Outcome, BettingFlowState, Bet } from '@/types/betting';
import { api } from '@/lib/api';

type BettingFlowAction =
  | { type: 'SELECT_EVENT'; event: BettingEvent }
  | { type: 'SELECT_OUTCOME'; outcome: Outcome }
  | { type: 'SET_AMOUNT'; amount: number }
  | { type: 'START_CONFIRM' }
  | { type: 'START_PROCESSING' }
  | { type: 'SETTLE' }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' };

const initialState: BettingFlowState = {
  step: 'idle',
  selectedEvent: null,
  selectedOutcome: null,
  betAmount: 0,
  error: null,
};

function bettingFlowReducer(state: BettingFlowState, action: BettingFlowAction): BettingFlowState {
  switch (action.type) {
    case 'SELECT_EVENT':
      return {
        ...state,
        step: 'selecting',
        selectedEvent: action.event,
        selectedOutcome: null,
        error: null,
      };
    case 'SELECT_OUTCOME':
      return {
        ...state,
        selectedOutcome: action.outcome,
        error: null,
      };
    case 'SET_AMOUNT':
      return {
        ...state,
        betAmount: action.amount,
        error: null,
      };
    case 'START_CONFIRM':
      return {
        ...state,
        step: 'confirming',
        error: null,
      };
    case 'START_PROCESSING':
      return {
        ...state,
        step: 'processing',
        error: null,
      };
    case 'SETTLE':
      return {
        ...state,
        step: 'settled',
        error: null,
      };
    case 'ERROR':
      return {
        ...state,
        step: 'error',
        error: action.error,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface UseBettingFlowReturn {
  state: BettingFlowState;
  selectEvent: (event: BettingEvent) => void;
  selectOutcome: (outcome: Outcome) => void;
  setAmount: (amount: number) => void;
  confirmBet: () => void;
  placeBet: () => Promise<Bet | null>;
  reset: () => void;
  canPlaceBet: boolean;
  potentialReturn: number;
}

export function useBettingFlow(): UseBettingFlowReturn {
  const [state, dispatch] = useReducer(bettingFlowReducer, initialState);

  const selectEvent = useCallback((event: BettingEvent) => {
    dispatch({ type: 'SELECT_EVENT', event });
  }, []);

  const selectOutcome = useCallback((outcome: Outcome) => {
    dispatch({ type: 'SELECT_OUTCOME', outcome });
  }, []);

  const setAmount = useCallback((amount: number) => {
    dispatch({ type: 'SET_AMOUNT', amount });
  }, []);

  const confirmBet = useCallback(() => {
    if (!state.selectedEvent || !state.selectedOutcome || state.betAmount <= 0) {
      dispatch({ type: 'ERROR', error: 'Invalid bet configuration' });
      return;
    }
    dispatch({ type: 'START_CONFIRM' });
  }, [state.selectedEvent, state.selectedOutcome, state.betAmount]);

  const placeBet = useCallback(async (): Promise<Bet | null> => {
    if (!state.selectedEvent || !state.selectedOutcome || state.betAmount <= 0) {
      dispatch({ type: 'ERROR', error: 'Invalid bet configuration' });
      return null;
    }

    dispatch({ type: 'START_PROCESSING' });

    try {
      const response = await api.bets.place({
        eventId: state.selectedEvent.id,
        outcomeId: state.selectedOutcome.id,
        amount: state.betAmount,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to place bet');
      }

      dispatch({ type: 'SETTLE' });
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      dispatch({ type: 'ERROR', error: message });
      return null;
    }
  }, [state.selectedEvent, state.selectedOutcome, state.betAmount]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const canPlaceBet =
    state.step !== 'processing' &&
    state.step !== 'settled' &&
    state.selectedEvent !== null &&
    state.selectedOutcome !== null &&
    state.betAmount > 0;

  const potentialReturn =
    state.selectedOutcome && state.betAmount > 0
      ? state.betAmount * state.selectedOutcome.odds
      : 0;

  return {
    state,
    selectEvent,
    selectOutcome,
    setAmount,
    confirmBet,
    placeBet,
    reset,
    canPlaceBet,
    potentialReturn,
  };
}

export default useBettingFlow;
