import { GetQuoteArgs, QuoteIntent, SwapRouterNativeAssets } from '@sky-mavis/katana-swap';
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { useMemo } from 'react';
import { RouterPreference } from 'src/katana-swap-sdk/constants/enum';
import { INTERNAL_ROUTER_PREFERENCE_PRICE } from 'src/katana-swap-sdk/constants/misc';

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
  tokenIn,
  tokenOut,
  amount,
  tradeType,
  routerPreference = RouterPreference.api,
}: {
  tokenIn?: Currency;
  tokenOut?: Currency;
  amount?: CurrencyAmount<Currency>;
  tradeType: TradeType;
  routerPreference: RouterPreference | typeof INTERNAL_ROUTER_PREFERENCE_PRICE;
}): GetQuoteArgs | undefined {
  const { chainId } = useGetWalletConnectData();
  return useMemo(
    () =>
      !tokenIn || !tokenOut || !amount || tokenIn.equals(tokenOut) || tokenIn.wrapped.equals(tokenOut.wrapped)
        ? undefined
        : {
            chainId: tokenIn.chainId,
            tokenInAddress: currencyAddressForSwapQuote(tokenIn),
            tokenOutAddress: currencyAddressForSwapQuote(tokenOut),
            amount: amount.quotient.toString(),
            intent: routerPreference === INTERNAL_ROUTER_PREFERENCE_PRICE ? QuoteIntent.Pricing : QuoteIntent.Quote,
            tradeType,
          },
    [tokenIn, tokenOut, amount, routerPreference, tradeType, chainId],
  );
}
