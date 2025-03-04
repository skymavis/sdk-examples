import { KatanaTrade } from '@sky-mavis/katana-swap';
import { CurrencyAmount, Percent, Token } from '@uniswap/sdk-core';
import { useMemo } from 'react';

export function useMaxAmountIn(trade: KatanaTrade | undefined, allowedSlippage: Percent) {
  return useMemo(() => {
    if (!trade || !allowedSlippage) return undefined;
    const maximumAmountIn = trade?.maximumAmountIn(allowedSlippage);
    return maximumAmountIn?.currency.isToken ? (maximumAmountIn as CurrencyAmount<Token>) : undefined;
  }, [allowedSlippage, trade]);
}
