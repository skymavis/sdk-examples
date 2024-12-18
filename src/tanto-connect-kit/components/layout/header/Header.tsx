import WillRender from '@components/will-render/WillRender';
import React, { FC } from 'react';

import ConnectorTabs from './connector-tabs/Navigation';
import Intro from './intro/Intro';

import styles from './Header.module.scss';

interface IPropsType {
  showConnectorTabs?: boolean;
}

const Header: FC<IPropsType> = ({ showConnectorTabs = true }) => {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <Intro />
        <WillRender when={showConnectorTabs}>
          <ConnectorTabs className={styles.tabs} />
        </WillRender>
      </div>
    </div>
  );
};

export default Header;
