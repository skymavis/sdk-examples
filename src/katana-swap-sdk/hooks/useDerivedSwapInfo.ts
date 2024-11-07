import { KatanaTrade } from '@sky-mavis/katana-swap';
import { Currency, CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core';
import { ReactNode, useMemo } from 'react';

import { Field, TradeState } from '../constants/enum';
import tryParseCurrencyAmount from '../utils/tryParseCurrencyAmount';
import { useSwapStore } from './store/swap/useSwapStore';
import { useCurrency } from './useCurrency';
import { useCurrencyBalances } from './useCurrencyBalances';
import { useDebouncedTrade } from './useDebouncedTrade';
import { useGetWalletConnectData } from './useGetWalletConnectData';
import useSwapSlippageTolerance from './useSwapSlippageTolerance';

const useParsedCurrencies = () => {
  const { connectedAccount, chainId } = useGetWalletConnectData();

  const { [Field.INPUT]: inputCurrencyId, [Field.OUTPUT]: outputCurrencyId } = useSwapStore();

  const inputCurrency = useCurrency(inputCurrencyId);
  const outputCurrency = useCurrency(outputCurrencyId);
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency,
      [Field.OUTPUT]: outputCurrency,
    }),
    [inputCurrency, outputCurrency],
  );

  const relevantTokenBalances = useCurrencyBalances(chainId, connectedAccount ?? undefined, [
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
  ]);

  const currencyBalances = useMemo(
    () => ({
      [Field.INPUT]: relevantTokenBalances[0],
      [Field.OUTPUT]: relevantTokenBalances[1],
    }),
    [relevantTokenBalances],
  );

  return { currencies, currencyBalances };
};

const usePrepareDataForSwap = () => {
  const { independentField, typedValue } = useSwapStore();

  const { currencies, currencyBalances } = useParsedCurrencies();

  const isExactIn: boolean = useMemo(() => independentField === Field.INPUT, [independentField]);
  const parsedCurrency = useMemo(
    () => (isExactIn ? currencies[Field.INPUT] : currencies[Field.OUTPUT]),
    [currencies, isExactIn],
  );

  const parsedAmount = useMemo(() => tryParseCurrencyAmount(typedValue, parsedCurrency), [typedValue, parsedCurrency]);

  return { parsedAmount, currencies, currencyBalances };
};

type ITradeSwapV3 = {
  trade?: KatanaTrade;
  state: TradeState;
  error?: any;
  swapQuoteLatency?: number;
};

type IFinalTrade = KatanaTrade | undefined;

type SwapInfo = {
  parsedAmounts: {
    [Field.INPUT]: CurrencyAmount<Currency> | undefined;
    [Field.OUTPUT]: CurrencyAmount<Currency> | undefined;
  };
  currencies: { [field in Field]?: Currency };
  currencyBalances: { [field in Field]: CurrencyAmount<Currency> | undefined };
  inputError?: ReactNode;

  tradeSwapV3: ITradeSwapV3;
  finalTrade: IFinalTrade;

  allowedSlippage: Percent;
};
// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(): SwapInfo {
  const { connectedAccount: account } = useGetWalletConnectData();
  const allowedSlippage = useSwapSlippageTolerance();
  const { independentField } = useSwapStore();

  const isExactIn: boolean = independentField === Field.INPUT;

  const { currencies, currencyBalances, parsedAmount } = usePrepareDataForSwap();

  const tradeSwapV3: {
    state: TradeState;
    trade?: KatanaTrade;
  } = useDebouncedTrade({
    tradeType: isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    amountSpecified: parsedAmount,
    otherCurrency: (isExactIn ? currencies[Field.OUTPUT] : currencies[Field.INPUT]) ?? undefined,
    account,
  });

  const finalTrade = tradeSwapV3?.trade;
  const showWrap = false;

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : finalTrade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : finalTrade?.outputAmount,
          },
    [independentField, finalTrade?.inputAmount, finalTrade?.outputAmount, parsedAmount],
  );

  return {
    currencies,
    currencyBalances,
    parsedAmounts,
    allowedSlippage,
    tradeSwapV3,
    finalTrade,
  };
}
