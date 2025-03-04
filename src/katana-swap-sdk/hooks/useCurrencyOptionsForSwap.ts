import { useMemo } from 'react';

import { useGlobalDataStore } from './store/global-data/useGlobalDataStore';

const useCurrencyOptionsForSwap = () => {
  const { allTokens } = useGlobalDataStore();
  const { arrTokens } = allTokens || {};

  return useMemo(
    () =>
      arrTokens?.map(currency => {
        return { currency };
      }),
    [arrTokens],
  );
};
export { useCurrencyOptionsForSwap };
