import Button from '@components/button/Button';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/react';
import { FC } from 'react';
import Typography from 'src/components/typography/Typography';

import Classes from './SuccessModal.module.scss';

interface SuccessModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: FC<SuccessModalProps> = props => {
  const { title, isOpen, onClose } = props;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalBody>
              <div className={Classes.successModal}>
                <img className={Classes.image} src="/static/icons/success-icon.svg" />
                <Typography size="large">{title}</Typography>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button fullWidth color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SuccessModal;
