import Typography from '@components/typography/Typography';
import { Button, ButtonProps } from '@nextui-org/react';
import React, { FC } from 'react';
import { useGetWalletConnectData } from 'src/katana-swap-sdk/hooks/useGetWalletConnectData';
import { useConnectorStore } from 'src/mavis-market-sdk/components/layout/connectors/stores/useConnectorStore';

const WalletRequiredButton: FC<ButtonProps> = props => {
  const { children, ...restProps } = props;

  const { connectedAccount, chainId } = useGetWalletConnectData();
  const { connectedChainId, connector } = useConnectorStore();

  if (!connectedAccount)
    return (
      <Button fullWidth {...restProps} isDisabled>
        <Typography size="small">Please connect your wallet</Typography>
      </Button>
    );
  else if (Number(chainId) !== connectedChainId)
    return (
      <Button
        fullWidth
        {...restProps}
        color="primary"
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          try {
            connector?.switchChain(chainId);
          } catch (e) {
            console.error(e);
          }
        }}
      >
        <Typography size="small">Switch chain</Typography>
      </Button>
    );

  return <>{children}</>;
};

export default WalletRequiredButton;
