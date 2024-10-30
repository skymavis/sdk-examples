import { BaseConnector } from '@sky-mavis/tanto-connect';
import create from 'zustand';

interface IConnectorsStore {
  connectors: BaseConnector[];
  isInitialized: boolean;
  setConnectors: (connectors: BaseConnector[]) => void;
  setIsInitialized: (isInitialized: boolean) => void;
}

const useConnectorsStore = create<IConnectorsStore>(set => ({
  connectors: [],
  isInitialized: false,
  setConnectors: (connectors: BaseConnector[]) => set({ connectors }),
  setIsInitialized: (isInitialized: boolean) => set({ isInitialized }),
}));

export default useConnectorsStore;
