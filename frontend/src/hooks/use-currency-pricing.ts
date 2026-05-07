"use client";

import { formatCurrency } from "@/lib/utils";
import { useCurrencyStore } from "@/store/use-currency-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

type ExchangeRatesPayload = {
  base: string;
  lastUpdatedAt: string;
  rates: Record<string, number>;
};

async function fetchExchangeRates(): Promise<ExchangeRatesPayload> {
  const response = await fetch("/api/exchange-rates", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to fetch latest exchange rates");
  }
  return response.json() as Promise<ExchangeRatesPayload>;
}

export function useCurrencyPricing() {
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);
  const rates = useCurrencyStore((state) => state.rates);
  const setRates = useCurrencyStore((state) => state.setRates);
  const query = useQuery({
    queryKey: ["exchange-rates"],
    queryFn: fetchExchangeRates,
    staleTime: 15 * 60 * 1000,
    refetchInterval: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data?.rates) {
      setRates(query.data.rates);
    }
  }, [query.data, setRates]);

  const activeRate = rates[selectedCurrency] ?? 1;

  const formatPrice = useMemo(
    () => (usdValue: number) => formatCurrency(usdValue * activeRate, selectedCurrency),
    [activeRate, selectedCurrency]
  );

  return {
    selectedCurrency,
    activeRate,
    rates,
    isRatesLoading: query.isLoading,
    formatPrice,
  };
}
