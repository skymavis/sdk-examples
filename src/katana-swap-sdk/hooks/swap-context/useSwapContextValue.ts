import { useMemo } from 'react';
import { Field, TradeState } from 'src/katana-swap-sdk/constants/enum';
import { ISwapContextValue } from 'src/katana-swap-sdk/context/SwapContext';
import { useSwapStore } from 'src/katana-swap-sdk/hooks/store/swap/useSwapStore';
import { useUSDPrice } from 'src/katana-swap-sdk/hooks/usd-price/useUSDPrice';
import { useGetWalletConnectData } from 'src/katana-swap-sdk/hooks/useGetWalletConnectData';
import { computeFiatValuePriceImpact } from 'src/katana-swap-sdk/utils/computeFiatValuePriceImpact';
import { warningSeverity } from 'src/katana-swap-sdk/utils/prices';

import { useCalculateFeeSwap } from './useCalculateFeeSwap';
import { useDerivedSwapInfo } from './useDerivedSwapInfo';

const useFinalizeDataBeforeCompute = () => {
  const derivedSwapInfo = useDerivedSwapInfo();

  const {
    bestTrade: { trade },
  } = derivedSwapInfo ?? {};

  const { totalFeeSwap, minimumAmountOut, maximumAmountIn, worstExecutionPrice } = useCalculateFeeSwap(trade);

  return {
    derivedSwapInfo,
    totalFeeSwap,
    maximumAmountIn,
    minimumAmountOut,
    worstExecutionPrice,
  };
};

export const useSwapContextValue = (): ISwapContextValue => {
  const { independentField } = useSwapStore();
  const { connectedAccount } = useGetWalletConnectData();

  const { derivedSwapInfo, totalFeeSwap, minimumAmountOut, maximumAmountIn, worstExecutionPrice } =
    useFinalizeDataBeforeCompute();

  const {
    bestTrade: { trade, state: tradeState },
    currencies,
    parsedAmount,
    currencyBalances,
    showWrap,
  } = derivedSwapInfo;

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
          },
    [independentField, trade?.inputAmount, trade?.outputAmount, parsedAmount, showWrap],
  );
  const [routeNotFound, routeIsLoading, routeIsSyncing] = useMemo(
    () => [
      tradeState === TradeState.NO_ROUTE_FOUND,
      tradeState === TradeState.LOADING,
      tradeState === TradeState.LOADING && Boolean(trade),
    ],
    [tradeState, trade],
  );

  const fiatValueTradeInput = useUSDPrice(trade?.inputAmount);
  const fiatValueTradeOutput = useUSDPrice(trade?.outputAmount);

  const stablecoinPriceImpact = useMemo(
    () =>
      routeIsSyncing || showWrap
        ? undefined
        : computeFiatValuePriceImpact(fiatValueTradeInput.data, fiatValueTradeOutput.data),

    [fiatValueTradeInput, fiatValueTradeOutput, routeIsSyncing, showWrap],
  );

  const priceImpactSeverity = useMemo(() => {
    return warningSeverity(stablecoinPriceImpact);
  }, [stablecoinPriceImpact]);

  const inputError = useMemo(() => {
    let inputError: string | undefined;
    if (!connectedAccount) {
      inputError = `Connect Ronin Wallet`;
    }

    if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
      inputError = inputError ?? `Select a token`;
    }

    if (!parsedAmount) {
      inputError = inputError ?? `Enter an amount`;
    }

    // compare input balance to max input based on version
    const [balanceIn, maxAmountIn] = [currencyBalances[Field.INPUT], maximumAmountIn];

    if (balanceIn && maxAmountIn && balanceIn.lessThan(maxAmountIn)) {
      inputError = `Insufficient ${maxAmountIn.currency.symbol} balance to swap`;
    }

    return inputError;
  }, [connectedAccount, currencies, currencyBalances, maximumAmountIn, parsedAmount]);

  return {
    derivedSwapInfo: { ...derivedSwapInfo, inputError },

    computedSwapInfo: {
      parsedAmounts,
      routeNotFound,
      routeIsLoading,
      routeIsSyncing,
      stablecoinPriceImpact,
      priceImpactSeverity,
      minimumAmountOut,
      totalFeeUSD: totalFeeSwap,
      maximumAmountIn,
      executionPrice: trade?.executionPrice,
      worstExecutionPrice,
    },
  };
};
