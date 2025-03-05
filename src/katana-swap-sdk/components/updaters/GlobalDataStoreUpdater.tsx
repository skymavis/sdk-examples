import { RON } from '@sky-mavis/katana-core';
import { getAllTokens } from '@sky-mavis/katana-swap';
import { useEffect } from 'react';
import { useGlobalDataStore } from 'src/katana-swap-sdk/hooks/store/global-data/useGlobalDataStore';
import { useGetWalletConnectData } from 'src/katana-swap-sdk/hooks/useGetWalletConnectData';

export default function GlobalDataStoreUpdater() {
  const { chainId } = useGetWalletConnectData();
  const { setAllTokens } = useGlobalDataStore();

  useEffect(() => {
    // Fetch all public tokens
    if (!chainId) return;
    getAllTokens(chainId)
      .then(allTokens => {
        setAllTokens({
          mapTokens: { ...allTokens.mapTokens, RON: RON.onChain(chainId) },
          arrTokens: [RON.onChain(chainId), ...allTokens.arrTokens],
          arrTokenAddresses: [...allTokens.arrTokenAddresses, 'RON'],
        });
      })
      .catch(error => {
        console.error('[GlobalDataStoreUpdater] Error fetching all public tokens', error);
      });
  }, [chainId]);

  return null;
}
