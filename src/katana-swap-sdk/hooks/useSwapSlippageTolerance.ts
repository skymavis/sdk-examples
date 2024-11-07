import { Percent } from '@uniswap/sdk-core';

import { SWAP_DEFAULT_SLIPPAGE } from '../constants/slippage';
import { useUserSlippageToleranceWithDefault } from './store/user/useUserActionHandler';

export default function useSwapSlippageTolerance(): Percent {
  return useUserSlippageToleranceWithDefault(SWAP_DEFAULT_SLIPPAGE);
}
