import { Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import {
  ApproveTokenType,
  buyToken,
  Erc,
  getPaymentToken,
  getSwapTokenData,
  getTokensNeedToApprove,
  Order,
  paymentTokens,
  TokenData,
} from '@sky-mavis/mavis-market-core';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { isEmpty, isNil } from 'lodash';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import Typography from 'src/components/typography/Typography';
import WillRender from 'src/components/will-render/WillRender';
import ConnectWalletButton from 'src/mavis-market-sdk/components/connect-wallet-button/ConnectWalletButton';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';
import { generateDeadline } from 'src/mavis-market-sdk/utils/generateDeadline';
import { roundingNumber } from 'src/mavis-market-sdk/utils/roundingNumberUtil';

import ApproveAction from '../../approve-action/ApproveAction';
import SelectPaymentTokens from '../select-payment-tokens/SelectPaymentTokens';

import Classes from './BuyModal.module.scss';

interface BuyModalProps {
  order: Order;
  tokenType: Erc;
  isOpen: boolean;
  onClose: () => void;
  onBuySuccessfully: () => void;
}

const BuyModal: FC<BuyModalProps> = props => {
  const { order, tokenType, isOpen, onClose, onBuySuccessfully } = props;
  const { paymentToken, currentPrice, orderQuantity, hash } = order;

  const { chainId, connectedAccount, wallet } = useGetWalletConnectData();
  const defaultPaymentToken = paymentTokens[chainId]?.RON.address;

  const [errorMessage, setErrorMessage] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [selectedTokenAddress, setSelectedTokenAddress] = useState(defaultPaymentToken);
  const [tokensNeedToApprove, setTokensNeedToApprove] = useState<TokenData[]>([]);
  const [swappedAmount, setSwappedAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedToken = getPaymentToken(chainId, selectedTokenAddress);
  const paymentPrice = BigNumber.from(currentPrice || '0')
    .mul(parseInt(quantity) || 0)
    .toString();

  const onChangeQuantity = (event: ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  const onSelectPaymentToken = (tokenAddress: string) => {
    if (!isLoading) {
      setSelectedTokenAddress(tokenAddress);
    }
  };

  const onGetSwappedTokenAmount = async () => {
    if (!isNil(paymentToken) && !isNil(paymentPrice)) {
      try {
        setIsLoading(true);
        if (selectedTokenAddress.toLowerCase() === paymentToken.toLowerCase()) {
          const parsedAmount = formatUnits(BigNumber.from(paymentPrice), selectedToken?.decimals);
          setSwappedAmount(parsedAmount);
          return;
        }

        const { swappedAmount } = await getSwapTokenData({
          chainId,
          inputTokenAddress: selectedTokenAddress,
          outputTokenAddress: paymentToken,
          amount: paymentPrice,
        });

        const parsedAmount = formatUnits(BigNumber.from(swappedAmount), selectedToken?.decimals);
        setSwappedAmount(parsedAmount);
      } catch {
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onGetTokensNeedToApprove = async () => {
    if (!isNil(connectedAccount) && !isNil(paymentToken) && !isNil(paymentPrice)) {
      try {
        setErrorMessage('');
        setIsLoading(true);
        const tokens = await getTokensNeedToApprove(
          chainId,
          connectedAccount as string,
          selectedTokenAddress,
          paymentToken,
          paymentPrice,
        );
        setTokensNeedToApprove(tokens as TokenData[]);
      } catch (err: any) {
        setErrorMessage(err?.message || err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onApproveFailed = (errorMessage: string) => {
    setErrorMessage(errorMessage);
  };

  const onApproveSuccessfully = () => {
    const newTokensNeedToApprove = [...tokensNeedToApprove];
    newTokensNeedToApprove.shift();
    setTokensNeedToApprove([...newTokensNeedToApprove]);
  };

  const onBuy = async () => {
    const deadline = generateDeadline();

    if (!isNil(wallet) && !isNil(order)) {
      try {
        setIsLoading(true);
        setErrorMessage('');
        await buyToken({
          chainId,
          wallet,
          hash,
          selectedTokenAddress,
          deadline,
          quantity: Number(quantity),
        });
        onClose();
        onBuySuccessfully();
      } catch (err: any) {
        setErrorMessage(err.message || err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    onGetSwappedTokenAmount();
  }, [selectedTokenAddress, quantity]);

  useEffect(() => {
    onGetTokensNeedToApprove();
  }, [connectedAccount, selectedTokenAddress]);

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <Typography>Buy token</Typography>
            </ModalHeader>
            <ModalBody>
              <div className={Classes.listingDetail}>
                <WillRender when={tokenType === Erc.Erc1155}>
                  <Input
                    type="number"
                    max={orderQuantity?.availableQuantity || 0}
                    label="Quantity"
                    value={quantity}
                    onChange={onChangeQuantity}
                  />
                </WillRender>
                <SelectPaymentTokens
                  selectedTokenAddress={selectedTokenAddress}
                  onSelectPaymentToken={onSelectPaymentToken}
                />
                <WillRender when={!isLoading}>
                  <Typography color="gray">
                    Buy with {roundingNumber(swappedAmount, 4)} {selectedToken?.symbol}
                  </Typography>
                </WillRender>
                <WillRender when={isLoading}>
                  <Typography color="gray">Buy with ...</Typography>
                </WillRender>
                <WillRender when={!isEmpty(errorMessage)}>
                  <Typography size="xSmall" color="danger">
                    {errorMessage}
                  </Typography>
                </WillRender>
              </div>
            </ModalBody>
            <ModalFooter>
              <WillRender when={!isEmpty(tokensNeedToApprove)}>
                <ApproveAction
                  symbol={tokensNeedToApprove[0]?.symbol}
                  tokenAddress={tokensNeedToApprove[0]?.address}
                  tokenType={ApproveTokenType.Erc20}
                  onApproveSuccessfully={onApproveSuccessfully}
                  onApproveFailed={onApproveFailed}
                />
              </WillRender>
              <WillRender when={isEmpty(tokensNeedToApprove)}>
                <ConnectWalletButton isLoading={isLoading} fullWidth color="primary" onPress={onBuy}>
                  Buy
                </ConnectWalletButton>
              </WillRender>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BuyModal;
