import { approveToken, ApproveTokenType } from '@sky-mavis/mavis-market-core';
import { isNil } from 'lodash';
import { FC, useState } from 'react';
import ConnectWalletButton from 'src/mavis-market-sdk/components/connect-wallet-button/ConnectWalletButton';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';

interface ApproveActionProps {
  symbol: string | null;
  tokenAddress: string;
  tokenType: ApproveTokenType;
  onApproveSuccessfully: () => void;
  onApproveFailed: (errorMessage: string) => void;
}

const ApproveAction: FC<ApproveActionProps> = props => {
  const { symbol, tokenAddress, tokenType, onApproveSuccessfully, onApproveFailed } = props;

  const { chainId, wallet } = useGetWalletConnectData();

  const [isApproving, setIsApproving] = useState(false);

  const onApprove = async () => {
    if (!isNil(wallet)) {
      try {
        setIsApproving(true);
        await approveToken({ chainId, wallet, address: tokenAddress, tokenType });
        onApproveSuccessfully();
      } catch (err: any) {
        onApproveFailed(err?.message || err);
      } finally {
        setIsApproving(false);
      }
    }
  };

  return (
    <ConnectWalletButton color="primary" isLoading={isApproving} fullWidth onPress={onApprove}>
      Approve {symbol}
    </ConnectWalletButton>
  );
};

export default ApproveAction;
