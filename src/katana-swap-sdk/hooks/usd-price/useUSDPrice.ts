import { RON } from '@sky-mavis/katana-core';
import { getTokenPrice } from '@sky-mavis/katana-swap';
import { useQuery } from '@tanstack/react-query';
import { Currency, CurrencyAmount, Price } from '@uniswap/sdk-core';
import { useMemo } from 'react';
import { ReactQueryKey } from 'src/katana-swap-sdk/constants/enum';

import { useGetWalletConnectData } from '../useGetWalletConnectData';
import { useRonPriceFromPyth } from './useRonPriceFromPyth';

export function useTokenPrice(currency?: Currency, skip = false) {
  const { chainId } = useGetWalletConnectData();

  return useQuery({
    queryKey: [ReactQueryKey.GET_TOKEN_QUOTE_PRICE, chainId, currency],
    queryFn: async () => {
      // Handle RON
      if (currency?.wrapped.equals(RON.onChain(currency?.chainId).wrapped)) {
        return new Price(currency, RON.onChain(currency?.chainId), '1', '1');
      }
      return await getTokenPrice({ chainId, tokenAddress: currency?.wrapped?.address ?? '' });
    },
    enabled: !skip && !!chainId && !!currency && !!currency?.wrapped?.address,
  });
}

export function useUSDPrice(currencyAmount?: CurrencyAmount<Currency>, prefetchCurrency?: Currency) {
  const currency = currencyAmount?.currency ?? prefetchCurrency;

  // Use RON-based pricing if available.
  const { data: tokenPrice, isLoading: isTokenPriceLoading } = useTokenPrice(currency);
  const { data: ronPriceFromPyth, isLoading: loadingRonPriceFromPyth } = useRonPriceFromPyth();
  const isTokenRonPrice = tokenPrice?.quoteCurrency.equals(RON.onChain(tokenPrice?.quoteCurrency?.chainId)) ?? false;

  return useMemo(() => {
    if (!currencyAmount) {
      return { data: undefined, isLoading: false };
    } else {
      return {
        data: !tokenPrice
          ? undefined
          : isTokenRonPrice && !!ronPriceFromPyth
          ? parseFloat(tokenPrice.quote(currencyAmount).toExact()) * ronPriceFromPyth
          : parseFloat(tokenPrice.quote(currencyAmount).toSignificant()),
        price: tokenPrice,
        isLoading: isTokenPriceLoading || (isTokenRonPrice && loadingRonPriceFromPyth),
      };
    }
  }, [currencyAmount, tokenPrice, isTokenRonPrice, ronPriceFromPyth, loadingRonPriceFromPyth]);
}
