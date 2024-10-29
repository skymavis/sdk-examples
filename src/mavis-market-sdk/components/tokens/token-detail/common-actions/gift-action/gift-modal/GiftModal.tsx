import { Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { Erc, giftToken } from '@sky-mavis/mavis-market-core';
import { isEmpty, isNil } from 'lodash';
import { ChangeEvent, FC, useState } from 'react';
import Typography from 'src/components/typography/Typography';
import WillRender from 'src/components/will-render/WillRender';
import ConnectWalletButton from 'src/mavis-market-sdk/components/connect-wallet-button/ConnectWalletButton';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';

import Classes from './GiftModal.module.scss';

interface GiftModalProps {
  tokenId: string;
  tokenAddress: string;
  tokenType: Erc;
  isOpen: boolean;
  maxQuantity?: number;
  onClose: () => void;
  onGiftSuccessfully: () => void;
}

const GiftModal: FC<GiftModalProps> = props => {
  const { tokenAddress, tokenId, tokenType, maxQuantity = 1, isOpen, onClose, onGiftSuccessfully } = props;

  const [receiverAddress, setReceiverAddress] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGifting, setIsGifting] = useState(false);

  const { chainId, wallet } = useGetWalletConnectData();

  const onChangeReceiverAddress = (event: ChangeEvent<HTMLInputElement>) => {
    setReceiverAddress(event.target.value);
  };

  const onChangeQuantity = (event: ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  const onGift = async () => {
    try {
      if (!isNil(wallet)) {
        setIsGifting(true);
        setErrorMessage('');
        await giftToken({ chainId, wallet, tokenId, tokenAddress, receiverAddress, quantity: Number(quantity) });
        onClose();
        onGiftSuccessfully();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || err);
    } finally {
      setIsGifting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <Typography>Gift token</Typography>
            </ModalHeader>
            <ModalBody>
              <div className={Classes.giftDetail}>
                <Input label="Received address" value={receiverAddress} onChange={onChangeReceiverAddress} />
                <WillRender when={tokenType === Erc.Erc1155}>
                  <Input
                    type="number"
                    max={maxQuantity}
                    label="Quantity"
                    value={quantity}
                    onChange={onChangeQuantity}
                  />
                </WillRender>
                <WillRender when={!isEmpty(errorMessage)}>
                  <Typography size="xSmall" color="danger">
                    {errorMessage}
                  </Typography>
                </WillRender>
              </div>
            </ModalBody>
            <ModalFooter>
              <ConnectWalletButton fullWidth isLoading={isGifting} color="primary" onPress={onGift}>
                Gift
              </ConnectWalletButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default GiftModal;
