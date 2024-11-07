import { Percent } from '@uniswap/sdk-core';

import {
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
} from '../constants/misc';

type WarningSeverity = 0 | 1 | 2 | 3 | 4;

const IMPACT_TIERS = [
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  ALLOWED_PRICE_IMPACT_LOW,
];

function warningSeverity(priceImpact: Percent | undefined): WarningSeverity {
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

export type { WarningSeverity };
export { warningSeverity };
