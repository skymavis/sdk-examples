import { DEFAULT_ERC20, RON } from '@sky-mavis/katana-core';
import { Currency } from '@uniswap/sdk-core';
import { useMemo } from 'react';

import { useGlobalDataStore } from './store/global-data/useGlobalDataStore';
import { useGetWalletConnectData } from './useGetWalletConnectData';

export function useToken(tokenAddress: string | undefined): Currency | undefined {
  const { allTokens } = useGlobalDataStore();
  const { mapTokens } = allTokens ?? {};

  return useMemo(() => {
    if (!tokenAddress || !mapTokens) return undefined;
    const token = mapTokens[tokenAddress.toLowerCase()];
    return tokenAddress ? token : undefined;
  }, [mapTokens, tokenAddress]);
}

export function useCurrency(currencyId: string | undefined, forceToRon?: boolean): Currency | undefined {
  const { chainId } = useGetWalletConnectData();
  const isRON = currencyId?.toUpperCase() === 'RON';
  const token = useToken(isRON ? undefined : currencyId);
  const wron = chainId ? DEFAULT_ERC20[chainId].WRON : undefined;
  const shouldReturnNative = isRON || (forceToRon && wron?.address?.toLowerCase() === currencyId?.toLowerCase());

  return useMemo(
    () => (shouldReturnNative ? (chainId ? RON.onChain(chainId) : undefined) : token),
    [chainId, shouldReturnNative, token],
  );
}
