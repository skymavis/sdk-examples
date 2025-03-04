import { KatanaTrade } from '@sky-mavis/katana-swap';
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { useMemo } from 'react';
import { RouterPreference, TradeState } from 'src/katana-swap-sdk/constants/enum';
import { INTERNAL_ROUTER_PREFERENCE_PRICE } from 'src/katana-swap-sdk/constants/misc';

import useGetQuoteQuery from './useGetQuoteQuery';
import { useRoutingAPIArguments } from './useRoutingAPIArguments';

export type IRoutingAPIResponse = {
  trade: KatanaTrade | undefined;
  state: TradeState;
};

const TRADE_NOT_FOUND: IRoutingAPIResponse = {
  state: TradeState.NO_ROUTE_FOUND,
  trade: undefined,
} as const;

/**
 * Returns the best trade by invoking the routing api or the smart order router on the client
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useRoutingAPITrade<TTradeType extends TradeType>(
  tradeType: TTradeType,
  amountSpecified: CurrencyAmount<Currency> | undefined,
  otherCurrency: Currency | undefined,
  routerPreference: RouterPreference | typeof INTERNAL_ROUTER_PREFERENCE_PRICE,
  skipFetch = false,
): IRoutingAPIResponse {
  const [currencyIn, currencyOut]: [Currency | undefined, Currency | undefined] = useMemo(
    () =>
      tradeType === TradeType.EXACT_INPUT
        ? [amountSpecified?.currency, otherCurrency]
        : [otherCurrency, amountSpecified?.currency],
    [amountSpecified, otherCurrency, tradeType],
  );

  const queryArgs = useRoutingAPIArguments({
    tokenIn: currencyIn,
    tokenOut: currencyOut,
    amount: amountSpecified,
    tradeType,
    routerPreference,
  });

  const { data: tradeResult, error, isFetching, isError, isLoading } = useGetQuoteQuery(queryArgs, skipFetch);

  return useMemo(() => {
    if (!amountSpecified || isError || !queryArgs) {
      return {
        state: TradeState.INVALID,
        trade: undefined,
        error: JSON.stringify(error),
      };
    } else if (tradeResult === null) {
      return TRADE_NOT_FOUND;
    } else {
      return {
        state: isFetching || isLoading ? TradeState.LOADING : TradeState.VALID,
        trade: tradeResult,
      };
    }
  }, [amountSpecified, error, isError, isFetching, queryArgs, tradeResult]);
}
