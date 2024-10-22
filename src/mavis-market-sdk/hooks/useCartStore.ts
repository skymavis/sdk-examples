import { Erc721Token, Order } from '@sky-mavis/mavis-market-core';
import { getCartKey } from 'src/mavis-market-sdk/utils/getCartDataUtils';
import create from 'zustand';
import { persist } from 'zustand/middleware';

import { LOCAL_STORAGE_KEYS } from '../common/constants';

export interface CartState {
  cartItems: Record<string, Erc721Token>;
  setAllCartItems: (value: Record<string, Erc721Token>) => void;
  addItemToCart: (value: Erc721Token) => void;
  setCartItemOrder: (value: Erc721Token, newOrderValue: Order) => void;
  deleteItemFromCart: (value: Erc721Token) => void;
  clearCart: () => void;
}

export const useCartStore = create(
  persist<CartState>(
    set => ({
      cartItems: {},
      setAllCartItems: (value: Record<string, Erc721Token>) => {
        set({ cartItems: value });
      },
      addItemToCart: (value: Erc721Token) => {
        set(state => {
          const latestCart = { ...state.cartItems };
          const key = getCartKey(value.tokenId, value.tokenAddress);
          return {
            cartItems: {
              ...latestCart,
              [key]: value,
            },
          };
        });
      },
      setCartItemOrder: (value: Erc721Token, orderValue: Order) => {
        set(state => {
          const latestCart = { ...state.cartItems };
          const key = getCartKey(value.tokenId, value.tokenAddress);
          return {
            cartItems: {
              ...latestCart,
              [key]: {
                ...latestCart[key],
                order: orderValue,
              },
            },
          };
        });
      },
      deleteItemFromCart: (value: Erc721Token) => {
        set(state => {
          const latestCart = { ...state.cartItems };
          const key = getCartKey(value.tokenId, value.tokenAddress);
          delete latestCart[key];
          return {
            cartItems: latestCart,
          };
        });
      },
      clearCart: () => {
        set(() => {
          return {
            cartItems: {},
          };
        });
      },
    }),
    {
      name: LOCAL_STORAGE_KEYS.erc721Cart,
      getStorage: () => localStorage,
    },
  ),
);
