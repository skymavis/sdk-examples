import { useQueryClient } from '@tanstack/react-query';

import { ReactQueryKey } from '../constants/enum';

export const useUpdateQueryKeys = (queryKeys: ReactQueryKey[]) => {
  const queryClient = useQueryClient();

  const updateQueryKeys = () =>
    queryKeys.forEach(key => {
      queryClient.refetchQueries({
        queryKey: [key],
        type: 'active',
      });
    });

  return updateQueryKeys;
};
