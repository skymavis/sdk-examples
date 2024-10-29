import Button from '@components/button/Button';
import Typography from '@components/typography/Typography';
import WillRender from '@components/will-render/WillRender';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { ConnectorEvent } from '@sky-mavis/tanto-connect';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { FC, useEffect, useState } from 'react';
import ArrowLeftIcon from 'src/icons/ArrowLeftIcon';
import XIcon from 'src/icons/XIcon';

import ConnectRoninExtensionButton from '../connectors/connect-ronin-extension-button/ConnectRoninExtensionButton';
import ConnectRoninMobileWalletButton from '../connectors/connect-ronin-mobile-wallet-button/ConnectRoninMobileWalletButton';
import ConnectWaypointButton from '../connectors/connect-waypoint-button/ConnectWaypointButton';
import { useConnectorStore } from '../connectors/stores/useConnectorStore';
import QRCode from './qr-code/QRCode';
import RoninWalletConnectContent from './ronin-wallet-connect-content/RoninWalletConnectContent';

import styles from './ConnectWalletModal.module.scss';

export enum ConnectModalMode {
  QR_CODE_CONTENT = 'QR_CODE_CONTENT',
  CONNECT_RONIN_WALLET_CONNECT_CONTENT = 'CONNECT_RONIN_WALLET_CONNECT_CONTENT',
  CONNECT_BUTTONS = 'CONNECT_BUTTONS',
}

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
}

const ConnectWalletModal: FC<ConnectWalletModalProps> = props => {
  const { isOpen, onClose, onOpenChange } = props;

  const [modalMode, setModalMode] = useState<ConnectModalMode>(ConnectModalMode.CONNECT_BUTTONS);
  const [uri, setUri] = useState('');

  const { connectedAccount, connector } = useConnectorStore();

  const shouldShowBackButton =
    modalMode !== ConnectModalMode.QR_CODE_CONTENT &&
    modalMode !== ConnectModalMode.CONNECT_RONIN_WALLET_CONNECT_CONTENT;

  const exitRequestConnectMobileMode = () => {
    setModalMode(ConnectModalMode.CONNECT_BUTTONS);
    setUri('');

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
      setUri(data);
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
            className={classNames(styles.button, { [styles.invisibleButton]: shouldShowBackButton })}
            isIconOnly
            onPress={exitRequestConnectMobileMode}
          >
            <ArrowLeftIcon />
          </Button>
          <Typography size="medium" bold>
            Connect Wallet
          </Typography>
          <Button variant="light" className={styles.button} isIconOnly onPress={onCloseModal}>
            <XIcon />
          </Button>
        </ModalHeader>
        <ModalBody className={styles.modalBody}>
          <WillRender when={modalMode === ConnectModalMode.CONNECT_RONIN_WALLET_CONNECT_CONTENT}>
            <RoninWalletConnectContent uri={uri} />
          </WillRender>
          <WillRender when={modalMode === ConnectModalMode.QR_CODE_CONTENT}>
            <QRCode uri={uri} />
          </WillRender>
          <WillRender when={modalMode === ConnectModalMode.CONNECT_BUTTONS}>
            <ConnectRoninExtensionButton />
            <ConnectRoninMobileWalletButton
              isUsingQrCode
              className={styles.connectByQrCode}
              onClick={() => setModalMode(ConnectModalMode.QR_CODE_CONTENT)}
            />
            <ConnectRoninMobileWalletButton
              className={styles.connectMobileWallet}
              onClick={() => setModalMode(ConnectModalMode.CONNECT_RONIN_WALLET_CONNECT_CONTENT)}
            />
            <div className={styles.orContainer}>
              <div className={styles.line}></div>
              <Typography color="gray" className={styles.orText}>
                Or continue with
              </Typography>
              <div className={styles.line}></div>
            </div>
            <ConnectWaypointButton />
          </WillRender>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConnectWalletModal;
