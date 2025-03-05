import { ExternalProvider } from '@ethersproject/providers/lib/web3-provider';
import { ChainId } from '@sky-mavis/katana-core';
import { ethers } from 'ethers';
import { isNil } from 'lodash';
import getConfig from 'next/config';
import { useMemo } from 'react';
import { useConnectorStore } from 'src/mavis-market-sdk/components/layout/connectors/stores/useConnectorStore';

export const useGetWalletConnectData = () => {
  const { connectedAccount, walletProvider } = useConnectorStore();
  const { publicRuntimeConfig } = getConfig();
  const { chainId } = publicRuntimeConfig;

  const wallet = useMemo(() => {
    if (isNil(connectedAccount)) {
      return null;
    }

    if (isNil(walletProvider)) {
      return null;
    }

    const web3Provider = new ethers.providers.Web3Provider(walletProvider as ExternalProvider);

    return {
      provider: web3Provider,
      account: connectedAccount?.toLowerCase(),
    };
  }, [walletProvider, connectedAccount]);

  return {
    wallet,
    connectedAccount: connectedAccount?.toLowerCase(),
    chainId: Number(chainId) as ChainId,
  };
};
