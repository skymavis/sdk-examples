import { isNil } from 'lodash';

import { useGetWalletConnectData } from './useGetWalletConnectData';

export const useCheckIsOwner = (owner?: string | null) => {
  const { connectedAccount } = useGetWalletConnectData();

  return !isNil(owner) && connectedAccount?.toLowerCase() === owner?.toLowerCase();
};
