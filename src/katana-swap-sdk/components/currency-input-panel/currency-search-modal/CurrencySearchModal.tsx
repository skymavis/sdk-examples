import Typography from '@components/typography/Typography';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { Currency } from '@uniswap/sdk-core';
import React from 'react';

import CurrencyList, { ICurrencyOptionList } from '../currency-list/CurrencyList';

import Class from './CurrencySearchModal.module.scss';

interface CurrencySearchModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect?: (currency: Currency) => void;
  srcId?: string;
  currencyOptionList: ICurrencyOptionList[] | undefined;
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
}: CurrencySearchModalProps) {
  const handleCurrencySelect = (currency: Currency) => {
    if (onCurrencySelect && typeof onCurrencySelect === 'function') {
      onDismiss();
      onCurrencySelect?.(currency);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onDismiss} size="lg" className={Class.Container} scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <Typography size="large">Select a token</Typography>
        </ModalHeader>
        <ModalBody className={Class.DialogBody}>
          <CurrencyList
            srcId={srcId}
            onCurrencySelect={handleCurrencySelect}
            selectedCurrency={selectedCurrency}
            currencyOptionList={currencyOptionList}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
