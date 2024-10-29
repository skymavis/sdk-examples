import { BaseConnector } from "@sky-mavis/tanto-connect";
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

  clearStore: () => void;
}

const useConnectStore = create<IConnectStoreState & IConnectStoreAction>(
  (set) => ({
    connector: null,
    isConnected: false,
    account: null,
    chainId: null,

    setConnector: (connector: BaseConnector | null) => set({ connector }),
    setIsConnected: (connected: boolean) => set({ isConnected: connected }),
    setAccount: (account: string | null) => set({ account }),
    setChainId: (chainId: number | null) => set({ chainId }),

    clearStore: () => {
      console.log("Clearing Connect Store");
      set({
        connector: null,
        isConnected: false,
        account: null,
        chainId: null,
      });
    },
  })
);

export default useConnectStore;
