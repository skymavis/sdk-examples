import { Input } from '@nextui-org/react';
import React, { FC, useEffect, useState } from 'react';

import { appConfigs } from '../../../common/constant';
import useConnectStore from '../../../stores/useConnectStore';
import ApproveToken from './approve-token/ApproveToken';
import InputAmount from './input-amount/InputAmount';
import SendToken from './send-token/SendToken';

import styles from './ERC20.module.scss';

const ERC20: FC = () => {
  const { chainId } = useConnectStore();

  const [recipient, setRecipient] = React.useState(appConfigs.recipient);
  const [amount, setAmount] = React.useState(appConfigs.amount);
  const [tokenAddress, setTokenAddress] = useState(chainId ? appConfigs.erc20[chainId] : '');
  const [tokenDecimal, setTokenDecimal] = useState('18');

  useEffect(() => {
    if (chainId && appConfigs.erc20[chainId]) {
      setTokenAddress(appConfigs.erc20[chainId]);
    } else {
      setTokenAddress('');
      setTokenDecimal('');
      setAmount('');
    }
  }, [chainId]);

  const handleDecimalChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setTokenDecimal(numericValue);
  };

  return (
    <div className={styles.erc20} key={chainId}>
      <Input onValueChange={setTokenAddress} label={'Token Address'} value={tokenAddress} radius={'sm'} />
      <Input onValueChange={handleDecimalChange} type="number" label={'Token decimal'} value={tokenDecimal} />
      <InputAmount amount={amount} setAmount={setAmount} tokenDecimal={tokenDecimal} tokenAddress={tokenAddress} />
      <Input onValueChange={setRecipient} label={'Recipient'} value={recipient} radius={'sm'} />

      <SendToken
        tokenAddress={tokenAddress}
        tokenDecimal={Number(tokenDecimal)}
        amount={amount}
        recipient={recipient}
      />

      <ApproveToken
        tokenAddress={tokenAddress}
        tokenDecimal={Number(tokenDecimal)}
        amount={amount}
        recipient={recipient}
      />
    </div>
  );
};

export default ERC20;
