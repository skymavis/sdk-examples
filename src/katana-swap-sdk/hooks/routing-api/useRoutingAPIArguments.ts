import { GetQuoteArgs, SwapRouterNativeAssets } from '@sky-mavis/katana-swap';
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { useMemo } from 'react';
import { RouterPreference } from 'src/katana-swap-sdk/constants/enum';

import { useGetWalletConnectData } from '../useGetWalletConnectData';

function currencyAddressForSwapQuote(currency: Currency): string {
  if (currency.isNative) {
    return SwapRouterNativeAssets.RON;
  }

  return currency.address;
}

/**
 * Returns query arguments for the Routing API query or undefined if the
 * query should be skipped. Input arguments do not need to be memoized, as they will
 * be destructured.
 */
export function useRoutingAPIArguments({
  account,
  tokenIn,
  tokenOut,
  amount,
  tradeType,
  routerPreference = RouterPreference.api,
}: {
  account?: string;
  tokenIn?: Currency;
  tokenOut?: Currency;
  amount?: CurrencyAmount<Currency>;
  tradeType: TradeType;
  routerPreference: RouterPreference;
}): GetQuoteArgs | undefined {
  const { chainId } = useGetWalletConnectData();
  return useMemo(
    () =>
      !tokenIn || !tokenOut || !amount || tokenIn.equals(tokenOut) || tokenIn.wrapped.equals(tokenOut.wrapped)
        ? undefined
        : {
            chainId: chainId,
            amount: amount.quotient.toString(),
            tokenInAddress: currencyAddressForSwapQuote(tokenIn),
            tokenInChainId: tokenIn.chainId,
            tokenInDecimals: tokenIn.wrapped.decimals,
            tokenInSymbol: tokenIn.wrapped.symbol,
            tokenOutAddress: currencyAddressForSwapQuote(tokenOut),
            tokenOutChainId: tokenOut.wrapped.chainId,
            tokenOutDecimals: tokenOut.wrapped.decimals,
            tokenOutSymbol: tokenOut.wrapped.symbol,
            routerPreference,
            tradeType,
          },
    [tokenIn, tokenOut, amount, account, routerPreference, tradeType, chainId],
  );
}
