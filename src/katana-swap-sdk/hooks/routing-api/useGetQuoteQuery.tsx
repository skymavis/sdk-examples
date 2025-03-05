import { getBestTrade, GetQuoteArgs } from '@sky-mavis/katana-swap';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryKey } from 'src/katana-swap-sdk/constants/enum';
import { INTERNAL_ROUTER_PREFERENCE_PRICE, REFETCHING_QUOTE_INTERVAL_MS } from 'src/katana-swap-sdk/constants/misc';

const useGetQuoteQuery = (args: GetQuoteArgs | undefined, skip?: boolean) => {
  const { chainId, tokenInAddress, tokenOutAddress, amount, tradeType, intent } = args ?? {};

  return useQuery({
    queryKey: [ReactQueryKey.GET_QUOTE, chainId, tokenInAddress, tokenOutAddress, amount, tradeType, intent],
    queryFn: async () => {
      if (!args) {
        throw new Error('No args provided');
      }

      try {
        const bestTrade = await getBestTrade(args);
        return bestTrade;
      } catch (error: any) {
        console.error(
          `GetQuote failed on Routing API, falling back to client: ${error?.message ?? error?.detail ?? error}`,
        );
        throw error;
      }
    },
    enabled: !skip && !!args,
    staleTime: REFETCHING_QUOTE_INTERVAL_MS,
    refetchInterval(query) {
      // Price-fetching is informational and costly, so it's done less frequently.
      if (query.queryKey.includes(INTERNAL_ROUTER_PREFERENCE_PRICE)) {
        return 60000;
      }
      return REFETCHING_QUOTE_INTERVAL_MS;
    },
    retry: false,
    refetchOnMount: false,
  });
};
export default useGetQuoteQuery;
