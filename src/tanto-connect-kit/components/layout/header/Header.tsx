import React, { FC } from 'react';

import ConnectorTabs from './connector-tabs/Navigation';
import Intro from './intro/Intro';

import styles from './Header.module.scss';

const Header: FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <Intro />
        <ConnectorTabs className={styles.tabs} />
      </div>
    </div>
  );
};

export default Header;
