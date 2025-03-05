import { Currency, CurrencyAmount, Percent, Price } from '@uniswap/sdk-core';
import { createContext, useContext } from 'react';

import { Field, TradeState } from '../constants/enum';
import { SwapInfo } from '../hooks/swap-context/useDerivedSwapInfo';
import { useSwapContextValue } from '../hooks/swap-context/useSwapContextValue';
import { WarningSeverity } from '../utils/prices';

export type ISwapContextValue = {
  derivedSwapInfo: SwapInfo;
  computedSwapInfo: {
    parsedAmounts: {
      [Field.INPUT]: CurrencyAmount<Currency> | undefined;
      [Field.OUTPUT]: CurrencyAmount<Currency> | undefined;
    };
    routeNotFound: boolean;
    routeIsLoading: boolean;
    routeIsSyncing: boolean;
    stablecoinPriceImpact: Percent | undefined;
    priceImpactSeverity: WarningSeverity;
    totalFeeUSD: number | undefined;
    minimumAmountOut: CurrencyAmount<Currency> | undefined;
    maximumAmountIn: CurrencyAmount<Currency> | undefined;
    executionPrice: Price<Currency, Currency> | undefined;
    worstExecutionPrice: Price<Currency, Currency> | undefined;
  };
};

const EMPTY_DERIVED_SWAP_INFO: SwapInfo = Object.freeze({
  currencies: {},
  currencyBalances: {},
  bestTrade: {
    trade: undefined,
    state: TradeState.LOADING,
  },
  isExactOutSLPErrorInput: false,
});

export const SwapContext = createContext<ISwapContextValue>({
  derivedSwapInfo: EMPTY_DERIVED_SWAP_INFO,
  computedSwapInfo: {
    parsedAmounts: {
      [Field.INPUT]: undefined,
      [Field.OUTPUT]: undefined,
    },
    routeNotFound: false,
    routeIsLoading: false,
    routeIsSyncing: false,
    stablecoinPriceImpact: undefined,
    priceImpactSeverity: 0 as WarningSeverity,
    totalFeeUSD: undefined,
    minimumAmountOut: undefined,
    maximumAmountIn: undefined,
    executionPrice: undefined,
    worstExecutionPrice: undefined,
  },
});

export function SwapContextProvider({ children }: { children: React.ReactNode }) {
  const value = useSwapContextValue();
  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
}

export function useSwapContext() {
  return useContext(SwapContext);
}
