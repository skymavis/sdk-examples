import { ChainId, computePoolAddress, V3_CORE_FACTORY_ADDRESSES } from '@sky-mavis/katana-core';
import { BigintIsh, Token } from '@uniswap/sdk-core';
import { FeeAmount, Pool } from '@uniswap/v3-sdk';
import JSBI from 'jsbi';

// Classes are expensive to instantiate, so this caches the recently instantiated pools.
// This avoids re-instantiating pools as the other pools in the same request are loaded.
export class PoolCache {
  // Evict after 128 entries. Empirically, a swap uses 64 entries.
  private static MAX_ENTRIES = 128;

  // These are FIFOs, using unshift/pop. This makes recent entries faster to find.
  private static pools: Pool[] = [];
  private static addresses: { key: string; address: string }[] = [];

  static getPoolAddress(tokenA: Token, tokenB: Token, fee: FeeAmount, chainId?: ChainId): string {
    if (this.addresses.length > this.MAX_ENTRIES) {
      this.addresses = this.addresses.slice(0, this.MAX_ENTRIES / 2);
    }

    const factoryAddress = V3_CORE_FACTORY_ADDRESSES[chainId ?? ChainId.mainnet];

    const { address: addressA } = tokenA;
    const { address: addressB } = tokenB;
    const key = `${factoryAddress}:${addressA}:${addressB}:${fee.toString()}`;
    const found = this.addresses.find(address => address.key === key);
    if (found) {
      return found.address;
    }

    const address = {
      key,
      address: computePoolAddress({
        tokenA,
        tokenB,
        fee,
        chainId: chainId ?? ChainId.mainnet,
      }),
    };

    this.addresses.unshift(address);
    return address.address;
  }

  static getPool(
    tokenA: Token,
    tokenB: Token,
    fee: FeeAmount,
    sqrtPriceX96: BigintIsh,
    liquidity: BigintIsh,
    tick: number,
  ): Pool {
    if (this.pools.length > this.MAX_ENTRIES) {
      this.pools = this.pools.slice(0, this.MAX_ENTRIES / 2);
    }

    const found = this.pools.find(
      pool =>
        pool.token0.equals(tokenA) &&
        pool.token1.equals(tokenB) &&
        pool.fee === fee &&
        JSBI.EQ(pool.sqrtRatioX96, sqrtPriceX96) &&
        JSBI.EQ(pool.liquidity, liquidity) &&
        pool.tickCurrent === tick,
    );
    if (found) {
      return found;
    }

    const pool = new Pool(tokenA, tokenB, fee, sqrtPriceX96, liquidity, tick);
    this.pools.unshift(pool);
    return pool;
  }
}
