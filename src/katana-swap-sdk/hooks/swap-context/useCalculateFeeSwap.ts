import { KatanaTrade } from '@sky-mavis/katana-swap';
import { CurrencyAmount, Price } from '@uniswap/sdk-core';
import { useMemo } from 'react';
import { useUSDPrice } from 'src/katana-swap-sdk/hooks/usd-price/useUSDPrice';
import useSwapSlippageTolerance from 'src/katana-swap-sdk/hooks/useSwapSlippageTolerance';
import { computeRealizedLPFeeAmount } from 'src/katana-swap-sdk/utils/prices';

export const useCalculateFeeSwap = (trade?: KatanaTrade) => {
  const allowedSlippage = useSwapSlippageTolerance();

  const realizedLPFeeSwap = useMemo(() => {
    return computeRealizedLPFeeAmount(trade);
  }, [trade]);

  const developmentFeeSwap = useMemo(() => {
    if (!trade || !trade.outputAmount.currency || !trade.swapFee?.amount) return undefined;
    return CurrencyAmount.fromRawAmount(trade?.outputAmount.currency, trade.swapFee.amount);
  }, [trade]);

  const realizedLPFeeUSDSwap = useUSDPrice(realizedLPFeeSwap);
  const developmentFeeUSDSwap = useUSDPrice(developmentFeeSwap);
  const totalFeeSwap = useMemo(() => {
    return realizedLPFeeUSDSwap?.data && developmentFeeUSDSwap?.data
      ? realizedLPFeeUSDSwap.data + developmentFeeUSDSwap.data
      : realizedLPFeeUSDSwap?.data || developmentFeeUSDSwap?.data;
  }, [developmentFeeUSDSwap?.data, realizedLPFeeUSDSwap?.data]);

  const minimumAmountOut = useMemo(() => {
    if (!allowedSlippage || !trade) return undefined;
    return trade?.minimumAmountOut(allowedSlippage, trade?.postSwapFeeOutputAmount);
  }, [allowedSlippage, trade]);

  const maximumAmountIn = useMemo(() => {
    return trade?.maximumAmountIn(allowedSlippage);
  }, [allowedSlippage, trade]);

  const worstExecutionPrice = useMemo(() => {
    if (!trade || !maximumAmountIn || !minimumAmountOut) return undefined;
    return new Price(
      trade.inputAmount.currency,
      trade.outputAmount.currency,
      maximumAmountIn.quotient,
      minimumAmountOut.quotient,
    );
  }, [maximumAmountIn, minimumAmountOut, trade]);

  return {
    totalFeeSwap,
    minimumAmountOut,
    maximumAmountIn,
    worstExecutionPrice,
  };
};
