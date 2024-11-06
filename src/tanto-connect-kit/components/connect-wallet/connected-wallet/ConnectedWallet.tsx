import Button from '@components/button/Button';
import Typography from '@components/typography/Typography';
import Avatar from 'boring-avatars';
import React, { FC, useState } from 'react';

import { truncateAddress } from '../../../../mavis-market-sdk/utils/addressUtil';

import styles from './ConnectedWallet.module.scss';

interface IPropsType {
  account?: string | null;
  chainId?: number | null;
  disconnect: () => void;
  connectorName?: string;
  avatarVariant?: 'marble' | 'beam' | 'pixel' | 'sunset' | 'ring' | 'bauhaus';
}

const ConnectedWallet: FC<IPropsType> = props => {
  const { account, chainId, disconnect, connectorName, avatarVariant } = props;
  const [isCopied, setIdCopied] = useState(false);

  if (!account || !chainId) {
    return null;
  }

  const copyAccountAddress = () => {
    if (!isCopied && account) {
      navigator.clipboard.writeText(account).then(() => {
        setIdCopied(true);
        setTimeout(() => setIdCopied(false), 2000);
      });
    }
  };

  return (
    <div className={styles.connectedWallet}>
      <Typography bold size={'xSmall'}>
        Connected
      </Typography>
      <Avatar name={account} size={80} variant={avatarVariant ?? 'marble'} />

      <div className={styles.content}>
        <Typography bold>{truncateAddress(account)}</Typography>
        <Typography size={'xSmall'} color={'gray'}>
          {connectorName ? `${connectorName} |` : ''} Chain ID: {chainId}
        </Typography>
      </div>

      <div className={styles.actions}>
        <Button onClick={copyAccountAddress} fullWidth={true} radius={'sm'}>
          {isCopied ? 'Copied!' : 'Copy Address'}
        </Button>
        <Button color={'primary'} onClick={disconnect} fullWidth={true} radius={'sm'}>
          Disconnect
        </Button>
      </div>
    </div>
  );
};

export default ConnectedWallet;
