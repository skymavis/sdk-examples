import { KatanaTrade } from '@sky-mavis/katana-swap';
import { Currency, Price } from '@uniswap/sdk-core';

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * i.e. if the trade details don't match, or if the new price is worse than the old price.
 * @param args either a pair of V2 trades or a pair of V3 trades
 */
export function tradeMeaningfullyDiffers({
  currentTrade,
  newTrade,
  worstExecutionPrice,
  newExecutionPrice,
}: {
  currentTrade: KatanaTrade;
  newTrade: KatanaTrade;
  worstExecutionPrice: Price<Currency, Currency> | undefined;
  newExecutionPrice: Price<Currency, Currency> | undefined;
}): boolean {
  if (!currentTrade || !newTrade || !newExecutionPrice || !worstExecutionPrice) return false;

  return (
    currentTrade.tradeType !== newTrade.tradeType ||
    !currentTrade.inputAmount.currency.equals(newTrade.inputAmount.currency) ||
    !currentTrade.outputAmount.currency.equals(newTrade.outputAmount.currency) ||
    newExecutionPrice.lessThan(worstExecutionPrice)
  );
}
