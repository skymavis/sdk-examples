import Typography from '@components/typography/Typography';
import { Button, useDisclosure } from '@nextui-org/react';
import { Percent } from '@uniswap/sdk-core';
import React, { FC, useState } from 'react';
import { useSwapContext } from 'src/katana-swap-sdk/context/SwapContext';
import { Allowance, AllowanceState } from 'src/katana-swap-sdk/hooks/permit/usePermit2Allowance';
import { useExpertModeManager } from 'src/katana-swap-sdk/hooks/store/user/useUserActionHandler';
import { useSwapCallback } from 'src/katana-swap-sdk/hooks/useSwapCallback';
import confirmPriceImpactWithoutFee from 'src/katana-swap-sdk/utils/confirmPriceImpactWithoutFee';
import { WarningSeverity } from 'src/katana-swap-sdk/utils/prices';

import TxStatusModal, { TxStatusError } from '../../tx-status-modal/TxStatusModal';

type Props = {
  disabled?: boolean;
  priceImpactSeverity: WarningSeverity;
  stablecoinPriceImpact: Percent | undefined;
  allowance: Allowance;
};

const SwapBtn: FC<Props> = ({ disabled, priceImpactSeverity, stablecoinPriceImpact, allowance }) => {
  const [loading, setLoading] = useState(false);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isExpertMode] = useExpertModeManager();

  const [txStatus, setTxStatus] = React.useState<{ hash?: string; error?: TxStatusError }>({
    hash: undefined,
    error: undefined,
  });

  const { derivedSwapInfo, computedSwapInfo } = useSwapContext();
  const { inputError: swapInputError } = derivedSwapInfo ?? {};
  const { routeIsLoading, routeIsSyncing } = computedSwapInfo ?? {};

  const swapCallback = useSwapCallback(
    allowance.state === AllowanceState.ALLOWED ? allowance.permitSignature : undefined,
  );

  const priceImpactTooHigh = priceImpactSeverity > 3 && !isExpertMode;

  const buttonText = swapInputError
    ? swapInputError
    : priceImpactTooHigh
    ? 'High Price Impact'
    : routeIsSyncing || routeIsLoading
    ? 'Swap'
    : priceImpactSeverity > 2
    ? 'Swap Anyway'
    : 'Swap';

  const warningSwap = !swapInputError && priceImpactSeverity > 2 && allowance.state === AllowanceState.ALLOWED;

  const handleSwap = async () => {
    if (!swapCallback) {
      return;
    }
    if (stablecoinPriceImpact && !confirmPriceImpactWithoutFee(stablecoinPriceImpact)) {
      return;
    }

    await swapCallback({
      onSuccess(txHash) {
        setTxStatus({
          hash: txHash,
        });
        onOpen();
      },
      onFailed(error, txHash) {
        setTxStatus({
          hash: txHash,
          error: error,
        });
        onOpen();
      },
    });
  };

  return (
    <>
      <Button
        onClick={async () => {
          setLoading(true);
          await handleSwap();
          setLoading(false);
        }}
        isDisabled={disabled}
        color={warningSwap ? 'danger' : swapInputError ? 'default' : 'primary'}
        isLoading={(!swapInputError && (routeIsSyncing || routeIsLoading)) || loading}
        fullWidth
        size="lg"
      >
        <Typography size="small">{buttonText}</Typography>
      </Button>
      <TxStatusModal label="Swap" isOpen={isOpen} onClose={onClose} {...txStatus} />
    </>
  );
};

export default SwapBtn;
