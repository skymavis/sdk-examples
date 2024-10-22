import Typography from '@components/typography/Typography';
import WillRender from '@components/will-render/WillRender';
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { ConnectorEvent } from '@sky-mavis/tanto-connect';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { QRCodeSVG } from 'qrcode.react';
import { FC, useEffect, useState } from 'react';
import ArrowLeftIcon from 'src/icons/ArrowLeftIcon';
import XIcon from 'src/icons/XIcon';

import RoninWalletExtension from '../connectors/ronin-wallet-extension/RoninWalletExtension';
import RoninWalletMobile from '../connectors/ronin-wallet-mobile/RoninWalletMobile';
import RoninWaypoint from '../connectors/ronin-waypoint/RoninWaypoint';
import { useConnectorStore } from '../connectors/stores/useConnectorStore';

import styles from './ConnectWalletModal.module.scss';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
}

const ConnectWalletModal: FC<ConnectWalletModalProps> = props => {
  const { isOpen, onClose, onOpenChange } = props;

  const [isOpenQRCodeModal, setIsOpenQRCodeModal] = useState(false);
  const [uriMobile, setUriMobile] = useState('');

  const { connectedAccount, connector } = useConnectorStore();

  const exitRequestConnectMobileMode = () => {
    setIsOpenQRCodeModal(false);
    setUriMobile('');

    if (isEmpty(connectedAccount)) {
      connector?.disconnect();
    }
  };

  const onCloseModal = () => {
    onClose();
    exitRequestConnectMobileMode();
  };

  useEffect(() => {
    if (!isEmpty(connectedAccount)) {
      onCloseModal();
    }
  }, [connectedAccount]);

  useEffect(() => {
    connector?.on(ConnectorEvent.DISPLAY_URI, (data: string) => {
      setIsOpenQRCodeModal(true);
      setUriMobile(data);
    });

    return () => {
      connector?.off(ConnectorEvent.DISPLAY_URI, () => {});
    };
  }, [connector]);

  return (
    <Modal className={styles.modal} isOpen={isOpen} onClose={onCloseModal} onOpenChange={onOpenChange} hideCloseButton>
      <ModalContent>
        <ModalHeader className={styles.modalHeader}>
          <Button
            variant="light"
            className={classNames(styles.button, { [styles.invisibleButton]: !isOpenQRCodeModal })}
            isIconOnly
            onClick={exitRequestConnectMobileMode}
          >
            <ArrowLeftIcon />
          </Button>
          <Typography size="medium" bold>
            Connect Wallet
          </Typography>
          <Button variant="light" className={styles.button} isIconOnly onClick={onCloseModal}>
            <XIcon />
          </Button>
        </ModalHeader>
        <ModalBody className={styles.modalBody}>
          <WillRender when={isOpenQRCodeModal}>
            <div className={styles.qrCode}>
              <QRCodeSVG
                value={uriMobile as string}
                size={200}
                fgColor={'#111417'}
                imageSettings={{
                  src: 'https://cdn.skymavis.com/explorer-cdn/asset/favicon/apple-touch-icon.png',
                  height: 24,
                  width: 24,
                  excavate: true,
                }}
              />
              <Typography>Scan with your Ronin Wallet Mobile!</Typography>
            </div>
          </WillRender>
          <WillRender when={!isOpenQRCodeModal}>
            <RoninWalletExtension />
            <RoninWalletMobile />
            <div className={styles.orContainer}>
              <div className={styles.line}></div>
              <Typography color="gray" className={styles.orText}>
                Or continue with
              </Typography>
              <div className={styles.line}></div>
            </div>
            <RoninWaypoint />
          </WillRender>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConnectWalletModal;
