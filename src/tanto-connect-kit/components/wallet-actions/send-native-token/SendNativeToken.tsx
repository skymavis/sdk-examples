import Button from '@components/button/Button';
import WillRender from '@components/will-render/WillRender';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { Input } from '@nextui-org/react';
import { ethers } from 'ethers';
import { isNil } from 'lodash';
import React, { FC, useState } from 'react';

import { appConfigs } from '../../../common/constant';
import useConnectStore from '../../../stores/useConnectStore';

import styles from './SendNativeToken.module.scss';

const SendNativeToken: FC = () => {
  const { connector, isConnected } = useConnectStore();

  const [recipient, setRecipient] = useState(appConfigs.recipient);
  const [amount, setAmount] = useState(appConfigs.amount);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>();

  const sendNativeToken = async () => {
    setIsLoading(true);
    const provider = await connector?.getProvider();
    const web3Provider = new Web3Provider(provider as ExternalProvider);
    const signer = web3Provider.getSigner();
    const transaction = {
      to: recipient,
      value: ethers.utils.parseEther(amount),
    };

    signer
      .sendTransaction(transaction)
      .then(tx => setTxHash(tx.hash))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  return (
    <div className={styles.sendNativeToken}>
      <Input label={'Amount'} value={amount} onValueChange={setAmount} radius={'sm'} />
      <Input label={'Recipient'} value={recipient} radius={'sm'} onValueChange={setRecipient} />
      <Button
        disabled={!recipient || !amount || !isConnected}
        onPress={sendNativeToken}
        color={'primary'}
        radius={'sm'}
        isLoading={isLoading}
      >
        Send
      </Button>
      <WillRender when={!isNil(txHash)}>
        <Input label={'Transaction Hash'} value={txHash} disabled color={'primary'} radius={'sm'} />
      </WillRender>
    </div>
  );
};

export default SendNativeToken;
