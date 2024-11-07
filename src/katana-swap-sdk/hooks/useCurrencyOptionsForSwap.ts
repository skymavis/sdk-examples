import { useMemo } from 'react';

import { useGlobalDataStore } from './store/global-data/useGlobalDataStore';
import { useCurrencyBalances } from './useCurrencyBalances';
import { useGetWalletConnectData } from './useGetWalletConnectData';

const useCurrencyOptionsForSwap = () => {
  const { chainId, connectedAccount } = useGetWalletConnectData();
  const { allTokens } = useGlobalDataStore();
  const { arrTokens } = allTokens || {};

  const currencyOptionsBalance = useCurrencyBalances(chainId, connectedAccount, arrTokens);

  return useMemo(
    () =>
      arrTokens?.map((currency, idx) => {
        return { currency, balance: currencyOptionsBalance[idx] };
      }),
    [currencyOptionsBalance, arrTokens],
  );
};
export { useCurrencyOptionsForSwap };
