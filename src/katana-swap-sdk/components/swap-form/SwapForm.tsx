import { Button } from '@nextui-org/react';
import { Currency, CurrencyAmount } from '@uniswap/sdk-core';
import { FC } from 'react';
import ArrowOppositeVerticalIcon from 'src/icons/ArrowOppositeVerticalIcon';
import { Field } from 'src/katana-swap-sdk/constants/enum';
import { useSwapActionHandlers } from 'src/katana-swap-sdk/hooks/store/swap/useSwapActionHandler';
import { useSwapStore } from 'src/katana-swap-sdk/hooks/store/swap/useSwapStore';
import { useCurrencyOptionsForSwap } from 'src/katana-swap-sdk/hooks/useCurrencyOptionsForSwap';
import useCustomLodashDebounce from 'src/katana-swap-sdk/hooks/useCustomLodashDebounce';
import { useDerivedSwapInfo } from 'src/katana-swap-sdk/hooks/useDerivedSwapInfo';
import { maxAmountSpend } from 'src/katana-swap-sdk/utils/maxAmountSpend';

import CurrencyInputPanel from '../currency-input-panel/CurrencyInputPanel';

import styles from './SwapForm.module.scss';

const DEBOUNCE_TIME_MILLISECONDS = 300;

const SwapForm: FC = () => {
  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers();
  const { independentField, setTypedInput, typingValue } = useSwapStore();
  const { parsedAmounts, currencies, currencyBalances } = useDerivedSwapInfo();
  const currencyOptions = useCurrencyOptionsForSwap();

  const showWrap = false;
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const formattedAmounts = {
    [independentField]: typingValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  };

  const maxInputAmount: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT]);
  const showMaxButton = Boolean(maxInputAmount?.greaterThan(0) && !parsedAmounts[Field.INPUT]?.equalTo(maxInputAmount));

  const handleMaxInput = () => {
    if (!maxInputAmount) {
      return;
    }
    onUserInput(Field.INPUT, maxInputAmount.toExact());
    setTypedInput({ field: Field.INPUT, typedValue: maxInputAmount.toExact() });
  };

  const handleDebounceUserInput = useCustomLodashDebounce((field: Field, value: string) => {
    setTypedInput({ field, typedValue: value });
  }, DEBOUNCE_TIME_MILLISECONDS);

  return (
    <div className={styles.container}>
      <div className={styles['currency-input-section']}>
        <CurrencyInputPanel
          id={'currency-input'}
          label={'Sell'}
          showMaxButton={showMaxButton}
          onMax={handleMaxInput}
          currency={currencies[Field.INPUT]}
          // fiatValue={showFiatValueInput ? fiatValueInput?.data : undefined}
          onCurrencySelect={inputCurrency => {
            onCurrencySelection(Field.INPUT, inputCurrency);
          }}
          value={formattedAmounts[Field.INPUT]}
          onUserInput={value => {
            onUserInput(Field.INPUT, value);
            handleDebounceUserInput(Field.INPUT, value);
          }}
          balance={currencyBalances[Field.INPUT]}
          currencyOptionList={currencyOptions}
        />

        <Button
          isIconOnly
          onClick={() => {
            onSwitchTokens();
          }}
          className={styles.SwitchBtn}
          variant="bordered"
        >
          <ArrowOppositeVerticalIcon size={24} />
        </Button>

        <CurrencyInputPanel
          id={'currency-output'}
          label={'Buy'}
          value={formattedAmounts[Field.OUTPUT]}
          onUserInput={value => {
            onUserInput(Field.OUTPUT, value);
            handleDebounceUserInput(Field.OUTPUT, value);
          }}
          showMaxButton={false}
          balance={currencyBalances[Field.OUTPUT]}
          // fiatValue={showFiatValueOutput ? fiatValueOutput?.data : undefined}
          // priceImpact={stablecoinPriceImpact}
          currency={currencies[Field.OUTPUT]}
          onCurrencySelect={outputCurrency => {
            onCurrencySelection(Field.OUTPUT, outputCurrency);
          }}
          currencyOptionList={currencyOptions}
        />
      </div>
    </div>
  );
};

export default SwapForm;
