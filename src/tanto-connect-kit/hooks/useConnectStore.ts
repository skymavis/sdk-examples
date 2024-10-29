import { BaseConnector, IBaseConnector } from "@sky-mavis/tanto-connect";
import create from "zustand";

interface IConnectStoreState {
  connector: BaseConnector | null;

  isConnected: boolean;
  account: string | null;
  chainId: number | null;
}

interface IConnectStoreAction {
  setConnector: (connector: BaseConnector | null) => void;

  setIsConnected: (connected: boolean) => void;
  setAccount: (account: string | null) => void;
  setChainId: (chainId: number | null) => void;
}

export const useConnectorStore = create<
  IConnectStoreState & IConnectStoreAction
>((set) => ({
  isConnected: false,
  account: null,
  chainId: null,
  connector: null,

  setIsConnected: (connected: boolean) => set({ isConnected: connected }),
  setConnector: (connector: BaseConnector | null) => set({ connector }),
  setAccount: (account: string | null) => set({ account }),
  setChainId: (chainId: number | null) => set({ chainId }),
}));
