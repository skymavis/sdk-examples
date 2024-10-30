import { Input } from '@nextui-org/react';
import React, { FC, useEffect, useState } from 'react';

import { appConfigs } from '../../../common/constant';
import useConnectStore from '../../../stores/useConnectStore';
import ApproveToken from './approve-token/ApproveToken';
import SendToken from './send-token/SendToken';

import styles from './ERC20.module.scss';

const ERC20: FC = () => {
  const { chainId } = useConnectStore();

  const [recipient, setRecipient] = React.useState(appConfigs.recipient);
  const [amount, setAmount] = React.useState(appConfigs.amount);
  const [tokenAddress, setTokenAddress] = useState(chainId ? appConfigs.erc20[chainId] : '');

  useEffect(() => {
    if (chainId && appConfigs.erc20[chainId]) {
      setTokenAddress(appConfigs.erc20[chainId]);
    } else {
      setTokenAddress('');
    }
  }, [chainId]);

  return (
    <div className={styles.erc20} key={chainId}>
      <Input onValueChange={setTokenAddress} label={'Token Address'} value={tokenAddress} radius={'sm'} />
      <Input onValueChange={setAmount} label={'Amount'} value={amount} radius={'sm'} />
      <Input onValueChange={setRecipient} label={'Recipient'} value={recipient} radius={'sm'} />

      <SendToken tokenAddress={tokenAddress} amount={amount} recipient={recipient} />

      <ApproveToken tokenAddress={tokenAddress} amount={amount} recipient={recipient} />
    </div>
  );
};

export default ERC20;
