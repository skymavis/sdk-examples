import { ExternalProvider } from '@ethersproject/providers/lib/web3-provider';
import { IBaseConnector } from '@sky-mavis/tanto-connect';
import getConfig from 'next/config';
import create from 'zustand';

interface IConnectorStoreState {
  connectedChainId: number;
  connectedAccount: string | null;
  walletProvider: ExternalProvider | null;
  connector: IBaseConnector | null;
}

interface IConnectorStoreAction {
  setConnectedChainId: (connectedChainId: number) => void;
  setConnectedAccount: (connectedAccount: string | null) => void;
  setWalletProvider: (walletProvider: ExternalProvider | null) => void;
  setConnector: (connector: IBaseConnector | null) => void;
  clearData: () => void;
}

const { publicRuntimeConfig } = getConfig();
const { chainId: chainIdFromConfig } = publicRuntimeConfig;

export const useConnectorStore = create<IConnectorStoreState & IConnectorStoreAction>(set => ({
  connectedChainId: Number(chainIdFromConfig),
  connectedAccount: null,
  walletProvider: null,
  connector: null,

  setConnectedChainId: (connectedChainId: number) => set({ connectedChainId }),
  setConnectedAccount: (connectedAccount: string | null) => set({ connectedAccount: connectedAccount?.toLowerCase() }),
  setWalletProvider: (walletProvider: ExternalProvider | null) => set({ walletProvider }),
  setConnector: (connector: IBaseConnector | null) => set({ connector }),
  clearData: () =>
    set({ connectedChainId: Number(chainIdFromConfig), connectedAccount: null, connector: null, walletProvider: null }),
}));
