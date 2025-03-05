import { ZERO_PERCENT } from '@sky-mavis/katana-core';
import { KatanaTrade } from '@sky-mavis/katana-swap';
import { Currency, CurrencyAmount, Fraction, Percent, Price, Token } from '@uniswap/sdk-core';
import { Pair } from '@uniswap/v2-sdk';
import { FeeAmount } from '@uniswap/v3-sdk';
import JSBI from 'jsbi';
import isNil from 'lodash/isNil';

import {
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
} from '../constants/misc';

// Max percentage 100%. Values [0; 100_00] reflexes [0; 100%]
export const MAX_PERCENTAGE = 100_00;

const THIRTY_BIPS_FEE = new Percent(JSBI.BigInt(30), MAX_PERCENTAGE);
const ONE_HUNDRED_PERCENT = new Percent(MAX_PERCENTAGE, MAX_PERCENTAGE);
const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(THIRTY_BIPS_FEE);

export function computeRealizedPriceImpact(trade: KatanaTrade): Percent {
  const realizedLpFeePercent = computeRealizedLPFeePercentSwap(trade);
  return trade.priceImpact.subtract(realizedLpFeePercent);
}

// computes realized lp fee as a percent
export function computeRealizedLPFeePercentSwap(trade: KatanaTrade): Percent {
  let percent: Percent;

  // Since routes are either all v2 or all v3 right now, calculate separately
  if (trade.swaps[0].route.pools instanceof Pair) {
    // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
    // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
    percent = ONE_HUNDRED_PERCENT.subtract(
      trade.swaps.reduce<Percent>(
        (currentFee: Percent): Percent => currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
        ONE_HUNDRED_PERCENT,
      ),
    );
  } else {
    percent = ZERO_PERCENT;
    for (const swap of trade.swaps) {
      const { numerator, denominator } = swap.inputAmount.divide(trade.inputAmount);
      const overallPercent = new Percent(numerator, denominator);
      const routeRealizedLPFeePercent = overallPercent.multiply(
        ONE_HUNDRED_PERCENT.subtract(
          swap.route.pools.reduce<Percent>((currentFee: Percent, pool): Percent => {
            const fee =
              pool instanceof Pair
                ? // not currently possible given protocol check above, but not fatal
                  FeeAmount.MEDIUM
                : pool.fee;
            return currentFee.multiply(ONE_HUNDRED_PERCENT.subtract(new Fraction(fee, 1_000_000)));
          }, ONE_HUNDRED_PERCENT),
        ),
      );

      percent = percent.add(routeRealizedLPFeePercent);
    }
  }

  return new Percent(percent.numerator, percent.denominator);
}

// computes price breakdown for the trade
export function computeRealizedLPFeeAmount(trade?: KatanaTrade | null): CurrencyAmount<Currency> | undefined {
  if (trade) {
    const realizedLPFee = computeRealizedLPFeePercentSwap(trade);

    // the amount of the input that accrues to LPs
    return CurrencyAmount.fromRawAmount(trade.inputAmount.currency, trade.inputAmount.multiply(realizedLPFee).quotient);
  }

  return undefined;
}

const IMPACT_TIERS = [
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  ALLOWED_PRICE_IMPACT_LOW,
];

export type WarningSeverity = 0 | 1 | 2 | 3 | 4;
export function warningSeverity(priceImpact: Percent | undefined): WarningSeverity {
  if (!priceImpact) {
    return 0;
  }
  // This function is used to calculate the Severity level for % changes in USD value and Price Impact.
  // Price Impact is always an absolute value (conceptually always negative, but represented in code with a positive value)
  // The USD value change can be positive or negative, and it follows the same standard as Price Impact (positive value is the typical case of a loss due to slippage).
  // We don't want to return a warning level for a favorable/profitable change, so when the USD value change is negative we return 0.
  // TODO (WEB-1833): Disambiguate Price Impact and USD value change, and flip the sign of USD Value change.
  if (priceImpact.lessThan(0)) {
    return 0;
  }
  let impact: WarningSeverity = IMPACT_TIERS.length as WarningSeverity;
  for (const impactLevel of IMPACT_TIERS) {
    if (impactLevel.lessThan(priceImpact)) {
      return impact;
    }
    impact--;
  }
  return 0;
}

export function quoteTokenPrice(
  tokenPrice?: number | Price<Currency, Token> | null,
  amount?: CurrencyAmount<Currency | Token>,
) {
  if (isNil(tokenPrice) || amount === undefined) {
    return undefined;
  }

  if (typeof tokenPrice === 'number') {
    return tokenPrice * parseFloat(amount.toExact());
  }

  if (tokenPrice.baseCurrency.equals(amount.currency.wrapped)) {
    return parseFloat(tokenPrice.quote(amount.wrapped).toExact());
  }

  return undefined;
}
