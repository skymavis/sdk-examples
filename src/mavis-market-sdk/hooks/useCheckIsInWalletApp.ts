import { useCheckClient } from './useCheckClient';

export const useCheckIsInWalletApp = () => {
  const { isClient } = useCheckClient();
  if (!isClient) {
    return false;
  }

  return window && (window as any).isWalletApp;
};
