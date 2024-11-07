import { DEFAULT_ERC20, KatanaTrade } from '@sky-mavis/katana-swap';
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { useMemo } from 'react';

import { RouterPreference, TradeState } from '../constants/enum';
import { useRoutingAPITrade } from './routing-api/useRoutingAPITrade';
import { useGetWalletConnectData } from './useGetWalletConnectData';

/**
 * Returns the debounced v2+v3 trade for a desired swap.
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 * @param account the connected address
 *
 */
export function useDebouncedTrade({
  tradeType,
  amountSpecified,
  otherCurrency,
  account,
  skipFetch = false,
}: {
  tradeType: TradeType;
  amountSpecified?: CurrencyAmount<Currency>;
  otherCurrency?: Currency;
  account?: string;
  skipFetch?: boolean;
}): {
  state: TradeState;
  trade?: KatanaTrade;
} {
  const { chainId } = useGetWalletConnectData();

  const isWrap = useMemo(() => {
    if (!chainId || !amountSpecified || !otherCurrency) {
      return false;
    }
    const wron = DEFAULT_ERC20[chainId].WRON;
    return Boolean(
      (amountSpecified.currency.isNative && wron?.equals(otherCurrency)) ||
        (otherCurrency.isNative && wron?.equals(amountSpecified.currency)),
    );
  }, [amountSpecified, chainId, otherCurrency]);

  const skipRoutingFetch = isWrap || skipFetch;
  const routingApiTradeResult = useRoutingAPITrade(
    skipRoutingFetch,
    tradeType,
    amountSpecified,
    otherCurrency,
    RouterPreference.api,
    account,
  );
  return routingApiTradeResult;
}
