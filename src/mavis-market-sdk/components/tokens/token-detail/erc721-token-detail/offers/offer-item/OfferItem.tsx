import { acceptOffer, ApproveTokenType, CollectionData, Offer } from '@sky-mavis/mavis-market-core';
import { isEmpty, isNil } from 'lodash';
import { FC, useState } from 'react';
import Typography from 'src/components/typography/Typography';
import WillRender from 'src/components/will-render/WillRender';
import ConnectWalletButton from 'src/mavis-market-sdk/components/connect-wallet-button/ConnectWalletButton';
import Price from 'src/mavis-market-sdk/components/price/Price';
import SuccessModal from 'src/mavis-market-sdk/components/tokens/success-modal/SuccessModal';
import { useCheckIsOwner } from 'src/mavis-market-sdk/hooks/useCheckIsOwner';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';

import ApproveAction from '../../../common-actions/approve-action/ApproveAction';

import Classes from './OfferItem.module.scss';

interface OfferItemProps {
  isApproved: boolean;
  isCheckingAcceptance: boolean;
  collectionData: CollectionData;
  offer: Offer;
  owner: string;
  setIsApproved: (isApproved: boolean) => void;
}

const OfferItem: FC<OfferItemProps> = props => {
  const { isApproved, isCheckingAcceptance, collectionData, offer, owner, setIsApproved } = props;
  const { tokenAddress, collectionMetadata } = collectionData || {};
  const collectionName = collectionMetadata?.collection_name || '';
  const { maker, makerProfile, currentPrice, hash } = offer || {};

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);

  const isOwner = useCheckIsOwner(owner);
  const { wallet, chainId } = useGetWalletConnectData();

  const onOpenSuccessModal = () => {
    setIsOpenSuccessModal(true);
  };

  const onCloseSuccessModal = () => {
    setIsOpenSuccessModal(false);
  };

  const onApproveSuccessfully = () => {
    setIsApproved(true);
  };

  const onApproveFailed = (errorMessage: string) => {
    setErrorMessage(errorMessage);
  };

  const onAcceptOffer = async () => {
    try {
      if (!isNil(wallet) && !isNil(chainId)) {
        setErrorMessage('');
        setIsLoading(true);

        await acceptOffer({ chainId, wallet, hash });
        onOpenSuccessModal();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={Classes.offerItem}>
      <div className={Classes.detail}>
        <div className={Classes.item}>
          <Typography size="xSmall" color="gray">
            From:
          </Typography>
          <Typography size="xSmall">{makerProfile?.name || maker}</Typography>
        </div>
        <div className={Classes.item}>
          <Typography size="xSmall" color="gray">
            Offer price:
          </Typography>
          <Price amount={currentPrice} isWRON />
        </div>
      </div>
      <WillRender when={isOwner}>
        <div>
          <WillRender when={!isApproved}>
            <ApproveAction
              symbol={collectionName}
              tokenAddress={tokenAddress}
              tokenType={ApproveTokenType.Erc721}
              onApproveSuccessfully={onApproveSuccessfully}
              onApproveFailed={onApproveFailed}
              fullWidth={false}
              isLoading={isCheckingAcceptance}
              variant="bordered"
              color="default"
            />
          </WillRender>
          <WillRender when={isApproved}>
            <ConnectWalletButton variant="bordered" isLoading={isLoading} onClick={onAcceptOffer}>
              Accept offer
            </ConnectWalletButton>
          </WillRender>
        </div>
      </WillRender>
      <WillRender when={!isEmpty(errorMessage)}>
        <Typography color="danger" size="xSmall">
          {errorMessage}
        </Typography>
      </WillRender>
      <SuccessModal title="Accept offer successfully" isOpen={isOpenSuccessModal} onClose={onCloseSuccessModal} />
    </div>
  );
};

export default OfferItem;
