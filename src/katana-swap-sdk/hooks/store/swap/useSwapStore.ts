import { Field } from 'src/katana-swap-sdk/constants/enum';
import create from 'zustand';

interface ISwapStore {
  readonly independentField: Field;
  readonly typingValue: string;
  readonly typedValue: string;
  readonly [Field.INPUT]: string | undefined;
  readonly [Field.OUTPUT]: string | undefined;

  selectCurrency: (props: { field: Field; currencyId: string }) => void;

  replaceSwapState: (props: {
    field: Field;
    typedValue: string;
    inputCurrencyId?: string;
    outputCurrencyId?: string;
  }) => void;

  switchCurrencies: () => void;

  setTypingInput: (props: { field: Field; typingValue: string }) => void;
  setTypedInput: (props: { field: Field; typedValue: string }) => void;

  resetSwapState: () => void;
}

interface ISwapState {
  readonly independentField: Field;
  readonly typingValue: string;
  readonly typedValue: string;
  readonly [Field.INPUT]: string | undefined;
  readonly [Field.OUTPUT]: string | undefined;
}

const initialSwapState: ISwapState = {
  independentField: Field.INPUT,
  typingValue: '',
  typedValue: '',
  [Field.INPUT]: 'RON',
  [Field.OUTPUT]: '',
};

export const useSwapStore = create<ISwapStore>(set => ({
  ...initialSwapState,

  selectCurrency: ({ field, currencyId }) => {
    const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;
    set(state => {
      if (state[otherField] && state[otherField] === currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: currencyId,
          [otherField]: state[field],
        };
      } else {
        // the normal case
        return {
          ...state,
          [field]: currencyId,
        };
      }
    });
  },

  replaceSwapState: ({ field, typedValue, inputCurrencyId, outputCurrencyId }) => {
    set(() => {
      return {
        [Field.INPUT]: inputCurrencyId,
        [Field.OUTPUT]: outputCurrencyId,
        independentField: field,
        typedValue: typedValue,
      };
    });
  },

  switchCurrencies: () => {
    set(state => {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: state[Field.OUTPUT],
        [Field.OUTPUT]: state[Field.INPUT],
      };
    });
  },

  setTypingInput: ({ field, typingValue }) => {
    set(() => {
      return {
        independentField: field,
        typingValue,
      };
    });
  },

  setTypedInput: ({ field, typedValue }) => {
    set(() => {
      return {
        independentField: field,
        typedValue,
      };
    });
  },

  resetSwapState() {
    set(() => {
      return {
        ...initialSwapState,
      };
    });
  },
}));
