import { useIsMobile } from '@nextui-org/use-is-mobile';
import { useMemo } from 'react';

const usePlatformCheck = () => {
  const isMobile = useIsMobile();

  const isOnClient = () => {
    return typeof window !== 'undefined';
  };

  const isInAppBrowser = useMemo(() => {
    if (isOnClient()) {
      return !!window.isWalletApp && window.ronin !== undefined && !!window.ethereum?.isRonin;
    } else {
      return false;
    }
  }, []);

  return {
    isMobile: isMobile,
    isInAppBrowser,
  };
};

export default usePlatformCheck;
