import Typography from '@components/typography/Typography';
import { Chip, CircularProgress } from '@nextui-org/react';
import { Currency, CurrencyAmount } from '@uniswap/sdk-core';
import classNames from 'classnames';
import { FC, memo } from 'react';
import { useGetWalletConnectData } from 'src/katana-swap-sdk/hooks/useGetWalletConnectData';
import { formatNumber } from 'src/katana-swap-sdk/utils/formatNumber';

import CurrencyLogo, { toValidLogoAddress } from '../../currency-logo/CurrencyLogo';

import Class from './CurrencyList.module.scss';

export interface ICurrencyOptionList {
  currency: Currency | null;
  balance: CurrencyAmount<Currency> | undefined;
}

interface ICurrencyList {
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  srcId?: string;
  currencyOptionList: ICurrencyOptionList[] | undefined;
}

interface ICurrencyRow {
  currency: Currency;
  onSelect: () => void;
  isSelected: boolean;
  srcId?: string;
  balance: CurrencyAmount<Currency> | undefined;
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

const CurrencyRow: FC<ICurrencyRow> = ({ currency, onSelect, isSelected, balance }) => {
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
          ) : connectedAccount ? (
            <CircularProgress size="sm" className={Class.Loader} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

const CurrencyList: FC<ICurrencyList> = ({ selectedCurrency, onCurrencySelect, srcId, currencyOptionList }) => {
  return (
    <div className={Class.CurrencyList}>
      {currencyOptionList?.map(({ currency, balance }, index) => {
        const isSelected = Boolean(currency && selectedCurrency && selectedCurrency.equals(currency));
        const handleSelect = () => currency && onCurrencySelect(currency);

        if (currency) {
          return (
            <CurrencyRow
              key={`Currency-row-${index}`}
              srcId={srcId}
              currency={currency}
              isSelected={isSelected}
              onSelect={handleSelect}
              balance={balance}
            />
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default CurrencyList;
