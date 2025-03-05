import Button from '@components/button/Button';
import Typography from '@components/typography/Typography';
import { useDisclosure } from '@nextui-org/react';
import { unwrapRon, wrapRon } from '@sky-mavis/katana-swap';
import React, { FC } from 'react';
import { Field, ReactQueryKey, WrapType } from 'src/katana-swap-sdk/constants/enum';
import { useSwapContext } from 'src/katana-swap-sdk/context/SwapContext';
import { useGetWalletConnectData } from 'src/katana-swap-sdk/hooks/useGetWalletConnectData';
import { useUpdateQueryKeys } from 'src/katana-swap-sdk/hooks/useUpdateQueryKeys';
import { getWrapType } from 'src/katana-swap-sdk/utils/getWrapType';

import TxStatusModal, { TxStatusError } from '../../tx-status-modal/TxStatusModal';

const WrapBtn: FC = () => {
  const { chainId, wallet } = useGetWalletConnectData();
  const {
    derivedSwapInfo: { currencies, currencyBalances },
    computedSwapInfo: { parsedAmounts },
  } = useSwapContext();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [txStatus, setTxStatus] = React.useState<{ hash?: string; error?: TxStatusError }>({
    hash: undefined,
    error: undefined,
  });

  const updateQueryKeys = useUpdateQueryKeys([ReactQueryKey.USER_TOKEN_BALANCES, ReactQueryKey.RON_BALANCE]);

  const amount = parsedAmounts[Field.INPUT];
  const hasInputAmount = Boolean(amount?.greaterThan('0'));
  const sufficientBalance = amount && currencyBalances[Field.INPUT] && !currencyBalances[Field.INPUT].lessThan(amount);
  const isWrap = getWrapType(currencies[Field.INPUT], currencies[Field.OUTPUT]) === WrapType.WRAP;

  const inputError = sufficientBalance
    ? undefined
    : hasInputAmount
    ? `Insufficient ${isWrap ? 'RON' : 'WRON'} balance`
    : `Enter ${isWrap ? 'RON' : 'WRON'} amount`;

  const handleWrap = async () => {
    if (!sufficientBalance || !amount || !wallet) return;
    try {
      const txResponse = await wrapRon({ amount: amount.toExact(), chainId, wallet });
      const txReceipt = await txResponse.wait();

      if (txReceipt.status === 1) {
        setTxStatus({ hash: txReceipt.transactionHash });
        onOpen();
        updateQueryKeys();
        return;
      }

      setTxStatus({ hash: txReceipt.transactionHash, error: { title: 'Swap Failed', message: 'Transaction failed' } });
    } catch (error: any) {
      console.error('Could not deposit', error);
      // if the user rejected the tx, pass this along
      const newError = {
        title: 'Swap Failed',
        message: error?.code === 4001 ? 'Transaction rejected' : error?.message,
      };
      setTxStatus({ error: newError });
    }
  };

  const handleUnWrap = async () => {
    if (!sufficientBalance || !amount || !wallet) return;
    try {
      const txResponse = await unwrapRon({ amount: amount.toExact(), chainId, wallet });
      const txReceipt = await txResponse.wait();

      if (txReceipt.status === 1) {
        setTxStatus({ hash: txReceipt.transactionHash });
        onOpen();
        updateQueryKeys();
        return;
      }

      setTxStatus({ hash: txReceipt.transactionHash, error: { title: 'Swap Failed', message: 'Transaction failed' } });
    } catch (error: Error | any) {
      console.error('Could not deposit', error);
      // if the user rejected the tx, pass this along
      const newError = {
        title: 'Swap Failed',
        message: error?.code === 4001 ? 'Transaction rejected' : error?.message,
      };
      setTxStatus({ error: newError });
    }
  };

  return (
    <>
      <Button
        fullWidth
        isDisabled={!!inputError}
        color={!!inputError ? 'default' : 'primary'}
        onClick={isWrap ? handleWrap : handleUnWrap}
        size="lg"
      >
        <Typography size="small">{inputError ?? 'Swap'}</Typography>
      </Button>
      <TxStatusModal label="Swap" isOpen={isOpen} onClose={onClose} {...txStatus} />
    </>
  );
};

export default WrapBtn;
