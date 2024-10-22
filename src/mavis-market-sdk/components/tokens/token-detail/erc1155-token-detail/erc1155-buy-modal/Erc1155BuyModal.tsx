import WillRender from '@components/will-render/WillRender';
import { Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import {
  ApproveTokenType,
  BulkBuyOrderData,
  bulkBuyToken,
  Erc,
  Erc1155Token,
  getOrdersTotalPrice,
  getPaymentToken,
  getTokensNeedToApproveByOrders,
  paymentTokens,
  TokenData,
  WalletClient,
} from '@sky-mavis/mavis-market-core';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import Typography from 'src/components/typography/Typography';
import ConnectWalletButton from 'src/mavis-market-sdk/components/connect-wallet-button/ConnectWalletButton';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';
import { generateDeadline } from 'src/mavis-market-sdk/utils/generateDeadline';
import { roundingNumber } from 'src/mavis-market-sdk/utils/roundingNumberUtil';

import ApproveAction from '../../common-actions/approve-action/ApproveAction';
import SelectPaymentTokens from '../../common-actions/buy-action/select-payment-tokens/SelectPaymentTokens';
import Erc1155OrderItem from './erc1155-order-item/Erc1155OrderItem';

import Classes from './Erc1155BuyModal.module.scss';

interface Erc1155BuyModalProps {
  isOpen: boolean;
  tokenData: Erc1155Token;
  totalQuantity: number;
  ordersByQuantity: BulkBuyOrderData[];
  onClose: () => void;
  onBuySuccessfully: (additionalText?: string) => void;
}

const Erc1155BuyModal: FC<Erc1155BuyModalProps> = props => {
  const { isOpen, tokenData, totalQuantity, ordersByQuantity, onClose, onBuySuccessfully } = props;
  const { tokenAddress, collectionMetadata, image, name } = tokenData || {};
  const { collection_name } = collectionMetadata || {};

  const { chainId, connectedAccount, wallet } = useGetWalletConnectData();
  const router = useRouter();

  const defaultPaymentToken = paymentTokens[chainId]?.RON.address;

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState(defaultPaymentToken);
  const [swappedAmount, setSwappedAmount] = useState('');
  const [tokensNeedToApprove, setTokensNeedToApprove] = useState<TokenData[]>([]);

  const selectedToken = getPaymentToken(chainId, selectedTokenAddress);
  const formattedPrice = swappedAmount
    ? roundingNumber(formatUnits(BigNumber.from(swappedAmount), selectedToken?.decimals), 4)
    : '0';

  const onGetTokensNeedToApprove = async () => {
    try {
      setErrorMessage('');
      setIsLoading(true);
      const tokens = await getTokensNeedToApproveByOrders(
        chainId,
        wallet as WalletClient,
        ordersByQuantity,
        selectedTokenAddress,
      );
      setTokensNeedToApprove(tokens);
    } catch (err: any) {
      setErrorMessage(err?.message || err);
    } finally {
      setIsLoading(false);
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

  const onSelectPaymentToken = (tokenAddress: string) => {
    if (!isLoading) {
      setSelectedTokenAddress(tokenAddress);
    }
  };

  const onBuy = async () => {
    try {
      setIsBuying(true);
      setErrorMessage('');

      const deadline = generateDeadline();

      await bulkBuyToken({
        chainId,
        wallet: wallet as WalletClient,
        data: ordersByQuantity,
        selectedTokenAddress,
        deadline,
        tokenType: Erc.Erc1155,
        requiredAllSuccess: false,
      });

      onClose();
      onBuySuccessfully();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || err);
    } finally {
      setIsBuying(false);
    }
  };

  const onGetOrdersTotalPrice = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const ordersTotalPrice = await getOrdersTotalPrice({
        data: ordersByQuantity,
        token: selectedToken,
        chainId,
        wallet: wallet as WalletClient,
      });

      const { totalPrice } = ordersTotalPrice;
      setSwappedAmount(totalPrice);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onGetTokensNeedToApprove();
  }, [connectedAccount, selectedTokenAddress, ordersByQuantity]);

  useEffect(() => {
    onGetOrdersTotalPrice();
  }, [ordersByQuantity, selectedToken]);

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <div className={Classes.header}>
                <Typography>Bulk buy NFT</Typography>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className={Classes.tokenData}>
                <img className={Classes.image} src={image || ''} />
                <div className={Classes.tokenInfo}>
                  <Typography bold>{name || ''}</Typography>
                  <Link
                    className={Classes.collectionName}
                    onClick={() => router.push(`/mavis-market-sdk/tokens/${tokenAddress}`)}
                  >
                    {collection_name || ''}
                  </Link>
                  <Typography size="xSmall" color="gray">
                    Unavailable items will be skipped
                  </Typography>
                </div>
              </div>
              <Typography color="gray">Quantity: {totalQuantity}</Typography>
              <div className={Classes.divider} />
              <Typography color="gray">Order Details ({totalQuantity})</Typography>
              <div className={Classes.tokenList}>
                <div className={Classes.tokenHeader}>
                  <Typography color="gray">QTY</Typography>
                  <Typography color="gray">PER ITEM</Typography>
                </div>
                {ordersByQuantity.map((item, index) => (
                  <Erc1155OrderItem key={`erc1155-order-item-${index}`} tokenData={item} />
                ))}
              </div>
              <div className={Classes.paymentTokens}>
                <SelectPaymentTokens
                  selectedTokenAddress={selectedTokenAddress}
                  onSelectPaymentToken={onSelectPaymentToken}
                />
                <WillRender when={!isLoading}>
                  <Typography color="gray">
                    Buy with {formattedPrice} {selectedToken?.symbol}
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
                  tokenType={ApproveTokenType.Erc1155}
                  onApproveSuccessfully={onApproveSuccessfully}
                  onApproveFailed={onApproveFailed}
                />
              </WillRender>
              <WillRender when={isEmpty(tokensNeedToApprove)}>
                <ConnectWalletButton isLoading={isLoading || isBuying} fullWidth color="primary" onClick={onBuy}>
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

export default Erc1155BuyModal;
