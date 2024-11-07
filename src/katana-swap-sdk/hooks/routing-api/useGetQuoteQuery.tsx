import { getBestTrade, GetQuoteArgs } from '@sky-mavis/katana-swap';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryKey } from 'src/katana-swap-sdk/constants/enum';

const useGetQuoteQuery = (args: GetQuoteArgs | undefined, skip?: boolean) => {
  return useQuery({
    queryKey: [ReactQueryKey.GET_QUOTE, args],
    queryFn: async () => {
      if (!args) {
        throw new Error('No args provided');
      }

      return await getBestTrade(args);
    },
    enabled: !skip && !!args,
    retry: false,
  });
};
export default useGetQuoteQuery;
