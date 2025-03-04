import Typography from '@components/typography/Typography';
import { Input, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { Currency } from '@uniswap/sdk-core';
import React, { useMemo, useState } from 'react';

import CurrencyList, { ICurrencyOptionList } from '../currency-list/CurrencyList';

import Class from './CurrencySearchModal.module.scss';

interface CurrencySearchModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect?: (currency: Currency) => void;
  srcId?: string;
  currencyOptionList: ICurrencyOptionList[] | undefined;
  isFetchingBalance?: boolean;
}

export enum CurrencyModalView {
  search,
  manage,
  importToken,
  importList,
}

export default function CurrencySearchModal({
  isOpen,
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  srcId,
  currencyOptionList,
  isFetchingBalance = false,
}: CurrencySearchModalProps) {
  const [inputValue, setInputValue] = useState('');

  const filteredCurrencyOptionList = useMemo(() => {
    if (!currencyOptionList) {
      return undefined;
    }

    if (!inputValue || !currencyOptionList) {
      return currencyOptionList;
    }

    return currencyOptionList.filter(
      ({ currency }) =>
        currency?.symbol?.toLowerCase().includes(inputValue.toLowerCase().trim()) ||
        currency?.name?.toLowerCase().includes(inputValue.toLowerCase().trim()),
    );
  }, [inputValue, currencyOptionList]);

  const handleCurrencySelect = (currency: Currency) => {
    if (onCurrencySelect && typeof onCurrencySelect === 'function') {
      onDismiss();
      onCurrencySelect?.(currency);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onDismiss}
      size="lg"
      className={Class.Container}
      scrollBehavior="inside"
      placement="top"
    >
      <ModalContent>
        <ModalHeader className={Class.DialogHeader}>
          <Typography size="large">Select a token</Typography>
          <Input
            placeholder="Search token name/symbol"
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value);
            }}
            size="lg"
          />
        </ModalHeader>
        <ModalBody className={Class.DialogBody}>
          <CurrencyList
            srcId={srcId}
            onCurrencySelect={handleCurrencySelect}
            selectedCurrency={selectedCurrency}
            currencyOptionList={filteredCurrencyOptionList}
            isFetchingBalance={isFetchingBalance}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
