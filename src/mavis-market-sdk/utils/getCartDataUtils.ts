import { MAX_CART_ITEMS } from '../common/constants';

export const getCartKey = (tokenId: string, tokenAddress: string) => {
  return `${tokenId}-${tokenAddress}`;
};

export const countCartItems = (cart: Record<string, any>) => {
  return Object.keys(cart).length;
};

export const checkIsAllowedAddToCart = (cart: Record<string, any>) => {
  return countCartItems(cart) < MAX_CART_ITEMS;
};

export const getTokenIds = (cart: Record<string, any>) => {
  return Object.values(cart).map(token => ({
    tokenAddress: token.tokenAddress,
    tokenId: token.tokenId,
  }));
};
