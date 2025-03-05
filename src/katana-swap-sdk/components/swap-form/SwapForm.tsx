import { FC } from 'react';

import { AdvancedSwapDetailCollapse } from './body/advanced-swap-detail/AdvancedSwapDetail';
import SwapFormBody from './body/SwapFormBody';
import SwapFormFooter from './footer/SwapFormFooter';
import SwapHeader from './header/SwapHeader';

import styles from './SwapForm.module.scss';

const SwapForm: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SwapHeader />
      </div>
      <SwapFormBody />
      <div className={styles.footer}>
        <SwapFormFooter />
      </div>
      <AdvancedSwapDetailCollapse />
    </div>
  );
};

export default SwapForm;
