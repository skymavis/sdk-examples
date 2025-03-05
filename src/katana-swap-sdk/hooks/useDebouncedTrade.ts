import { DEFAULT_ERC20 } from '@sky-mavis/katana-swap';
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { useEffect, useMemo, useState } from 'react';

import { RouterPreference } from '../constants/enum';
import { IRoutingAPIResponse, useRoutingAPITrade } from './routing-api/useRoutingAPITrade';
import { useGetWalletConnectData } from './useGetWalletConnectData';

// modified from https://usehooks.com/useDebounce/
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    // This is how we prevent debounced value from updating if value is changed ...
    // .. within the delay period. Timeout gets cleared and restarted.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Prevents excessive quote requests between keystrokes.
const DEBOUNCE_TIME = 350;

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
  skipFetch = false,
}: {
  tradeType: TradeType;
  amountSpecified?: CurrencyAmount<Currency>;
  otherCurrency?: Currency;
  skipFetch?: boolean;
}): IRoutingAPIResponse {
  const { chainId } = useGetWalletConnectData();

  const isDebouncingTyping = useDebounceValue(amountSpecified?.toExact(), DEBOUNCE_TIME) !== amountSpecified?.toExact();

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

  const skipRoutingFetch = isWrap || isDebouncingTyping || skipFetch;

  const routingApiTradeResult = useRoutingAPITrade(
    tradeType,
    amountSpecified,
    otherCurrency,
    RouterPreference.api,
    skipRoutingFetch,
  );
  return routingApiTradeResult;
}
