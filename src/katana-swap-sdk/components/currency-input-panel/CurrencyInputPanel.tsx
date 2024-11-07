import Button from '@components/button/Button';
import Skeleton from '@components/skeleton/Skeleton';
import Typography from '@components/typography/Typography';
import { Link } from '@nextui-org/react';
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core';
import React, { forwardRef, ReactNode, useCallback, useState } from 'react';
import ArrowDownIcon from 'src/icons/ArrowDownIcon';
import { useGetWalletConnectData } from 'src/katana-swap-sdk/hooks/useGetWalletConnectData';
import { formatNumber } from 'src/katana-swap-sdk/utils/formatNumber';

import CurrencyLogo, { toValidLogoAddress } from '../currency-logo/CurrencyLogo';
import { Input } from '../input';
import { ICurrencyOptionList } from './currency-list/CurrencyList';
import CurrencySearchModal from './currency-search-modal/CurrencySearchModal';
import { FiatValue } from './fiat-value/FiatValue';

import Class from './CurrencyInputPanel.module.scss';

export interface CurrencyInputPanelProps {
  // numeric-input props
  value: string;
  onUserInput: (value: string) => void;
  hideInput?: boolean;
  disableInputWhenBalanceEqZero?: boolean;
  loading?: boolean;

  // Selected currency/pair props
  currency?: Currency | null;

  // balance of the currency selected props
  onMax?: () => void;
  showMaxButton?: boolean;
  balance?: CurrencyAmount<Currency>;
  hideBalance?: boolean;
  renderBalance?: (amount: CurrencyAmount<Currency> | undefined) => ReactNode;
  fiatValue?: string | number;

  // Price Impact from action prop
  priceImpact?: Percent;

  // Wrapper props
  id: string;
  label: string;

  // Dialog currency list props
  currencyOptionList?: ICurrencyOptionList[] | undefined;
  onCurrencySelect?: (currency: Currency) => void;
  disabled?: boolean;
  disabledInput?: boolean;
}

const CurrencyInputPanel = forwardRef<HTMLInputElement, CurrencyInputPanelProps>(
  (
    {
      value,
      onUserInput,
      onMax,
      showMaxButton,
      onCurrencySelect,
      loading = false,
      currency,
      id,
      renderBalance,
      fiatValue,
      hideInput = false,
      priceImpact,
      hideBalance = false,
      balance,
      disableInputWhenBalanceEqZero = false,
      label,
      currencyOptionList,
      disabled,
      disabledInput,
    },
    ref,
  ) => {
    const [modalOpen, setModalOpen] = useState(false);
    const { connectedAccount } = useGetWalletConnectData();

    const handleDismissSearch = useCallback(() => {
      setModalOpen(false);
    }, [setModalOpen]);

    return (
      <div id={id} className={Class.Container}>
        <Typography size="small" color="gray">
          {label}
        </Typography>
        <div className={Class.CurrencyInputSection}>
          {!currency && !onCurrencySelect ? (
            <Skeleton>
              <div className={Class.SkeletonButtonSelectToken} />
            </Skeleton>
          ) : (
            <Button
              intent={currency ? 'neutral' : 'primary'}
              onClick={() => {
                setModalOpen(true);
              }}
              disabled={!onCurrencySelect || disabled}
            >
              <div className={Class.CurrencySelectBtn}>
                {currency ? (
                  <CurrencyLogo
                    key={toValidLogoAddress(currency)}
                    address={toValidLogoAddress(currency)}
                    size={24}
                    forceShowNativeRonLogo={currency.isNative}
                  />
                ) : null}
                <Typography size="medium">
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                    : currency?.symbol) || (
                    <Typography size="small" className={Class.TextSelectToken}>
                      Select token
                    </Typography>
                  )}
                </Typography>

                {onCurrencySelect && <ArrowDownIcon size={20} />}
              </div>
            </Button>
          )}
          {!hideInput && (
            <Input
              id={id}
              ref={ref}
              value={value}
              disabled={(disableInputWhenBalanceEqZero && (!balance || balance?.equalTo(0))) || disabledInput}
              error={balance && Number(balance.toExact()) < Number(value)}
              onUserInput={val => {
                onUserInput(val);
              }}
              loading={loading}
              maxDecimals={currency?.decimals}
            />
          )}
        </div>
        {!hideInput && !hideBalance && currency && (
          <div className={Class.BalanceDisplayCurrencyInputPanel}>
            {connectedAccount && (
              <>
                <Typography size="small" color="gray" className={Class.Balance}>
                  {renderBalance ? (
                    renderBalance(balance)
                  ) : (
                    <>Balance: {balance === undefined ? '--' : formatNumber(balance?.toExact())}</>
                  )}
                </Typography>
                {showMaxButton && (
                  <Link onClick={onMax} size="sm" style={{ fontWeight: 500 }}>
                    Max
                  </Link>
                )}
              </>
            )}

            <div className={Class.FiatValueWrapper}>
              <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} />
            </div>
          </div>
        )}
        <CurrencySearchModal
          srcId={id}
          isOpen={modalOpen && !!currencyOptionList && currencyOptionList?.length > 0}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          currencyOptionList={currencyOptionList}
        />
      </div>
    );
  },
);

CurrencyInputPanel.displayName = 'CurrencyInputPanel';

const MemoizedCurrencyInputPanel = React.memo(CurrencyInputPanel);

export default MemoizedCurrencyInputPanel;
