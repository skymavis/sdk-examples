import { ChainId, DEFAULT_ERC20 } from '@sky-mavis/katana-core';
import { Currency } from '@uniswap/sdk-core';

import { WrapType } from '../constants/enum';

const getWrapType = (inputCurrency: Currency | undefined, outputCurrency: Currency | undefined): WrapType => {
  if (!inputCurrency || !outputCurrency) {
    return WrapType.NOT_APPLICABLE;
  }

  const WRON = DEFAULT_ERC20[inputCurrency.chainId as ChainId].WRON;

  if (inputCurrency.isNative && WRON.equals(outputCurrency)) {
    return WrapType.WRAP;
  }

  if (outputCurrency.isNative && WRON.equals(inputCurrency)) {
    return WrapType.UNWRAP;
  }

  return WrapType.NOT_APPLICABLE;
};

export { getWrapType };
