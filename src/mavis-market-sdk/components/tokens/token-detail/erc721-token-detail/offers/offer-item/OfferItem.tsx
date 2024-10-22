import { acceptOffer, Offer } from '@sky-mavis/mavis-market-core';
import { isEmpty, isNil } from 'lodash';
import { FC, useState } from 'react';
import Typography from 'src/components/typography/Typography';
import WillRender from 'src/components/will-render/WillRender';
import ConnectWalletButton from 'src/mavis-market-sdk/components/connect-wallet-button/ConnectWalletButton';
import Price from 'src/mavis-market-sdk/components/price/Price';
import SuccessModal from 'src/mavis-market-sdk/components/tokens/success-modal/SuccessModal';
import { useCheckIsOwner } from 'src/mavis-market-sdk/hooks/useCheckIsOwner';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';

import Classes from './OfferItem.module.scss';

interface OfferItemProps {
  offer: Offer;
  owner: string;
}

const OfferItem: FC<OfferItemProps> = props => {
  const { offer, owner } = props;
  const { maker, makerProfile, currentPrice, hash } = offer;

  const [isAccepting, setIsAccepting] = useState(false);
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

  const onAcceptOffer = async () => {
    try {
      if (!isNil(wallet) && !isNil(chainId)) {
        setErrorMessage('');
        setIsAccepting(true);
        await acceptOffer({ chainId, wallet, hash });
        onOpenSuccessModal();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || err);
    } finally {
      setIsAccepting(false);
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
        <WillRender when={!isEmpty(errorMessage)}>
          <Typography color="danger" size="xSmall">
            {errorMessage}
          </Typography>
        </WillRender>
      </div>
      <WillRender when={isOwner}>
        <ConnectWalletButton variant="bordered" isLoading={isAccepting} onClick={onAcceptOffer}>
          Accept offer
        </ConnectWalletButton>
      </WillRender>
      <SuccessModal title="Accept offer successfully" isOpen={isOpenSuccessModal} onClose={onCloseSuccessModal} />
    </div>
  );
};

export default OfferItem;
