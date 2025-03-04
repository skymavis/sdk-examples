import { Link } from '@nextui-org/react';
import { Currency, Price, Token } from '@uniswap/sdk-core';
import classNames from 'classnames';
import { useCallback, useState } from 'react';

import Class from './TradePrice.module.scss';

interface ITradePriceProps {
  price: Price<Currency, Currency> | Price<Token, Token> | undefined;
  sendAnalyticsEvent?: () => void;
}

export default function TradePrice({ price, sendAnalyticsEvent }: ITradePriceProps) {
  const [showInverted, setShowInverted] = useState(false);

  let formattedPrice: string;
  try {
    formattedPrice = showInverted ? price?.invert()?.toFixed(4) ?? '0' : price?.toFixed(4) ?? '0';
  } catch (error) {
    formattedPrice = '0';
  }

  let baseCurrencySymbol = price?.baseCurrency?.symbol ?? '--';
  let quoteCurrencySymbol = price?.quoteCurrency?.symbol ?? '--';

  if (baseCurrencySymbol === 'WRON') baseCurrencySymbol = 'RON';
  if (quoteCurrencySymbol === 'WRON') quoteCurrencySymbol = 'RON';

  const label = showInverted ? `${baseCurrencySymbol}` : `${quoteCurrencySymbol} `;
  const labelInverted = showInverted ? `${quoteCurrencySymbol} ` : `${baseCurrencySymbol}`;
  const flipPrice = useCallback(() => {
    sendAnalyticsEvent?.();
    setShowInverted(!showInverted);
  }, [setShowInverted, showInverted, sendAnalyticsEvent]);

  const text = `${'1 ' + labelInverted + ' = ' + formattedPrice} ${label}`;

  return (
    <Link className={classNames(Class.Container, Class.TradePrice)} onClick={flipPrice} underline="hover">
      {text}
    </Link>
  );
}
