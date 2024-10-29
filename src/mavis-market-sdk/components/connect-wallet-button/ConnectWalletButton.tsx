import Button from '@components/button/Button';
import { ButtonProps } from '@nextui-org/react';
import { PressEvent } from '@react-types/shared';
import { FC } from 'react';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';

import { useConnectorStore } from '../layout/connectors/stores/useConnectorStore';

const ConnectWalletButton: FC<ButtonProps> = props => {
  const { onPress } = props;

  const { chainId } = useGetWalletConnectData();
  const { connector, connectedChainId } = useConnectorStore();

  const handleSwitchChainId = async () => {
    if (Number(chainId) !== Number(connectedChainId)) {
      await connector?.switchChain(Number(chainId));
    }
  };

  const onHandleClick = async (e: PressEvent) => {
    try {
      await handleSwitchChainId();

      if (onPress) {
        onPress(e);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return <Button {...props} onPress={onHandleClick} />;
};

export default ConnectWalletButton;
