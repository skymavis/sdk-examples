import cl from 'classnames';
import React, { forwardRef } from 'react';

import Class from './index.module.scss';

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

interface IInputProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as' | 'size' | 'defaultValue'> {
  value: string | number;
  fontSize?: string;
  align?: 'right' | 'left';
  prependSymbol?: string | undefined;
  onUserInput?: (input: string) => void;

  loading?: boolean;
  error?: boolean;
  maxDecimals?: number;
}

const Input = forwardRef<HTMLInputElement, IInputProps>(
  (
    {
      value,
      placeholder,
      prependSymbol,
      onUserInput,
      maxDecimals,
      className,
      loading = false,
      error = false,
      ...rest
    }: IInputProps,
    ref,
  ) => {
    const enforcer = (nextUserInput: string) => {
      if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
        const decimalGroups = nextUserInput.split('.');
        if (maxDecimals && decimalGroups.length > 1 && decimalGroups[1].length > maxDecimals) {
          return;
        }

        onUserInput?.(nextUserInput);
      }
    };

    return (
      <input
        {...rest}
        ref={ref}
        className={cl(Class.Input, className, {
          ['disabled']: rest.disabled,
          ['loading']: loading,
          ['error']: error,
        })}
        value={prependSymbol && value ? prependSymbol + value : value}
        onChange={event => {
          if (prependSymbol) {
            const value = event.target.value;

            // cut off prepended symbol
            const formattedValue = value.toString().includes(prependSymbol)
              ? value.toString().slice(prependSymbol.length, value.toString().length + 1)
              : value;

            // replace commas with periods, because katana exclusively uses period as the decimal separator
            enforcer(formattedValue.replace(/,/g, '.'));
          } else {
            enforcer(event.target.value.replace(/,/g, '.'));
          }
        }}
        // universal input options
        inputMode="decimal"
        autoComplete="off"
        autoCorrect="off"
        // text-specific options
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        placeholder={placeholder || '0'}
        minLength={1}
        maxLength={79}
        spellCheck="false"
      />
    );
  },
);

Input.displayName = 'Input';

const MemoizedInput = React.memo(Input);
export { MemoizedInput as Input };
