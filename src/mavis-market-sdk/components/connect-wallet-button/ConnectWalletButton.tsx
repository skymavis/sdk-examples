import Button from '@components/button/Button';
import { ButtonProps } from '@nextui-org/react';
import { FC } from 'react';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';

import { useConnectorStore } from '../layout/connectors/stores/useConnectorStore';

const ConnectWalletButton: FC<ButtonProps> = props => {
  const { onClick } = props;

  const { chainId } = useGetWalletConnectData();
  const { connector, connectedChainId } = useConnectorStore();

  const handleSwitchChainId = async () => {
    if (Number(chainId) !== Number(connectedChainId)) {
      await connector?.switchChain(Number(chainId));
    }
  };

  const onHandleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await handleSwitchChainId();

      if (onClick) {
        onClick(e);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return <Button {...props} onClick={onHandleClick} />;
};

export default ConnectWalletButton;
