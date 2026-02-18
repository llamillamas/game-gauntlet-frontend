'use client';

import { useState, useCallback } from 'react';
import { useBettingContext, BetSelection } from '@/context/BettingContext';

interface BettingFlowState {
  selectedOption: BetSelection | null;
  stake: number;
  error: string | null;
  success: boolean;
}

interface BettingFlowConfig {
  minStake?: number;
  maxStake?: number;
  maxBetsPerRace?: number;
  onPlaceBet?: (selections: BetSelection[]) => Promise<void>;
  onSettlement?: (result: { betId: string; result: 'won' | 'lost' | 'void' }) => void;
}

/**
 * Custom hook managing the betting flow state machine
 * Handles bet selection, stake validation, and submission
 */
export function useBettingFlow(config: BettingFlowConfig = {}) {
  const {
    minStake = 1,
    maxStake = 10000,
    maxBetsPerRace = 5,
    onPlaceBet,
    onSettlement,
  } = config;

  const { selectOption, updateStake, removeSelection, clearSlip, selections, userBalance, setPlaceBetLoading } =
    useBettingContext();

  const [state, setState] = useState<BettingFlowState>({
    selectedOption: null,
    stake: minStake,
    error: null,
    success: false,
  });

  /**
   * Select a betting option and add to slip
   */
  const handleSelectOption = useCallback(
    (option: Omit<BetSelection, 'id'>) => {
      setState((prev) => ({ ...prev, error: null }));

      // Validate max bets per race
      const raceBets = selections.filter((s) => s.event === option.event);
      if (raceBets.length >= maxBetsPerRace) {
        setState((prev) => ({
          ...prev,
          error: `Maximum ${maxBetsPerRace} bets per race allowed`,
        }));
        return;
      }

      selectOption({ ...option, stake: minStake });
      setState((prev) => ({ ...prev, selectedOption: option as BetSelection, stake: minStake }));
    },
    [selections, maxBetsPerRace, minStake, selectOption]
  );

  /**
   * Update stake amount with validation
   */
  const handleUpdateStake = useCallback(
    (id: string, amount: number) => {
      setState((prev) => ({ ...prev, error: null }));

      // Validate stake range
      if (amount < minStake) {
        setState((prev) => ({
          ...prev,
          error: `Minimum stake is $${minStake}`,
        }));
        return;
      }

      if (amount > maxStake) {
        setState((prev) => ({
          ...prev,
          error: `Maximum stake is $${maxStake}`,
        }));
        return;
      }

      // Validate total balance
      const totalStake = selections.reduce((sum, s) => {
        if (s.id === id) return sum + amount;
        return sum + s.stake;
      }, 0);

      if (totalStake > userBalance) {
        setState((prev) => ({
          ...prev,
          error: 'Insufficient balance',
        }));
        return;
      }

      updateStake(id, amount);
      setState((prev) => ({ ...prev, stake: amount }));
    },
    [minStake, maxStake, userBalance, selections, updateStake]
  );

  /**
   * Remove a selection from the slip
   */
  const handleRemoveSelection = useCallback(
    (id: string) => {
      removeSelection(id);
      setState((prev) => ({
        ...prev,
        error: null,
        selectedOption: null,
      }));
    },
    [removeSelection]
  );

  /**
   * Place all bets in the slip
   */
  const handlePlaceBet = useCallback(async () => {
    setState((prev) => ({ ...prev, error: null }));

    // Validate selections exist
    if (selections.length === 0) {
      setState((prev) => ({
        ...prev,
        error: 'No selections in bet slip',
      }));
      return;
    }

    // Validate total stake
    const totalStake = selections.reduce((sum, s) => sum + s.stake, 0);
    if (totalStake > userBalance) {
      setState((prev) => ({
        ...prev,
        error: 'Insufficient balance for this bet',
      }));
      return;
    }

    setPlaceBetLoading(true);
    try {
      if (onPlaceBet) {
        await onPlaceBet(selections);
      }
      clearSlip();
      setState((prev) => ({
        ...prev,
        success: true,
        selectedOption: null,
        stake: minStake,
      }));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setState((prev) => ({ ...prev, success: false }));
      }, 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to place bets';
      setState((prev) => ({
        ...prev,
        error: message,
      }));
    } finally {
      setPlaceBetLoading(false);
    }
  }, [selections, userBalance, onPlaceBet, clearSlip, minStake, setPlaceBetLoading]);

  /**
   * Settle a bet after race completion
   */
  const handleSettleBet = useCallback(
    (betId: string, result: 'won' | 'lost' | 'void') => {
      onSettlement?.({ betId, result });
      removeSelection(betId);
    },
    [onSettlement, removeSelection]
  );

  /**
   * Clear the entire bet slip
   */
  const handleClearSlip = useCallback(() => {
    clearSlip();
    setState({
      selectedOption: null,
      stake: minStake,
      error: null,
      success: false,
    });
  }, [clearSlip, minStake]);

  return {
    // State
    selections,
    selectedOption: state.selectedOption,
    currentStake: state.stake,
    error: state.error,
    success: state.success,
    minStake,
    maxStake,

    // Methods
    selectOption: handleSelectOption,
    updateStake: handleUpdateStake,
    removeSelection: handleRemoveSelection,
    placeBet: handlePlaceBet,
    settleBet: handleSettleBet,
    clearSlip: handleClearSlip,
  };
}
