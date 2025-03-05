import EmptyState from '@components/empty-state/EmptyState';
import Typography from '@components/typography/Typography';
import WillRender from '@components/will-render/WillRender';
import { Chip, CircularProgress } from '@nextui-org/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Currency, CurrencyAmount } from '@uniswap/sdk-core';
import classNames from 'classnames';
import React, { FC, memo } from 'react';
import { useGetWalletConnectData } from 'src/katana-swap-sdk/hooks/useGetWalletConnectData';
import { formatNumber } from 'src/katana-swap-sdk/utils/formatNumber';

import CurrencyLogo, { toValidLogoAddress } from '../../currency-logo/CurrencyLogo';

import Class from './CurrencyList.module.scss';

export interface ICurrencyOptionList {
  currency: Currency | null;
  balance?: CurrencyAmount<Currency> | undefined;
}

interface ICurrencyList {
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  srcId?: string;
  currencyOptionList: ICurrencyOptionList[] | undefined;
  isFetchingBalance?: boolean;
}

interface ICurrencyRow {
  currency: Currency;
  onSelect: () => void;
  isSelected: boolean;
  srcId?: string;
  balance: CurrencyAmount<Currency> | undefined;
  isFetchingBalance?: boolean;
}

function Balance({ balance }: { balance: CurrencyAmount<Currency> }) {
  return (
    <Typography size="small" color="gray" className={Class.Balance}>
      {formatNumber(balance.toExact())}
    </Typography>
  );
}

const CurrencyRowLabel: FC<{ currency: Currency }> = memo(({ currency }) => {
  return (
    <div className={Class.RowLabel}>
      <Typography size="small" className={Class.CurrencySymbol}>
        {currency.symbol}
      </Typography>
      <Typography size="small" color="gray" className={Class.RowCurrencyName}>
        {currency.name}
      </Typography>
    </div>
  );
});
CurrencyRowLabel.displayName = 'CurrencyRowLabel';

const CurrencyRow: FC<ICurrencyRow> = ({ currency, onSelect, isSelected, balance, isFetchingBalance }) => {
  const { connectedAccount } = useGetWalletConnectData();

  return (
    <div
      className={classNames(Class.RowItemWrapper, {
        [Class.RowItemActive]: isSelected,
        [Class.RowItemDisabled]: currency.name === 'Coming soon',
      })}
      onClick={() => (isSelected ? null : onSelect())}
    >
      <div className={Class.RowItem} onClick={() => (isSelected ? null : onSelect())}>
        <CurrencyLogo address={toValidLogoAddress(currency)} size={28} forceShowNativeRonLogo={currency.isNative} />
        <CurrencyRowLabel currency={currency} />

        <div className={Class.BalanceContainer}>
          {currency.name === 'Coming soon' ? (
            <Chip>{currency.name}</Chip>
          ) : balance ? (
            <Balance balance={balance} />
          ) : connectedAccount && isFetchingBalance ? (
            <CircularProgress size="sm" className={Class.Loader} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

const CurrencyList: FC<ICurrencyList> = ({
  selectedCurrency,
  onCurrencySelect,
  srcId,
  currencyOptionList,
  isFetchingBalance,
}) => {
  const isEmpty = !currencyOptionList || currencyOptionList?.length === 0;

  const parentRef = React.useRef(null);
  const rowVirtualizer = useVirtualizer({
    enabled: !isEmpty,
    count: currencyOptionList?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 3,
  });

  return (
    <div className={Class.CurrencyList} ref={parentRef}>
      <WillRender when={isEmpty}>
        <EmptyState text={'No token found'} />
      </WillRender>
      <WillRender when={!isEmpty}>
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const { currency, balance } = currencyOptionList?.[virtualRow.index] ?? {};
            if (!currency) return null;

            const isSelected = Boolean(currency && selectedCurrency && selectedCurrency.equals(currency));

            return (
              <div
                key={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <CurrencyRow
                  srcId={srcId}
                  currency={currency}
                  isSelected={isSelected}
                  onSelect={() => onCurrencySelect(currency)}
                  balance={balance}
                  isFetchingBalance={isFetchingBalance}
                />
              </div>
            );
          })}
        </div>
      </WillRender>
    </div>
  );
};

export default CurrencyList;
