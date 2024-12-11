import { Input } from '@nextui-org/react';
import React, { FC, useEffect, useState } from 'react';

import { appConfigs } from '../../../common/constant';
import useConnectStore from '../../../stores/useConnectStore';
import ApproveToken from './approve-token/ApproveToken';
import InputAmount from './input-amount/InputAmount';
import SendToken from './send-token/SendToken';
import { IERC20TransactionData } from './types';

import styles from './ERC20.module.scss';

const ERC20: FC = () => {
  const { chainId } = useConnectStore();

  const [txData, setTxData] = useState<IERC20TransactionData>({
    recipient: appConfigs.recipient,
    tokenAddress: chainId ? appConfigs.erc20[chainId] : '',
    amount: appConfigs.amount,
    tokenDecimal: '18',
  });

  useEffect(() => {
    if (chainId && appConfigs.erc20[chainId]) {
      setTxData(prv => ({ ...prv, tokenAddress: appConfigs.erc20[chainId], amount: prv.amount || appConfigs.amount }));
    } else {
      setTxData(prv => ({
        ...prv,
        tokenAddress: '',
        amount: '',
        tokenDecimal: '18',
      }));
    }
  }, [chainId]);

  const handleDecimalChanged = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setTxData(prv => ({ ...prv, tokenDecimal: numericValue }));
  };

  const handleTokenAddressChanged = (value: string) => {
    setTxData(prv => ({ ...prv, tokenAddress: value }));
  };

  const handleAmountChanged = (value: string) => {
    setTxData(prv => ({ ...prv, amount: value }));
  };

  const handleRecipientChanged = (value: string) => {
    setTxData(prv => ({ ...prv, recipient: value }));
  };

  return (
    <div className={styles.erc20} key={chainId}>
      <Input
        value={txData.tokenAddress}
        onValueChange={handleTokenAddressChanged}
        label={'Token Address'}
        radius={'sm'}
      />
      <Input value={txData.tokenDecimal} onValueChange={handleDecimalChanged} type="number" label={'Token decimal'} />
      <InputAmount setAmount={handleAmountChanged} txData={txData} />
      <Input onValueChange={handleRecipientChanged} label={'Recipient'} value={txData.recipient} radius={'sm'} />

      <SendToken txData={txData} />
      <ApproveToken txData={txData} />
    </div>
  );
};

export default ERC20;
