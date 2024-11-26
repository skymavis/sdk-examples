import Typography from '@components/typography/Typography';
import WillRender from '@components/will-render/WillRender';
import { Chip } from '@nextui-org/chip';
import { Button } from '@nextui-org/react';
import React, { FC, useEffect } from 'react';

import styles from './ConnectButton.module.scss';

interface IPropsType {
  text: string;
  icon?: string;
  onClick?: () => void;
  isRecent?: boolean;
  isLoading?: boolean;
}

const ConnectButton: FC<IPropsType> = props => {
  const { text, icon, isRecent, isLoading, onClick } = props;

  useEffect(() => {
    window.ethereum?.request({ method: 'eth_requestAccounts' });
  }, []);
  return (
    <div className={styles.connectWallet}>
      <Button
        size={'lg'}
        variant={'light'}
        onPress={onClick}
        isLoading={isLoading}
        className={styles.connectBtn}
        startContent={icon && <img src={icon} className={styles.icon} alt={text} />}
        fullWidth
      >
        <Typography bold>{text}</Typography>
        <WillRender when={!!isRecent}>
          <Chip color="success" variant="dot" className={styles.chip}>
            Recent
          </Chip>
        </WillRender>
      </Button>
    </div>
  );
};

export default ConnectButton;
