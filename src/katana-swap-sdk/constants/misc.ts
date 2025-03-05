import { ChainId, DEFAULT_ERC20, RON } from '@sky-mavis/katana-core';
import { CurrencyAmount, Percent, Token } from '@uniswap/sdk-core';
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
export const REFETCHING_QUOTE_INTERVAL_MS = 10000;

export const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1);
export const AVERAGE_RONIN_L1_BLOCK_TIME = 3000; // 3 seconds

export const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.';

// This is excluded from `RouterPreference` enum because it's only used
// internally for token -> USDC trades to get a USD value.
export const INTERNAL_ROUTER_PREFERENCE_PRICE = 'price' as const;

export const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000);
// NOTE: This limit will make sure routing-api algorithm (split amount for case 5%) work correctly.
export const SLP_MIN_INPUT_AMOUNT = 20;

// Stablecoin amounts used when calculating spot price for a given currency.
// The amount is large enough to filter low liquidity pairs.
const STABLECOIN_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.mainnet]: CurrencyAmount.fromRawAmount(
    DEFAULT_ERC20[ChainId.mainnet as keyof typeof DEFAULT_ERC20].USDC,
    1e10,
  ),
  [ChainId.testnet]: CurrencyAmount.fromRawAmount(
    DEFAULT_ERC20[ChainId.mainnet as keyof typeof DEFAULT_ERC20].USDC,
    1e10,
  ),
};

// RON amounts used when calculating spot price for a given currency.
// The amount is large enough to filter low liquidity pairs.
const RON_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<RON> } = {
  [ChainId.mainnet]: CurrencyAmount.fromRawAmount(RON.onChain(ChainId.mainnet), 3e21),
  [ChainId.testnet]: CurrencyAmount.fromRawAmount(RON.onChain(ChainId.testnet), 6e20),
};

const PYTH_RON_ID: { [chainId: number]: string } = {
  [ChainId.mainnet]: '0x97cfe19da9153ef7d647b011c5e355142280ddb16004378573e6494e499879f3',
  [ChainId.testnet]: '0x4cb9d530b042004b042e165ee0904b12fe534d40dac5fe1c71dfcdb522e6e3c2',
};

export { PYTH_RON_ID, RON_AMOUNT_OUT, STABLECOIN_AMOUNT_OUT };
