'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface BetSelection {
  id: string;
  event: string;
  selection: string;
  odds: number;
  stake: number;
}

export interface CurrentOdds {
  home: number;
  draw: number;
  away: number;
}

export interface BettingContextType {
  selectedBet: BetSelection | null;
  selections: BetSelection[];
  currentOdds: CurrentOdds | null;
  userBalance: number;
  placeBetLoading: boolean;
  selectOption: (option: Omit<BetSelection, 'id'>) => void;
  updateStake: (id: string, amount: number) => void;
  removeSelection: (id: string) => void;
  clearSlip: () => void;
  setCurrentOdds: (odds: CurrentOdds) => void;
  setUserBalance: (balance: number) => void;
  setPlaceBetLoading: (loading: boolean) => void;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

interface BettingProviderProps {
  children: ReactNode;
  initialBalance?: number;
}

export function BettingProvider({ children, initialBalance = 1000 }: BettingProviderProps) {
  const [selectedBet, setSelectedBet] = useState<BetSelection | null>(null);
  const [selections, setSelections] = useState<BetSelection[]>([]);
  const [currentOdds, setCurrentOdds] = useState<CurrentOdds | null>(null);
  const [userBalance, setUserBalance] = useState(initialBalance);
  const [placeBetLoading, setPlaceBetLoading] = useState(false);

  const selectOption = useCallback(
    (option: Omit<BetSelection, 'id'>) => {
      const id = `${option.event}-${option.selection}-${Date.now()}`;
      const newSelection: BetSelection = { ...option, id };
      setSelectedBet(newSelection);
      setSelections((prev) => [...prev, newSelection]);
    },
    []
  );

  const updateStake = useCallback((id: string, amount: number) => {
    setSelections((prev) =>
      prev.map((sel) => (sel.id === id ? { ...sel, stake: Math.max(0, amount) } : sel))
    );
  }, []);

  const removeSelection = useCallback((id: string) => {
    setSelections((prev) => prev.filter((sel) => sel.id !== id));
    if (selectedBet?.id === id) {
      setSelectedBet(null);
    }
  }, [selectedBet]);

  const clearSlip = useCallback(() => {
    setSelections([]);
    setSelectedBet(null);
  }, []);

  const value: BettingContextType = {
    selectedBet,
    selections,
    currentOdds,
    userBalance,
    placeBetLoading,
    selectOption,
    updateStake,
    removeSelection,
    clearSlip,
    setCurrentOdds,
    setUserBalance,
    setPlaceBetLoading,
  };

  return <BettingContext.Provider value={value}>{children}</BettingContext.Provider>;
}

export function useBettingContext() {
  const context = useContext(BettingContext);
  if (!context) {
    throw new Error('useBettingContext must be used within BettingProvider');
  }
  return context;
}
