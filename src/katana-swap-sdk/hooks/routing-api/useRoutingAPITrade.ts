import { KatanaTrade } from '@sky-mavis/katana-swap';
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { useMemo } from 'react';
import { RouterPreference, TradeState } from 'src/katana-swap-sdk/constants/enum';

import useGetQuoteQuery from './useGetQuoteQuery';
import { useRoutingAPIArguments } from './useRoutingAPIArguments';

const TRADE_NOT_FOUND = { state: TradeState.NO_ROUTE_FOUND, trade: undefined, currentData: undefined } as const;
const TRADE_LOADING = { state: TradeState.LOADING, trade: undefined, currentData: undefined } as const;

export function useRoutingAPITrade<TTradeType extends TradeType>(
  skipFetch: boolean,
  tradeType: TTradeType,
  amountSpecified: CurrencyAmount<Currency> | undefined,
  otherCurrency: Currency | undefined,
  routerPreference: RouterPreference,
  account?: string,
): {
  state: TradeState;
  trade?: KatanaTrade;
  currentTrade?: KatanaTrade;
};
/**
 * Returns the best trade by invoking the routing api or the smart order router on the client
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useRoutingAPITrade<TTradeType extends TradeType>(
  skipFetch = false,
  tradeType: TTradeType,
  amountSpecified: CurrencyAmount<Currency> | undefined,
  otherCurrency: Currency | undefined,
  routerPreference: RouterPreference,
  account?: string,
): {
  state: TradeState;
  trade?: KatanaTrade;
  currentTrade?: KatanaTrade;
} {
  const [currencyIn, currencyOut]: [Currency | undefined, Currency | undefined] = useMemo(
    () =>
      tradeType === TradeType.EXACT_INPUT
        ? [amountSpecified?.currency, otherCurrency]
        : [otherCurrency, amountSpecified?.currency],
    [amountSpecified, otherCurrency, tradeType],
  );

  const queryArgs = useRoutingAPIArguments({
    account,
    tokenIn: currencyIn,
    tokenOut: currencyOut,
    amount: amountSpecified,
    tradeType,
    routerPreference,
  });

  // skip all pricing and quote requests if the window is not focused
  // const isWindowVisible = useIsWindowVisible();

  const { data: tradeResult, error, isFetching } = useGetQuoteQuery(queryArgs, skipFetch);

  return useMemo(() => {
    if (!amountSpecified || !!error || !queryArgs) {
      return {
        state: TradeState.INVALID,
        trade: undefined,
        error: JSON.stringify(error),
      };
    } else if (tradeResult === null && !isFetching) {
      return TRADE_NOT_FOUND;
    } else if (!tradeResult) {
      return TRADE_LOADING;
    } else {
      return {
        state: isFetching ? TradeState.LOADING : TradeState.VALID,
        trade: tradeResult,
      };
    }
  }, [amountSpecified, error, isFetching, queryArgs, tradeResult]);
}
