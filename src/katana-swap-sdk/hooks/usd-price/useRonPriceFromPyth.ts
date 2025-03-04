import { getRonPricePyth, getTokenPrice } from '@sky-mavis/katana-swap';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryKey } from 'src/katana-swap-sdk/constants/enum';

import { useGetWalletConnectData } from '../useGetWalletConnectData';

export const useRonPriceFromPyth = (skip?: boolean) => {
  const { chainId } = useGetWalletConnectData();

  return useQuery({
    queryKey: [ReactQueryKey.GET_PYTH_RON_PRICE, chainId],
    queryFn: async () => await getRonPricePyth(chainId),
    enabled: !skip && !!chainId,
  });
};
