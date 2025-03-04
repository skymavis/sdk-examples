import { DEFAULT_ERC20 } from '@sky-mavis/katana-core';
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { ReactNode, useMemo } from 'react';
import { Field } from 'src/katana-swap-sdk/constants/enum';
import { SLP_MIN_INPUT_AMOUNT } from 'src/katana-swap-sdk/constants/misc';
import { IRoutingAPIResponse } from 'src/katana-swap-sdk/hooks/routing-api/useRoutingAPITrade';
import { useSwapStore } from 'src/katana-swap-sdk/hooks/store/swap/useSwapStore';
import { useCurrency } from 'src/katana-swap-sdk/hooks/useCurrency';
import { useCurrencyBalances } from 'src/katana-swap-sdk/hooks/useCurrencyBalances';
import { useDebouncedTrade } from 'src/katana-swap-sdk/hooks/useDebouncedTrade';
import { useGetWalletConnectData } from 'src/katana-swap-sdk/hooks/useGetWalletConnectData';
import tryParseCurrencyAmount from 'src/katana-swap-sdk/utils/tryParseCurrencyAmount';

const useParsedCurrencies = () => {
  const { chainId, connectedAccount } = useGetWalletConnectData();

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
  const { chainId } = useGetWalletConnectData();

  const { independentField, typedValue } = useSwapStore();

  const { currencies, currencyBalances } = useParsedCurrencies();

  const isExactIn: boolean = useMemo(() => independentField === Field.INPUT, [independentField]);
  const parsedCurrency = useMemo(
    () => (isExactIn ? currencies[Field.INPUT] : currencies[Field.OUTPUT]),
    [currencies, isExactIn],
  );
  const isExactOutSLPErrorInput = useMemo(
    () =>
      Boolean(
        !isExactIn &&
          !!parsedCurrency &&
          parsedCurrency.equals(DEFAULT_ERC20[chainId as keyof typeof DEFAULT_ERC20].SLP) &&
          !!typedValue &&
          parseFloat(typedValue) < SLP_MIN_INPUT_AMOUNT,
      ),
    [chainId, isExactIn, parsedCurrency, typedValue],
  );

  const parsedAmount = useMemo(
    () => tryParseCurrencyAmount(isExactOutSLPErrorInput ? undefined : typedValue, parsedCurrency),
    [isExactOutSLPErrorInput, typedValue, parsedCurrency],
  );

  return { parsedAmount, currencies, currencyBalances, isExactOutSLPErrorInput };
};

export type SwapInfo = {
  parsedAmount?: CurrencyAmount<Currency>;
  bestTrade: IRoutingAPIResponse;
  currencies: { [field in Field]?: Currency };
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> };

  isExactOutSLPErrorInput: boolean;
  showWrap?: boolean;
  inputError?: ReactNode;
};

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(): SwapInfo {
  const { independentField } = useSwapStore();

  const isExactIn: boolean = independentField === Field.INPUT;

  const { currencies, currencyBalances, parsedAmount, isExactOutSLPErrorInput } = usePrepareDataForSwap();

  const bestTrade = useDebouncedTrade({
    tradeType: isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    amountSpecified: parsedAmount,
    otherCurrency: (isExactIn ? currencies[Field.OUTPUT] : currencies[Field.INPUT]) ?? undefined,
  });

  const isWrap = Boolean(
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      currencies[Field.INPUT]?.isNative &&
      DEFAULT_ERC20[currencies[Field.OUTPUT].chainId as keyof typeof DEFAULT_ERC20].WRON.equals(
        currencies[Field.OUTPUT],
      ),
  );
  const isUnWrap = Boolean(
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      DEFAULT_ERC20[currencies[Field.INPUT].chainId as keyof typeof DEFAULT_ERC20].WRON.equals(
        currencies[Field.INPUT],
      ) &&
      currencies[Field.OUTPUT].isNative,
  );
  const showWrap: boolean = isWrap || isUnWrap;

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    isExactOutSLPErrorInput,
    bestTrade,
    showWrap,
  };
}
