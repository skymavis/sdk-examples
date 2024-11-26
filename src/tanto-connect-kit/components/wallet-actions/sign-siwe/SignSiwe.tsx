import Button from '@components/button/Button';
import WillRender from '@components/will-render/WillRender';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { Textarea } from '@nextui-org/input';
import { isNil } from 'lodash';
import React, { FC, useState } from 'react';

import useConnectStore from '../../../stores/useConnectStore';

import styles from './SignSiwe.module.scss';

const SignSIWE: FC = () => {
  const { connector, chainId, account, isConnected } = useConnectStore();

  const [signature, setSignature] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateSiweMessage = () => {
    const domain = window.location.hostname;
    const description = 'wants you to sign in with your Ethereum account:';
    const statement = 'I accept the Terms of Use';
    const uri = `URI: ${window.location.origin}`;
    const version = `Version: 1`;
    const chain = `Chain ID: ${chainId}`;
    const nonceText = `Nonce: ${123456789}`;
    const issuedAtText = `Issued At: ${new Date().toISOString()}`;

    return `${domain} ${description}\n${account}\n\n${statement}\n\n${uri}\n${version}\n${chain}\n${nonceText}\n${issuedAtText}`;
  };

  async function signSIWE() {
    try {
      setIsLoading(true);
      const provider = await connector?.getProvider();
      const web3Provider = new Web3Provider(provider as ExternalProvider);
      const message = generateSiweMessage();
      const signer = web3Provider.getSigner();
      const signature = await signer.signMessage(message);
      setSignature(signature);
    } catch (error) {
      console.error('[sign_siwe]', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.signSiwe}>
      <Button onPress={signSIWE} isLoading={isLoading} color="primary" radius={'sm'} disabled={!isConnected}>
        Sign SIWE
      </Button>
      <WillRender when={!isNil(signature)}>
        <Textarea readOnly value={signature} label="Signature Hash" color={'primary'} radius={'sm'} />
      </WillRender>
    </div>
  );
};

export default SignSIWE;
