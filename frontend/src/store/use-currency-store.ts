"use client";

import { create } from "zustand";

type CurrencyStoreState = {
  selectedCurrency: string;
  rates: Record<string, number>;
  setSelectedCurrency: (currency: string) => void;
  setRates: (rates: Record<string, number>) => void;
};

export const useCurrencyStore = create<CurrencyStoreState>((set) => ({
  selectedCurrency: "USD",
  rates: { USD: 1 },
  setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
  setRates: (rates) => set((state) => ({ rates: { ...state.rates, ...rates, USD: 1 } })),
}));
