import { KatanaTrade } from '@sky-mavis/katana-swap';
import { Protocol } from '@uniswap/router-sdk';
import { Currency, Percent, TradeType } from '@uniswap/sdk-core';
import { Pair } from '@uniswap/v2-sdk';
import { FeeAmount } from '@uniswap/v3-sdk';

import { PoolCache } from './pool-cache';
import { unwrappedToken } from './unwrappedToken';

export interface RoutingDiagramEntry {
  percent: Percent;
  path: [Currency, Currency, FeeAmount, string][];
  protocol: Protocol;
}

/**
 * Loops through all routes on a trade and returns an array of diagram entries.
 */
export default function getRoutingDiagramEntries(trade: KatanaTrade, chainId: number): RoutingDiagramEntry[] {
  return trade.swaps.map(({ route: { path: tokenPath, pools, protocol }, inputAmount, outputAmount }) => {
    const portion =
      trade.tradeType === TradeType.EXACT_INPUT
        ? inputAmount.divide(trade.inputAmount)
        : outputAmount.divide(trade.outputAmount);
    const percent = new Percent(portion.numerator, portion.denominator);
    const path: RoutingDiagramEntry['path'] = [];
    for (let i = 0; i < pools.length; i++) {
      const nextPool = pools[i];
      const tokenIn = tokenPath[i];
      const tokenOut = tokenPath[i + 1];
      const fee = nextPool instanceof Pair ? FeeAmount.MEDIUM : nextPool.fee;
      const entry: RoutingDiagramEntry['path'][0] = [
        unwrappedToken(tokenIn),
        unwrappedToken(tokenOut),
        fee,
        nextPool instanceof Pair
          ? nextPool.liquidityToken.address.toLowerCase()
          : PoolCache.getPoolAddress(tokenIn, tokenOut, fee, chainId)?.toLowerCase() || '',
      ];
      path.push(entry);
    }
    return {
      percent,
      path,
      protocol,
    };
  });
}
