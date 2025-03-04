import { DEFAULT_ERC20, RON } from '@sky-mavis/katana-core';
import { Currency } from '@uniswap/sdk-core';

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency;

  if (
    currency.chainId &&
    currency.equals(DEFAULT_ERC20[currency.chainId as keyof typeof DEFAULT_ERC20].WRON) // NOTE: fix this type in core package
  )
    return RON.onChain(currency.chainId);
  return currency;
}
