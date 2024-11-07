import { Currency } from '@uniswap/sdk-core';
import create from 'zustand';

interface IAllTokens {
  mapTokens: {
    [tokenAddressLowercase: string]: Currency;
  };
  arrTokens: Currency[];
  arrTokenAddresses: string[];
}

interface IGlobalDataStore {
  allTokens: IAllTokens | null;
  setAllTokens: (allTokens: IAllTokens | null) => void;
}

export const useGlobalDataStore = create<IGlobalDataStore>(set => ({
  allTokens: null,
  setAllTokens(allTokens) {
    set({ allTokens });
  },
}));
