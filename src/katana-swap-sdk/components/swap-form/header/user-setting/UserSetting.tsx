import { Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import React, { FC } from 'react';
import SettingIcon from 'src/icons/SettingIcon';

import CustomSlippage from './custom-slippage/CustomSlippage';
import TransactionDeadline from './transaction-deadline/TransactionDeadline';

import styles from './UserSetting.module.scss';

const UserSetting: FC = () => {
  return (
    <>
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <Button isIconOnly>
            <SettingIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={styles.popoverLayer}>
          <div className={styles.settingRows}>
            <div className={styles.row}>
              <CustomSlippage />
            </div>

            <div className={styles.row}>
              <TransactionDeadline />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default UserSetting;
