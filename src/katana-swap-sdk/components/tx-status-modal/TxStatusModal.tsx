import Button from '@components/button/Button';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/react';
import cl from 'classnames';
import { FC, ReactNode } from 'react';
import Typography from 'src/components/typography/Typography';

import styles from './TxStatusModal.module.scss';

export type TxStatusError = { title: string; message: string };

type TxStatusModalProps = {
  label: string;
  hash?: string;
  error?: TxStatusError;
  isOpen: boolean;
  onClose: () => void;
};

function CommonModalBodyTxStatus({
  description,
  label,
  image,
}: {
  description?: ReactNode;
  label: ReactNode;
  image?: ReactNode;
}) {
  return (
    <ModalBody className={styles.CommonModalBodyTxStatus}>
      {/* <div className={styles.DialogContent}> */}
      {/* <div className={styles.DialogContainMain}> */}
      {image}
      {label && (
        <Typography size="medium" className={styles.DialogContentTitle}>
          {label}
        </Typography>
      )}
      {description && (
        <Typography color="gray" className={styles.DialogContentMessage}>
          {description}
        </Typography>
      )}
    </ModalBody>
  );
}

function TransactionSuccessContent({
  hash,
  content,
  label,
  onDismiss,
}: {
  hash: string;
  content: ReactNode;
  label: string;
  onDismiss: () => void;
}) {
  return (
    <>
      <CommonModalBodyTxStatus
        image={
          <div className={cl(styles.TransactionStatusIconWrapper, styles.Success)}>
            {/* <ValidCheckIcon size={20} className={styles.Icon} /> */}
          </div>
        }
        label={`${label} success`}
        description={
          <div className={styles.TransactionSuccessContentDescription}>
            {content}

            {/* <ExplorerLink data={hash} type={ExplorerDataType.TRANSACTION} external>
              View on explorer
            </ExplorerLink> */}
          </div>
        }
      />
      <ModalFooter>
        <div className={styles.DialogContentBtn} onClick={onDismiss}>
          <Button intent="primary" size="lg" fullWidth onClick={onDismiss}>
            Close
          </Button>
          <Button
            color="primary"
            size="lg"
            fullWidth
            onClick={() => {
              window?.open(`https://app.roninchain.com/tx/${hash}`, '_blank');
            }}
          >
            View on explorer
          </Button>
        </div>
      </ModalFooter>
    </>
  );
}

function TransactionErrorContent({
  error,
  onDismiss,
  hash,
}: {
  error: { title: string; message: string };
  onDismiss: () => void;
  hash?: string;
}) {
  return (
    <>
      <CommonModalBodyTxStatus
        image={
          <div className={cl(styles.TransactionStatusIconWrapper, styles.Failed)}>
            {/* <CrossRemoveIcon size={20} className={styles.Icon} /> */}
          </div>
        }
        label={error.title}
        description={
          <div className={styles.TransactionSuccessContentDescription}>
            {error.message}
            {hash && (
              // <ExplorerLink data={hash} type={ExplorerDataType.TRANSACTION} external>
              //   View on explorer
              // </ExplorerLink>
              <div>View on explorer</div>
            )}
          </div>
        }
      />
      <ModalFooter>
        <Button
          intent="neutral"
          label={'Try again'}
          size="lg"
          onClick={onDismiss}
          fullWidth
          className={styles.DialogContentBtn}
        />
      </ModalFooter>
    </>
  );
}

const TxStatusModal: FC<TxStatusModalProps> = props => {
  const { label, isOpen, onClose, hash, error } = props;

  if (!hash && !error) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            {!!error && (
              <TransactionErrorContent
                hash={hash}
                error={{ title: 'Transaction failed', message: 'Please try again' }}
                onDismiss={onClose}
              />
            )}

            {!!hash && !error && <TransactionSuccessContent hash={hash} content="" label={label} onDismiss={onClose} />}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TxStatusModal;
