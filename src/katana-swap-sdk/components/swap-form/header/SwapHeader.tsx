import Typography from '@components/typography/Typography';
import React, { FC } from 'react';

import UserSetting from './user-setting/UserSetting';

import styles from './SwapHeader.module.scss';

const SwapHeader: FC = () => {
  return (
    <div className={styles.Container}>
      <Typography size="large">Swap</Typography>
      <div className={styles.RightSection}>
        <UserSetting />
      </div>
    </div>
  );
};

export default SwapHeader;
