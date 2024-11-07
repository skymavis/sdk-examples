import { Percent } from '@uniswap/sdk-core';
import { BigNumber } from 'ethers';
import JSBI from 'jsbi';

// 30 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 30;

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7);

export const BIG_INT_ZERO = JSBI.BigInt(0);

export const BIPS_BASE = 10_000;

// one basis JSBI.BigInt
export const ONE_BIPS = new Percent(JSBI.BigInt(1), BIPS_BASE);

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(1, 100); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(3, 100); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(5, 100); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(10, 100); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(15, 100); // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000));

export const ZERO_PERCENT = new Percent('0');
export const ONE_HUNDRED_PERCENT = new Percent('1');

export const ZERO = JSBI.BigInt(0);
export const ONE = JSBI.BigInt(1);
export const FIVE = JSBI.BigInt(5);
export const _997 = JSBI.BigInt(997);
export const _1000 = JSBI.BigInt(1000);
export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000);

export const SECONDS_PER_DAY = 86400;

export const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1);
export const AVERAGE_RONIN_L1_BLOCK_TIME = 3000; // 3 seconds

export const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.';
