import { Currency } from '@uniswap/sdk-core';
import { useCallback } from 'react';
import { Field } from 'src/katana-swap-sdk/constants/enum';

import { useSwapStore } from './useSwapStore';

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void;
  onSwitchTokens: () => void;
  onUserInput: (field: Field, typedValue: string) => void;
} {
  const { selectCurrency, switchCurrencies, setTypingInput, INPUT, OUTPUT } = useSwapStore();

  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      const currencyId = currency.isToken ? currency.address : currency.isNative ? 'RON' : '';

      selectCurrency({
        field,
        currencyId: currencyId,
      });
    },
    [INPUT, OUTPUT, selectCurrency],
  );

  const onSwitchTokens = useCallback(() => {
    switchCurrencies();
  }, [INPUT, OUTPUT, switchCurrencies]);

  const onUserInput = useCallback(
    (field: Field, value: string) => {
      setTypingInput({ field, typingValue: value });
    },
    [setTypingInput],
  );

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
  };
}
