import { Button, Modal, ModalContent } from '@nextui-org/react';
import React, { FC, useState } from 'react';

import ListIcon from '../../../../../icons/ListIcon';
import ConnectorTabs from '../connector-tabs/Navigation';

import styles from './MobileTabs.module.scss';

const MobileTabs: FC = () => {
  const [isOpen, setOpen] = useState(false);

  const handleToggleMenu = () => {
    setOpen(prv => !prv);
  };

  return (
    <div className={styles.mobileTabs}>
      <Button isIconOnly onPress={handleToggleMenu} variant={'light'} size={'sm'}>
        <ListIcon />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={handleToggleMenu}>
        <ModalContent>
          <ConnectorTabs isVertical={true} />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MobileTabs;
