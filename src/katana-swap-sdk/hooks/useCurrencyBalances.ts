import { ChainId, RON } from '@sky-mavis/katana-core';
import { getRonBalance, getTokenBalances } from '@sky-mavis/katana-swap';
import { useQuery } from '@tanstack/react-query';
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core';
import JSBI from 'jsbi';
import { useMemo } from 'react';

import { ReactQueryKey } from '../constants/enum';

export function useRonBalance(chainId: ChainId, address?: string) {
  return useQuery({
    queryKey: [ReactQueryKey.RON_BALANCE, address, chainId],
    queryFn: async () => {
      if (!chainId || !address) return undefined;
      const balance = await getRonBalance({ account: address, chainId });
      return CurrencyAmount.fromRawAmount(RON.onChain(chainId), JSBI.BigInt(balance.toString()));
    },
    enabled: !!address && !!chainId,
  });
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalances(chainId: ChainId, address?: string, tokens?: Token[]) {
  const tokenAddresses = useMemo(() => tokens?.map(token => token.address), [tokens]);

  return useQuery({
    queryKey: [ReactQueryKey.USER_TOKEN_BALANCES, address, tokenAddresses, chainId],
    queryFn: async () => {
      if (!address || !tokenAddresses?.length || !chainId || !tokens) return undefined;
      const tokenBalances = await getTokenBalances({ account: address, chainId, tokens: tokenAddresses });
      return tokens.reduce<{
        [tokenAddress: string]: CurrencyAmount<Token> | null;
      }>((memo, cur) => {
        const balance = tokenBalances[cur.address];
        if (balance) {
          memo[cur.address] = CurrencyAmount.fromRawAmount(cur, JSBI.BigInt(balance.toString()));
        } else {
          memo[cur.address] = null;
        }
        return memo;
      }, {});
    },
    enabled: !!address && !!tokenAddresses && tokenAddresses.length > 0,
  });
}

export function useCurrencyBalances(
  chainId: ChainId,
  account?: string,
  currencies?: (Currency | undefined)[],
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency?.isToken ?? false) ?? [],
    [currencies],
  );

  const { data: tokenBalances } = useTokenBalances(chainId, account, tokens);
  const containsRON: boolean = useMemo(() => currencies?.some(currency => currency?.isNative) ?? false, [currencies]);
  const { data: ronBalance } = useRonBalance(chainId, containsRON ? account : undefined);

  return useMemo(
    () =>
      currencies?.map(currency => {
        if (!account || !currency) return undefined;
        if (currency.isToken) return tokenBalances?.[currency.address] ?? undefined;
        if (currency.isNative && ronBalance) return ronBalance;
        return undefined;
      }) ?? [],
    [account, currencies, ronBalance, tokenBalances],
  );
}
